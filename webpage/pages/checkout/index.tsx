import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import { useForm, useWatch } from "react-hook-form";
import { debounce, intersection, isEqual, prop } from "lodash/fp";

import useData from "../../hooks/useData";
import { COUNTRY_CODES } from "../../constants";
import useShoppingCart from "../../hooks/useShoppingCart";
import ErrorComponent from "../../components/ErrorComponent";
import getShippingInfo from "../../queries/getShippingInfo";
import makeGetStaticProps, { Props } from "../../utils/makeGetStaticProps";
import isServer from "../../utils/isServer";
import Button from "../../components/Button";
import Layout from "../../components/Layout";
import Address from "../../components/Address";
import Carousel from "../../components/Carousel";
import { Address as AddressType } from "../../types";
import Link from "../../components/Link";
import useIsMobile from "../../hooks/useIsMobile";

// Test card: 4000002760003184

export const getStaticProps = makeGetStaticProps(getShippingInfo);

const CardWrapper = styled.div`
  iframe {
    height: 3rem !important;
  }
`;

const CARD_ELEMENT_OPTIONS = {
  style: { base: { fontSize: "1.5rem", lineHeight: "2rem" } },
  hideIcon: true,
  hidePostalCode: true,
};

const Wrapper = styled.div`
  padding: 0 1.5rem;
  overflow-y: auto;
`;

const ItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const THUMBNAILS_WIDTH_PX = 100;

const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  gap: 2rem;
  padding: 3rem;

  a {
    text-decoration: underline;

    &:hover {
      cursor: pointer;
      opacity: 0.5;
    }
  }

  @media only screen and (max-width: 480px) {
    text-align: center;
  }
`;

const ShippingInfo = styled.div`
  margin: 1rem 0;
  font-size: 1.2rem;
`;

const Rule = styled.hr`
  border-top: none;
`;

const DEFAULT_ADDRESS_VALUES: AddressType = {
  name: "",
  addressLine1: "",
  email: "",
  addressLine2: "",
  state: "",
  city: "",
  country: "Norway",
  postalCode: "",
};

const REQUIRED_FIELDS: (keyof AddressType)[] = ["name", "addressLine1", "email", "state", "city", "postalCode"];

const GENERIC_ERROR = "Something went wrong";

const filledRequiredFields = (dirtyFields: object) =>
  isEqual(intersection(Object.keys(dirtyFields), REQUIRED_FIELDS), REQUIRED_FIELDS);

const handleValues = ({ country, addressLine1, addressLine2, postalCode, ...rest }: Partial<AddressType>): object => ({
  ...rest,
  line1: addressLine1,
  line2: addressLine2,
  postal_code: postalCode,
  country: COUNTRY_CODES[country ?? "Norway"],
});

const Checkout = (props: Props<{ shippingInfo: string | null }>) => {
  const { data } = useData<{ shippingInfo: string | null }>(getShippingInfo, "shippingInfo");
  const shippingInfo = data?.shippingInfo || props?.data?.shippingInfo;
  console.log("🔥🔥🔥 ", { props, data, shippingInfo });

  const [error, setError] = useState<string | undefined>(undefined);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const isMobile = useIsMobile();
  const carouselRef = useRef(null);
  const { push } = useRouter();

  const { nItems, shoppingCart, removeFromCart, onSuccess } = useShoppingCart();
  const stripe = useStripe();
  const elements = useElements();
  const totalPrice = shoppingCart.items.reduce((total, { price }) => total + price, 0);

  const {
    control,
    formState: { isSubmitting, dirtyFields },
    handleSubmit: submitWrapper,
  } = useForm({ defaultValues: DEFAULT_ADDRESS_VALUES, mode: "onChange" });

  const values = useWatch({ control });
  const details = useMemo(() => handleValues(values), [values]);

  const ready = !isSubmitting && nItems > 0 && filledRequiredFields(dirtyFields);

  const getClientSecret = useCallback(async ({ email, ...address }, items, total) => {
    const itemIds = items.map(prop("_id"));
    const headers = { "Content-Type": "application/json" };
    const data = JSON.stringify({
      itemIds,
      email,
      address,
      total,
    });

    const response = await fetch("/api/payments/create-intent", {
      method: "POST",
      body: data,
      headers,
    });

    if (!response.ok) {
      const errorMessage = !response.headers.get("Content-Type")?.includes("html")
        ? await response.text()
        : GENERIC_ERROR;
      setError(errorMessage);
      return;
    }

    try {
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (err: unknown) {
      if (typeof err === "string") setError(err);
      else if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  }, []);

  const debouncedGetClientSecret = useMemo(() => debounce(1000, getClientSecret), [getClientSecret]);

  useEffect(() => {
    if (!ready) return;
    debouncedGetClientSecret(details, shoppingCart?.items, totalPrice);
  }, [debouncedGetClientSecret, details, ready, shoppingCart?.items, totalPrice]);

  const submit = useCallback(async () => {
    try {
      setError("");
      setProcessing(true);
      const card = elements?.getElement(CardElement);

      if (!card) {
        setError("Something went wrong");
        setProcessing(false);
        return;
      }

      const { name, email, ...address }: Partial<AddressType> = details;
      const data = {
        payment_method: {
          card,
          billing_details: {
            name,
            email,
            address,
          },
        },
      };

      const payload = await stripe?.confirmCardPayment(clientSecret, data);

      if (payload?.error) {
        setError(payload.error.message);
      } else if (payload?.paymentIntent) {
        setError("");
        onSuccess(payload?.paymentIntent);
        push("/checkout/success");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setProcessing(false);
    }
  }, [clientSecret, elements, details, onSuccess, push, stripe]);

  const handleSubmit = useMemo(() => submitWrapper(submit), [submit, submitWrapper]);

  const images = useMemo(
    () =>
      shoppingCart?.items
        ?.filter?.(({ piece }) => (piece?.images?.length ?? 0) > 0)
        .map(({ piece }) => {
          const imageUrl = piece!.images![0]!.asset!.url;
          return { original: imageUrl, thumbnail: imageUrl };
        }),
    [shoppingCart?.items]
  );

  const handleRemove = useCallback(() => {
    // @ts-ignore
    const currentIndex = carouselRef?.current?.getCurrentIndex?.();

    if (typeof currentIndex !== "number") {
      console.error("Could not get index of item for removal");
      return;
    }

    removeFromCart(shoppingCart?.items?.[currentIndex]);
  }, [removeFromCart, shoppingCart?.items]);

  if (!stripe || !elements) return null;

  if (nItems < 1) {
    return (
      <Layout projects={props.projects} email={props.email}>
        <EmptyStateWrapper>
          <span>There are no items in the cart</span>
          <span>
            Head over to the <Link href="/shop">shop</Link> to add some
          </span>
        </EmptyStateWrapper>
      </Layout>
    );
  }

  return (
    <Layout projects={props.projects} email={props.email}>
      <Wrapper>
        {shippingInfo && (
          <>
            {!isMobile && <Rule />}
            <ShippingInfo>{shippingInfo}</ShippingInfo>
            <Rule />
          </>
        )}
        <form onSubmit={handleSubmit}>
          <h4>Details</h4>
          <Address control={control} email={props.email} />
          <br />
          <Rule />
          <h4>Bank card</h4>
          <CardWrapper>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </CardWrapper>
          <ErrorComponent error={error} />
          {stripe && (
            <Button type="submit" disabled={processing}>
              {processing ? "Checking out..." : "Checkout"}
            </Button>
          )}
        </form>
        <br />
        <Rule />
        <h4>Total price: {totalPrice}NOK</h4>
        <ItemsWrapper>
          <h4>Items in cart ({nItems})</h4>
          <Carousel
            width={isMobile ? "full" : 500}
            images={images}
            thumbnailsWidthPx={THUMBNAILS_WIDTH_PX}
            showThumbnails={!isMobile}
            // @ts-ignore
            ref={carouselRef}
          >
            <Button onClick={handleRemove}>Remove</Button>
          </Carousel>
        </ItemsWrapper>
      </Wrapper>
    </Layout>
  );
};

const Noop = () => null;

// TODO: Is this necessary?
export default isServer() ? Noop : Checkout;

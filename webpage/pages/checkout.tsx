import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { debounce, isEmpty, prop } from "lodash/fp";

import useShoppingCart from "../hooks/useShoppingCart";
import ErrorComponent from "../components/ErrorComponent";
import makeGetStaticProps, { Props } from "../utils/makeGetStaticProps";
import { HEADER_HEIGHT_REM } from "../components/Header";
import isServer from "../utils/isServer";
import Button from "../components/Button";
import Layout from "../components/Layout";
import Address from "../components/Address";
import { Address as AddressType } from "../types";
import { StripeElements } from "@stripe/stripe-js";
import Link from "../components/Link";

// Test card: 4000002760003184

export const getStaticProps = makeGetStaticProps();

const CARD_ELEMENT_OPTIONS = {
  classes: { base: "" }, // TODO
  // classes: { base: styles.cardWrapper },
  style: { base: { fontSize: "1.5rem", lineHeight: "2rem" } },
  hideIcon: true,
  hidePostalCode: true,
};

const Wrapper = styled.div`
  /* padding: ${HEADER_HEIGHT_REM}rem 2rem 2rem; */
  padding: 0 1.5rem;
`;

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

const CardWrapper = styled.div``;

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

// const useCardComplete = (elements: StripeElements | null) => {
//   const card = elements?.getElement(CardElement);
//   const [complete, setComplete] = useState(false);

//   useEffect(() => {
//     if (!card) return;
//     card.on("change", (cardState) => setComplete(cardState.complete));
//   }, [card]);

//   return complete;
// };

const Checkout = (props: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const { nItems, shoppingCart, removeFromCart, onSuccess } = useShoppingCart();
  const stripe = useStripe();
  const elements = useElements();

  const totalPrice = shoppingCart.items.reduce((total, { price }) => total + price, 0);

  const {
    control,
    formState: { errors, isSubmitting, isDirty },
    handleSubmit: submitWrapper,
    register,
    watch,
  } = useForm({ defaultValues: DEFAULT_ADDRESS_VALUES, mode: "onChange" });
  const ready = isDirty && isEmpty(errors) && !isSubmitting && nItems > 0;

  const getClientSecret = useCallback(async ({ email, ...address }, items, total) => {
    setError("");

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
      setError(await response.text());
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

  // FIXME: Does not run when auto-filling from dashlane
  watch((values) => ready && debouncedGetClientSecret(values, shoppingCart?.items, totalPrice));

  const submit = useCallback(async () => {
    setError("");
    setProcessing(true);
    const card = elements?.getElement(CardElement);

    if (!card) {
      setError("Something went wrong");
      setProcessing(false);
      return;
    }

    const data = {
      payment_method: {
        card,
        billing_details: {
          name: "test",
        },
      },
    };

    const payload = await stripe?.confirmCardPayment(clientSecret, data);

    // TODO: Display card errors on card input and focus?
    if (payload?.error) {
      setError(payload.error.message);
      setProcessing(false);
    } else if (payload?.paymentIntent) {
      setError("");
      setProcessing(false);
      onSuccess(payload?.paymentIntent);
      // push('/checkout/success'); TODO
    } else {
      setError("Something went wrong");
      setProcessing(false);
    }
  }, [clientSecret, elements, onSuccess, stripe]);

  const handleSubmit = useMemo(() => submitWrapper(submit), [submit, submitWrapper]);

  if (!stripe || !elements) return null;

  if (nItems < 1) {
    return (
      <Layout projects={props.projects}>
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
    <Layout projects={props.projects}>
      <Wrapper>
        <form onSubmit={handleSubmit}>
          <h4>Details</h4>
          <Address register={register} control={control} />
          <h4>Bank card</h4>
          <CardWrapper>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </CardWrapper>
          {stripe && (
            <Button type="submit" disabled={processing}>
              {processing ? "Checking out..." : "Checkout"}
            </Button>
          )}
        </form>
        <ErrorComponent error={error} />
        <h4>Total price: {totalPrice}NOK</h4>
        <h4>Items in cart ({nItems})</h4>
        {/*<div className={styles.carouselWrapper}> TODO
          <Carousel infiniteLoop dynamicHeight transitionTime={600} showStatus={false} showIndicators={false}>
            {shoppingCart.items.map((item) => (
              <div key={item.id}>
                <div className={styles.itemHeadline}>
                  {item.title}
                  <Button onClick={() => removeFromCart(item)}>remove</Button>
                </div>
                {item.images?.length > 0 && <img src={item.images[0].url} alt={item.title} />}
              </div>
            ))}
          </Carousel>
            </div>*/}
      </Wrapper>
    </Layout>
  );
};

const Noop = () => null;

// TODO: Is this necessary?
export default isServer() ? Noop : Checkout;

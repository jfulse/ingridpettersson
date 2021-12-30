import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { debounce, prop } from "lodash/fp";

import useShoppingCart from "../hooks/useShoppingCart";
import ErrorComponent from "../components/ErrorComponent";
import makeGetStaticProps, { Props } from "../utils/makeGetStaticProps";
import { HEADER_HEIGHT_REM } from "../components/Header";
import isServer from "../utils/isServer";
import Button from "../components/Button";
import Layout from "../components/Layout";
import Address from "../components/Address";
import { Address as AddressType } from "../types";

// Test card: 4000002760003184

// TODO: Add names to input fields as a guide to password managers etc

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

const CardWrapper = styled.div``;

const Checkout = (props: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const [address, setAddress] = useState<Partial<AddressType>>({});
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [ready, setReady] = useState<boolean>(false);

  const { nItems, shoppingCart, removeFromCart, onSuccess } = useShoppingCart();
  const stripe = useStripe();
  const elements = useElements();

  const totalPrice = shoppingCart.items.reduce((total, { price }) => total + price, 0);

  const getClientSecret = useCallback(async (currentEmail, currentAddress, items, total) => {
    setError("");

    const itemIds = items.map(prop("_id"));
    const headers = { "Content-Type": "application/json" };
    const data = JSON.stringify({
      itemIds,
      email: currentEmail,
      address: { ...currentAddress, country: "norway" },
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

  useEffect(() => {
    if (!ready || nItems === 0) return;
    debouncedGetClientSecret(email, address, shoppingCart?.items, totalPrice);
  }, [ready, nItems, debouncedGetClientSecret, shoppingCart?.items, address, email, totalPrice]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
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
    },
    [clientSecret, elements, onSuccess, stripe]
  );

  if (!stripe || !elements) return null;

  if (nItems < 1) {
    return (
      <Layout projects={props.projects}>
        <Wrapper>
          <h4>No items in cart</h4>
        </Wrapper>
      </Layout>
    );
  }

  return (
    <Layout projects={props.projects}>
      <Wrapper>
        <form onSubmit={handleSubmit}>
          <h4>Details</h4>
          <Address address={address} setAddress={setAddress} email={email} setEmail={setEmail} setReady={setReady} />
          <h4>Bank card</h4>
          <CardWrapper>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </CardWrapper>
          {stripe && (
            // FIXME: disabled not working
            <Button type="submit" disabled={!clientSecret || processing || !ready}>
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

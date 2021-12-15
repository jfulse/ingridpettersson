import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { debounce, prop } from "lodash/fp";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

import useDetails from "../hooks/useDetails";
import useShoppingCart from "../hooks/useShoppingCart";
import ErrorComponent from "../components/ErrorComponent";
import makeGetStaticProps, { Props } from "../utils/makeGetStaticProps";
import isServer from "../utils/isServer";
import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";

// Test card: 4000002760003184

export const getStaticProps = makeGetStaticProps();

const CARD_ELEMENT_OPTIONS = {
  classes: { base: "" }, // TODO
  // classes: { base: styles.cardWrapper },
  style: { base: { fontSize: "1.5rem", lineHeight: "2rem" } },
  hideIcon: true,
  hidePostalCode: true,
};

const Wrapper = styled.div``;

const CardWrapper = styled.div``;

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  gap: 0.5rem 1rem;
  margin-right: 3rem;

  label {
    white-space: nowrap;

    &:nth-child(2n + 1) {
      text-align: right;
    }
  }
`;

const ModalWrapper = styled.div`
  margin: 1rem 3rem;

  @media only screen and (max-width: 480px) {
    margin: 1rem;
    font-size: 2rem;
  }
`;

const Checkout = (props: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const {
    name,
    updateName,
    email,
    updateEmail,
    addressLine1,
    updateAddressLine1,
    addressLine2,
    updateAddressLine2,
    city,
    updateCity,
    postalCode,
    updatePostalCode,
    state,
    updateState,
    detailsReady,
  } = useDetails();

  const { nItems, shoppingCart, removeFromCart, onSuccess } = useShoppingCart();
  const stripe = useStripe();
  const elements = useElements();

  const totalPrice = shoppingCart.items.reduce((total, { price }) => total + price, 0);

  const getClientSecret = useCallback(async (currentEmail, currentAddress, items, total) => {
    setError("");

    const itemIds = items.map(prop("_id"));
    const data = JSON.stringify({ itemIds, email: currentEmail, address: currentAddress, total });
    const headers = { "Content-Type": "application/json" };

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
    if (!detailsReady || nItems === 0) return;

    const address = {
      name,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      state,
      country: "Norway",
    };

    debouncedGetClientSecret(email, address, shoppingCart?.items, totalPrice);
  }, [
    detailsReady,
    nItems,
    debouncedGetClientSecret,
    shoppingCart?.items,
    name,
    addressLine1,
    addressLine2,
    city,
    postalCode,
    state,
    email,
    totalPrice,
  ]);

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
        <div>
          <form onSubmit={handleSubmit}>
            <h4>Details</h4>
            <InputWrapper>
              <Input label="name" value={name} onChange={updateName} />
              <Input label="addressLine1" value={addressLine1} onChange={updateAddressLine1} />
              <Input label="email" value={email} onChange={updateEmail} type="email" />
              <Input label="addressLine2" value={addressLine2} onChange={updateAddressLine2} />
              <Input label="country" value="Norway" noChange onClick={openModal} />
              <Input label="city" value={city} onChange={updateCity} />
              <Input label="state or province" value={state} onChange={updateState} />
              <Input label="postalCode" value={postalCode} onChange={updatePostalCode} type="number" />
            </InputWrapper>
            <h4>Bank card</h4>
            <CardWrapper>
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </CardWrapper>
            {stripe && (
              <Button type="submit" disabled={!clientSecret || processing || !detailsReady}>
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
        </div>
      </Wrapper>
      <Modal open={modalOpen} onClose={closeModal} center>
        <ModalWrapper>
          For shipping outside Norway send a mail to{" "}
          <a href="mailto:ingridpettersson.r@gmail.com">ingridpettersson.r@gmail.com</a>
        </ModalWrapper>
      </Modal>
    </Layout>
  );
};

const Noop = () => null;

export default isServer() ? Noop : Checkout;

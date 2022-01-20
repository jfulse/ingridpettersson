import { useMemo } from "react";
import styled from "styled-components";

import { ResolvedAddress } from "../../types";
import { COUNTRY_CODES } from "../../constants";
import makeGetStaticProps, { Props } from "../../utils/makeGetStaticProps";
import keyFromValue from "../../utils/keyFromValue";
import useShoppingCart from "../../hooks/useShoppingCart";
import Layout from "../../components/Layout";
import { isEmpty, orderBy } from "lodash/fp";

export const getStaticProps = makeGetStaticProps();

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  font-size: 1.2rem;

  p {
    margin: 0;
    text-align: center;
    max-width: 35rem;
    line-height: 2rem;
  }

  @media only screen and (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Address = styled.div`
  text-align: left;
`;

const ADDRESS_ORDER: Record<keyof ResolvedAddress, number> = {
  name: 0,
  line1: 1,
  line2: 2,
  city: 3,
  postal_code: 4,
  state: 5,
  country: 6,
};

const orderAddress = orderBy(([key, value]) => ADDRESS_ORDER[key as keyof ResolvedAddress], "asc");

const CheckoutSuccess = (props: Props) => {
  const { shoppingCart } = useShoppingCart();

  const address = useMemo(() => {
    const shipping = shoppingCart?.successMetadata?.shipping;
    return {
      name: shipping?.name,
      ...shipping?.address,
      country: keyFromValue<"Norway", "NO">(COUNTRY_CODES, shipping?.address?.country ?? "NO"),
    };
  }, [shoppingCart]);

  const email = shoppingCart?.successMetadata?.receipt_email;

  return (
    <Layout projects={props.projects} email={props.email}>
      <Wrapper>
        <p>Thanks from ordering from {props.email}!</p>
        {!isEmpty(address) && (
          <>
            <p>We will send your items to:</p>
            <p>
              <Address>
                {orderAddress(Object.entries(address)).map(([key, value]) => (
                  <div key={key}>{value}</div>
                ))}
              </Address>
            </p>
            {Boolean(email) && <p>A confirmation email has been sent to {email}.</p>}
          </>
        )}
      </Wrapper>
    </Layout>
  );
};

export default CheckoutSuccess;

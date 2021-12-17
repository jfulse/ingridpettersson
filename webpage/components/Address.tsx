import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
// @ts-ignore
import isEmail from "is-email";

import { Address as AddressType } from "../types";
import Input from "./Input";

const areNumbers = (text = "") => text.match(/[\d]+/);

// FIXME: Ordering in CSS messes with tabbing apparently
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  gap: 0.5rem 2rem;

  label {
    white-space: nowrap;
  }

  @media only screen and (max-width: 480px) {
    display: flex;
    flex-direction: column;

    label {
      margin-top: 0.5rem;
    }

    input,
    label {
      order: 7;
    }

    & > label:nth-child(1) {
      order: 1;
    }

    & > input:nth-child(2) {
      order: 2;
    }

    & > label:nth-child(3) {
      order: 5;
    }

    & > input:nth-child(4) {
      order: 6;
    }

    & > label:nth-child(5) {
      order: 3;
    }

    & > input:nth-child(6) {
      order: 4;
    }

    & > label:nth-child(13) {
      order: 10;
    }

    & > input:nth-child(14) {
      order: 10;
    }
  }
`;

const ModalWrapper = styled.div`
  margin: 1rem 3rem;
  line-height: 1.5rem;

  @media only screen and (max-width: 480px) {
    margin: 1rem;
  }
`;

type SetAddress = (address: Partial<AddressType> | ((address: Partial<AddressType>) => Partial<AddressType>)) => void;

type Props = {
  address: Partial<AddressType>;
  setAddress: SetAddress;
  email?: string;
  setEmail: (email: string) => void;
  setReady: (ready: boolean) => void;
};

const useUpdateAddressField = (setAddress: SetAddress, field: keyof AddressType) => {
  const updateAddressField = useCallback(
    ({ target }) => setAddress((current) => ({ ...current, [field]: target.value })),
    [field, setAddress]
  );

  return updateAddressField;
};

const Address = ({ address, setAddress, email, setEmail, setReady }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const updateName = useUpdateAddressField(setAddress, "name");
  const updateAddressLine1 = useUpdateAddressField(setAddress, "addressLine1");
  const updateAddressLine2 = useUpdateAddressField(setAddress, "addressLine2");
  const updateCity = useUpdateAddressField(setAddress, "city");
  const updatePostalCode = useUpdateAddressField(setAddress, "postalCode");
  const updateState = useUpdateAddressField(setAddress, "state");

  const updateEmail = useCallback(({ target }) => setEmail(target.value), [setEmail]);

  useEffect(
    () =>
      setReady(
        Boolean(
          address.name &&
            email &&
            isEmail(email) &&
            address.addressLine1 &&
            address.city &&
            address.postalCode &&
            areNumbers(address.postalCode) &&
            address.state
        )
      ),
    [address.name, address.addressLine1, address.city, address.postalCode, address.state, email, setReady]
  );

  return (
    <Wrapper>
      <Input label="name" value={address.name ?? ""} onChange={updateName} />
      <Input label="addressLine1" value={address.addressLine1 ?? ""} onChange={updateAddressLine1} />
      <Input label="email" value={email ?? ""} onChange={updateEmail} type="email" />
      <Input label="addressLine2" value={address.addressLine2 ?? ""} onChange={updateAddressLine2} />
      <Input label="state or province" value={address.state ?? ""} onChange={updateState} />
      <Input label="city" value={address.city ?? ""} onChange={updateCity} />
      <Input label="country" value="Norway" noChange onClick={openModal} />
      <Input
        label="postalCode"
        value={address.postalCode?.toString() ?? ""}
        onChange={updatePostalCode}
        type="number"
      />
      <Modal open={modalOpen} onClose={closeModal} center>
        <ModalWrapper>
          For shipping outside Norway send a mail to{" "}
          <a href="mailto:ingridpettersson.r@gmail.com">ingridpettersson.r@gmail.com</a>
        </ModalWrapper>
      </Modal>
    </Wrapper>
  );
};

export default Address;

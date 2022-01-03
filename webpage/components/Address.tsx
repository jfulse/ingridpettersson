import { ReactElement, useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-responsive-modal";
import { Control, UseFormRegister, useFormState } from "react-hook-form";
import { sortBy } from "lodash/fp";
import "react-responsive-modal/styles.css";

import { Address as AddressType } from "../types";
import Input from "./Input";
import useIsMobile from "../hooks/useIsMobile";

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

const useUpdateAddressField = (setAddress: SetAddress, field: keyof AddressType) => {
  const updateAddressField = useCallback(
    ({ target }) => setAddress((current) => ({ ...current, [field]: target.value })),
    [field, setAddress]
  );

  return updateAddressField;
};

type Props = {
  register: UseFormRegister<AddressType>;
  control: Control<AddressType, object>;
};

const MOBILE_INPUT_ORDER: (keyof AddressType)[] = [
  "name",
  "email",
  "addressLine1",
  "addressLine2",
  "city",
  "postalCode",
  "state",
  "country",
];

const orderInputs = (isMobile: boolean, inputs: ReactElement[]) =>
  sortBy((node) => (isMobile ? MOBILE_INPUT_ORDER.indexOf(node?.key as keyof AddressType) : 0), inputs);

const Address = ({ register, control }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const isMobile = useIsMobile();

  const { errors, isSubmitted, isSubmitting } = useFormState({ control });

  const inputs = useMemo(
    () =>
      orderInputs(isMobile, [
        <Input
          key="name"
          name="name"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          readOnly={isSubmitting}
        />,
        <Input
          key="addressLine1"
          name="addressLine1"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          readOnly={isSubmitting}
        />,
        <Input
          name="email"
          key="email"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          readOnly={isSubmitting}
          type="email"
        />,
        <Input
          name="addressLine2"
          key="addressLine2"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          readOnly={isSubmitting}
          required={false}
        />,
        <Input
          name="state"
          key="state"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          readOnly={isSubmitting}
        />,
        <Input
          name="city"
          key="city"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          readOnly={isSubmitting}
        />,
        <Input
          name="country"
          key="country"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          readOnly
          onClick={openModal}
        />,
        <Input
          name="postalCode"
          key="postalCode"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          readOnly={isSubmitting}
          type="number"
        />,
      ]),
    [errors, isMobile, isSubmitted, isSubmitting, openModal, register]
  );

  return (
    <Wrapper>
      {inputs}
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

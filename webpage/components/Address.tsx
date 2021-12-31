import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-responsive-modal";
import { Control, UseFormRegister, useFormState } from "react-hook-form";
import "react-responsive-modal/styles.css";

import { Address as AddressType } from "../types";
import Input from "./Input";

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

const Address = ({ register, control }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const { errors, isSubmitted, isSubmitting } = useFormState({ control });

  return (
    <Wrapper>
      <Input name="name" register={register} errors={errors} isSubmitted={isSubmitted} readOnly={isSubmitting} />
      <Input
        name="addressLine1"
        register={register}
        errors={errors}
        isSubmitted={isSubmitted}
        readOnly={isSubmitting}
      />
      <Input
        name="email"
        register={register}
        errors={errors}
        isSubmitted={isSubmitted}
        readOnly={isSubmitting}
        type="email"
      />
      <Input
        name="addressLine2"
        register={register}
        errors={errors}
        isSubmitted={isSubmitted}
        readOnly={isSubmitting}
        required={false}
      />
      <Input name="state" register={register} errors={errors} isSubmitted={isSubmitted} readOnly={isSubmitting} />
      <Input name="city" register={register} errors={errors} isSubmitted={isSubmitted} readOnly={isSubmitting} />
      <Input
        name="country"
        register={register}
        errors={errors}
        isSubmitted={isSubmitted}
        readOnly
        onClick={openModal}
      />
      <Input
        name="postalCode"
        register={register}
        errors={errors}
        isSubmitted={isSubmitted}
        readOnly={isSubmitting}
        type="number"
      />
      {/*<Input label="addressLine1" value={address.addressLine1 ?? ""} onChange={updateAddressLine1} />
      <Input label="email" value={email ?? ""} onChange={updateEmail} type="email" />
      <Input label="addressLine2" value={address.addressLine2 ?? ""} onChange={updateAddressLine2} />
      <Input label="state or province" value={address.state ?? ""} onChange={updateState} />
      <Input label="city" value={address.city ?? ""} onChange={updateCity} />
      <Input label="country" value="Norway" readOnly onClick={openModal} />
      <Input
        label="postalCode"
        value={address.postalCode?.toString() ?? ""}
        onChange={updatePostalCode}
        type="number"
  />*/}
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

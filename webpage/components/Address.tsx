import { ReactElement, useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-responsive-modal";
import { Control } from "react-hook-form";
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

type Props = {
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

const Address = ({ control }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const isMobile = useIsMobile();

  const inputs = useMemo(
    () =>
      orderInputs(isMobile, [
        <Input key="name" name="name" control={control} />,
        <Input key="addressLine1" name="addressLine1" control={control} />,
        <Input name="email" key="email" control={control} type="email" />,
        <Input name="addressLine2" key="addressLine2" control={control} required={false} />,
        <Input name="state" key="state" control={control} />,
        <Input name="city" key="city" control={control} />,
        <Input name="country" key="country" control={control} readOnly onClick={openModal} />,
        <Input name="postalCode" key="postalCode" control={control} type="number" />,
      ]),
    [control, isMobile, openModal]
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

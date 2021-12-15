import { useCallback, useState } from "react";
// @ts-ignore
import isEmail from "is-email";

const areNumbers = (text = "") => text.match(/[\d]+/);

const useDetails = () => {
  const [name, setName] = useState("");
  const updateName = useCallback(({ target }) => setName(target.value), []);
  const [email, setEmail] = useState("");
  const updateEmail = useCallback(({ target }) => setEmail(target.value), []);
  const [addressLine1, setAddressLine1] = useState("");
  const updateAddressLine1 = useCallback(({ target }) => setAddressLine1(target.value), []);
  const [addressLine2, setAddressLine2] = useState("");
  const updateAddressLine2 = useCallback(({ target }) => setAddressLine2(target.value), []);
  const [city, setCity] = useState("");
  const updateCity = useCallback(({ target }) => setCity(target.value), []);
  const [postalCode, setPostalCode] = useState("");
  const updatePostalCode = useCallback(({ target }) => setPostalCode(target.value), []);
  const [state, setState] = useState("");
  const updateState = useCallback(({ target }) => setState(target.value), []);

  const detailsReady =
    name && email && isEmail(email) && addressLine1 && city && postalCode && areNumbers(postalCode) && state;

  return {
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
  };
};

export default useDetails;

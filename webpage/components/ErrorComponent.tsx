import styled from "styled-components";

const ErrorWrapper = styled.div`
  color: red;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ErrorComponent = ({ error }: { error?: string }) => {
  if (!error) return null;
  return <ErrorWrapper>{error}</ErrorWrapper>;
};

export default ErrorComponent;

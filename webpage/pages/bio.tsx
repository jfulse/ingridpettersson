import styled from "styled-components";

import { EMPTY_OBJECT } from "../constants";
import useData from "../hooks/useData";
import makeGetServerSideProps, { Props } from "../utils/makeGetServerSideProps";
import getApiUrl from "../utils/getApiUrl";

const getIllustrationApiUrl = () => `${getApiUrl()}/api/bio`;

export const getServerSideProps = makeGetServerSideProps(getIllustrationApiUrl);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 2rem;
  line-height: 1.5rem;
  height: 100%;

  h3 {
    font-weight: 600;
    font-size: 1rem;
    margin: 0.5rem 0 0;
  }
`;

type Bio = { headline: string; body: string };

const Bio = (props: Props<Bio>) => {
  const { data } = useData(getIllustrationApiUrl());
  const { headline, body } = (data || props.data) ?? EMPTY_OBJECT;

  if (!headline || !body) return null;

  return (
    <Wrapper>
      <h3>{headline}</h3>
      {body}
    </Wrapper>
  );
};

export default Bio;

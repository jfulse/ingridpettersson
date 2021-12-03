import styled from "styled-components";

import { EMPTY_OBJECT } from "../constants";
import useData from "../hooks/useData";
import makeGetStaticProps, { Props } from "../utils/makeGetStaticProps";
import getApiUrl from "../utils/getApiUrl";
import Layout from "../components/Layout";

const getIllustrationApiUrl = () => `${getApiUrl()}/api/bio`;

export const getStaticProps = makeGetStaticProps(getIllustrationApiUrl);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 2rem;
  line-height: 1.5rem;
  height: 100%;
  overflow-y: auto;

  h3 {
    font-weight: 600;
    font-size: 1rem;
    margin: 0.5rem 0 0;
  }
`;

type Bio = { headline?: string; body?: string };

const Bio = (props: Props<Bio>) => {
  const { data } = useData<Bio>(props.dataUrl);
  const { headline, body } = (data || props.data) ?? (EMPTY_OBJECT as Bio);

  if (!headline || !body) return null;

  return (
    <Layout projects={props.projects}>
      <Wrapper>
        <h3>{headline}</h3>
        {body}
      </Wrapper>
    </Layout>
  );
};

export default Bio;

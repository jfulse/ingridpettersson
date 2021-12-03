import { useMemo } from "react";

import { EMPTY_ARRAY } from "../constants";
import makeGetStaticProps, { Props } from "../utils/makeGetStaticProps";
import getApiUrl from "../utils/getApiUrl";
import { ResolvedPiece } from "../types";
import useData from "../hooks/useData";
import ImageBeam from "../components/ImageBeam";
import Layout from "../components/Layout";

// TODO: Can I make dataset public and then do queries directly from the frontend?
// Maybe wait with this until image credits etc are up

const getLandingApiUrl = () => `${getApiUrl()}/api/landing`;

export const getStaticProps = makeGetStaticProps(getLandingApiUrl);

const Index = (props: Props<{ pieces: ResolvedPiece[] }>) => {
  const { data } = useData(getLandingApiUrl());
  const pieces: ResolvedPiece[] = (data || props.data)?.pieces ?? EMPTY_ARRAY;

  const imageObjects = useMemo(
    () =>
      pieces.map(({ firstImage = {}, _id }) => ({
        href: `pieces/${_id}`,
        image: firstImage,
      })),
    [pieces]
  );

  return (
    <Layout projects={props.projects}>
      <ImageBeam imageObjects={imageObjects} />
    </Layout>
  );
};

export default Index;

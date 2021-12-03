import { useMemo } from "react";

import { EMPTY_ARRAY } from "../constants";
import makeGetStaticProps, { Props } from "../utils/makeGetStaticProps";
import getLanding from "../queries/getLanding";
import { ResolvedPiece } from "../types";
import useData from "../hooks/useData";
import ImageBeam from "../components/ImageBeam";
import Layout from "../components/Layout";

export const getStaticProps = makeGetStaticProps(getLanding);

type Landing = { pieces: ResolvedPiece[] };

const Index = (props: Props<Landing>) => {
  const { data } = useData<Landing>(getLanding, "landing");
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

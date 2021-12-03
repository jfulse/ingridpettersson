import { useMemo } from "react";

import { EMPTY_ARRAY } from "../constants";
import makeGetStaticProps, { Props } from "../utils/makeGetStaticProps";
import getIllustrations from "../queries/getIllustrations";
import { ResolvedPiece } from "../types";
import useData from "../hooks/useData";
import ImageBeam from "../components/ImageBeam";
import Layout from "../components/Layout";

export const getStaticProps = makeGetStaticProps(getIllustrations);

const Illustration = (props: Props<ResolvedPiece[]>) => {
  const { data } = useData<ResolvedPiece[]>(getIllustrations, "illustrations");
  const illustrations = (data || props.data) ?? EMPTY_ARRAY;

  const imageObjects = useMemo(
    () =>
      illustrations.map(({ firstImage = {}, _id }) => ({
        href: `pieces/${_id}`,
        image: firstImage,
      })),
    [illustrations]
  );

  return (
    <Layout projects={props.projects}>
      <ImageBeam imageObjects={imageObjects} />
    </Layout>
  );
};

export default Illustration;

import { useMemo } from "react";

import { EMPTY_ARRAY } from "../constants";
import makeGetStaticProps, { Props } from "../utils/makeGetStaticProps";
import getApiUrl from "../utils/getApiUrl";
import { ResolvedPiece } from "../types";
import useData from "../hooks/useData";
import ImageBeam from "../components/ImageBeam";
import Layout from "../components/Layout";

const getIllustrationApiUrl = () => `${getApiUrl()}/api/illustration`;

export const getStaticProps = makeGetStaticProps(getIllustrationApiUrl);

const Illustration = (props: Props<ResolvedPiece[]>) => {
  const { data } = useData<ResolvedPiece[]>(props.dataUrl);
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

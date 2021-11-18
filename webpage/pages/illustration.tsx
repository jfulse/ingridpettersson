import { useMemo } from "react";

import { EMPTY_ARRAY } from "../constants";
import makeGetServerSideProps, { Props } from "../utils/makeGetServerSideProps";
import getApiUrl from "../utils/getApiUrl";
import { ResolvedPiece } from "../types";
import useData from "../hooks/useData";
import ImageBeam from "../components/ImageBeam";

const getIllustrationApiUrl = () => `${getApiUrl()}/api/illustration`;

export const getServerSideProps = makeGetServerSideProps(getIllustrationApiUrl);

const Illustration = (props: Props<{ pieces: ResolvedPiece[] }>) => {
  const { data } = useData(getIllustrationApiUrl());
  const illustrations: ResolvedPiece[] = (data || props.data) ?? EMPTY_ARRAY;

  const imageObjects = useMemo(
    () =>
      illustrations.map(({ firstImage = {}, _id }) => ({
        href: `pieces/${_id}`,
        image: firstImage,
      })),
    [illustrations]
  );

  return <ImageBeam imageObjects={imageObjects} />;
};

export default Illustration;

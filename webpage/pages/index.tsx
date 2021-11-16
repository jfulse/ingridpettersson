import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { identity } from "lodash/fp";

import { EMPTY_ARRAY } from "../constants";
import makeGetServerSideProps, { Props } from "../utils/makeGetServerSideProps";
import getApiUrl from "../utils/getApiUrl";
import { ResolvedPiece } from "../types";
import useData from "../hooks/useData";
import ImageBeam from "../components/ImageBeam";

// TODO: Can I make dataset public and then do queries directly from the frontend?
// Maybe wait with this until image credits etc are up

const getLandingApiUrl = () => `${getApiUrl()}/api/landing`;

export const getServerSideProps = makeGetServerSideProps(getLandingApiUrl);

const Index = (props: Props<{ pieces: ResolvedPiece[] }>) => {
  const router = useRouter();
  const { data } = useData(getLandingApiUrl());
  const pieces: ResolvedPiece[] = (data || props.data)?.pieces ?? EMPTY_ARRAY;

  const images = useMemo(
    () =>
      pieces
        .map(({ firstImage = {}, _id }) => ({ ownerId: _id, ...firstImage }))
        .filter(identity),
    [pieces]
  );

  const onClick = useCallback(
    (pieceId) => router.push(`/pieces/${pieceId}`),
    [router]
  );

  return (
    <>
      <br />
      <ImageBeam images={images} height={80} onClick={onClick} />
    </>
  );
};

export default Index;

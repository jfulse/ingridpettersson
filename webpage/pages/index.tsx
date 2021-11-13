import { EMPTY_ARRAY } from "../constants";
import makeGetServerSideProps, { Props } from "../utils/makeGetServerSideProps";
import { ResolvedPiece } from "../types";
import useData from "../hooks/useData";
import ImageBeam from "../components/ImageBeam";
import { useMemo } from "react";
import image from "next/image";

const API_URL = "http://localhost:3000";

const getLandingApiUrl = () => `${API_URL}/api/landing`;

export const getServerSideProps = makeGetServerSideProps(getLandingApiUrl);

const Index = (props: Props<{ pieces: ResolvedPiece[] }>) => {
  const { data } = useData(getLandingApiUrl());
  const pieces: ResolvedPiece[] = (data || props.data)?.pieces ?? EMPTY_ARRAY;

  const images = useMemo(
    () => pieces.map(({ firstImage }) => firstImage),
    [pieces]
  );

  return (
    <>
      <br />
      <ImageBeam images={images} height={80} />
    </>
  );
};

export default Index;

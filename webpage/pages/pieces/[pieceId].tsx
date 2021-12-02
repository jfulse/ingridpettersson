import { useEffect, useMemo, useState } from "react";
import { GetServerSidePropsContext } from "next";
import styled from "styled-components";
import { compose, filter, get, maxBy, mean, minBy, prop, range, sortBy } from "lodash/fp";
import ImageGallery from "react-image-gallery";
import { useMeasure } from "react-use";
import { RGBA } from "image-palette";

import { ResolvedPiece } from "../../types";
import useColorsFromImage, { Color } from "../../hooks/useColorsFromImage";
import useData from "../../hooks/useData";

import getApiUrl from "../../utils/getApiUrl";
import makeGetServerSideProps, { Props } from "../../utils/makeGetServerSideProps";
import { EMPTY_ARRAY } from "../../constants";
import AddToCart from "../../components/AddToCart";

// TODO: Abstract out all the color stuff
// TODO: Use lower quality image for color stuff
// TODO: Only use color stuff on illustrations?

const getPieceSlug = (context: GetServerSidePropsContext) => context.query?.pieceId;

const getPieceApiUrl = (context: GetServerSidePropsContext) => `${getApiUrl()}/api/pieces/${context.query.pieceId}`;

export const getServerSideProps = makeGetServerSideProps(getPieceApiUrl, getPieceSlug);

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media only screen and (max-width: 480px) {
    flex-direction: column;
  }
`;

const InfoWrapper = styled.div<{ background?: string; color?: string }>`
  margin: 0;
  padding: 2rem;
  white-space: nowrap;
  flex-grow: 1;
  margin: 0 0 0 2rem;
  ${({ color }) => color && `color: ${color};`}
  ${({ background }) => background && `background-color: ${background};`}
  transition: color 1s ease-in, background-color 1s ease-in;
`;

const Title = styled.h2<{ color?: string }>`
  margin: 0;
  padding: 0;
  ${({ color }) => color && `color: ${color};`}
  transition: color 1s ease-in, background-color 1s ease-in;
`;

const SubTitle = styled.h3`
  margin: 1rem 0;
  padding: 0;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const THUMBNAILS_WIDTH_PX = 100;

const CarouselWrapper = styled.div<{ thumbnailsWidthPx: number; width?: number }>`
  width: ${({ width }) => `${width}px`};

  & > div:first-child {
    width: 100%;

    & > div:first-child {
      width: 100%;
      display: flex;
      flex-direction: row;

      & > div:first-child {
        ${({ thumbnailsWidthPx }) => `width: calc(100% - ${thumbnailsWidthPx}px)`};
      }
    }
  }
`;

const filterWithAsset = filter(get("asset"));

const dimensionsPath = "asset.metadata.dimensions";

const getMinAspectRatioDimensions = compose(get(dimensionsPath), minBy(`${dimensionsPath}.aspectRatio`));

const medianByLuma = (colors: Color[]): Color => {
  const isEven = colors.length % 2 == 0;
  const ordered = sortBy(prop("luma"), colors);
  return isEven ? ordered[ordered.length / 2] : ordered[(ordered.length - 1) / 2];
};

const minContrast = 4;

type ItemWithLuma = { luma: number };

const getContrast = ({ luma: luma1 }: ItemWithLuma, { luma: luma2 }: ItemWithLuma): number =>
  Math.max(luma1, luma2) / Math.min(luma1, luma2);

const tryGettingContrastingColors = (colors: Color[]): Color[] | undefined => {
  const brightestColor = maxBy(prop("luma"), colors)!;
  const darkestColor = minBy(prop("luma"), colors)!;

  const brightestAndDarkestContrast = getContrast(brightestColor, darkestColor);

  if (brightestAndDarkestContrast >= minContrast) return [brightestColor, darkestColor];

  const brightestContrast = getContrast(brightestColor, { luma: 0 });
  const darkestContrast = getContrast(darkestColor, { luma: 1 });

  if ([brightestContrast, darkestContrast].every((c) => c < minContrast)) return undefined;
  if (brightestContrast > darkestContrast) return [brightestColor];
  return [darkestColor];
};

const rgbaToColorString = ({ rgba: [R, G, B, A] }: Color): string => `rgba(${R}, ${G}, ${B}, ${A})`;

const isNotGrayTone = ({ luma, rgba: [R, G, B] }: Color): boolean => {
  // We count very bright or dark colors as graytone
  if (luma < 0.1 || luma > 0.9) return false;
  const meanHue = mean([R, G, B]);
  return [R, G, B].every((hue) => Math.abs(hue - meanHue) / 255 > 0.02);
};

const hasN =
  (n: number) =>
  (list?: any[]): boolean =>
    (list?.length ?? 0) >= n;

const hasTwo = hasN(2);
const hasOne = hasN(1);

// Use some heuristics to get 3, 2 or 1 color(s) that are prominent and have high contrast
const useContrastingColors = (colors: Color[] | undefined): Color[] | undefined => {
  const [contrastingColors, setContrastingColors] = useState<Color[] | undefined>(undefined);

  useEffect(() => {
    if (!colors) return;
    const colorsNotGraytone = colors.filter(isNotGrayTone);

    const testResults = range(3, 8).map((nColors) => tryGettingContrastingColors(colorsNotGraytone.slice(0, nColors)));

    setContrastingColors(testResults.find(hasTwo) || testResults.find(hasOne));
  }, [colors]);

  return contrastingColors;
};

// TODO: From theme?
const DEFAULT_DARK_COLOR = "rgba(0, 0, 0, 255)";
const DEFAULT_BRIGHT_COLOR = "rgba(255, 255, 255, 255)";

const chooseColors = (contrastingColors?: Color[]): { color: string; background: string } => {
  if (!contrastingColors) return { color: DEFAULT_DARK_COLOR, background: DEFAULT_BRIGHT_COLOR };

  if (contrastingColors.length === 1) {
    const color = rgbaToColorString(contrastingColors[0]);
    if (contrastingColors[0].luma < 0.5) return { color: DEFAULT_BRIGHT_COLOR, background: color };
    return { color: DEFAULT_DARK_COLOR, background: color };
  }

  const colors = contrastingColors.map(rgbaToColorString);
  return { color: colors[1], background: colors[0] };
};

const Piece = (props: Props<ResolvedPiece>) => {
  const { data } = useData(props.apiUrl);
  const piece = data || props.data;

  const product = useMemo(() => (piece.product ? { ...piece.product, piece } : undefined), [piece]);

  const images = useMemo(
    () =>
      filterWithAsset(piece.images || EMPTY_ARRAY).map(({ asset }) => ({ original: asset.url, thumbnail: asset.url })),
    [piece]
  );

  const colors = useColorsFromImage(piece.images?.[0]?.asset?.url);
  const contrastingColors = useContrastingColors(colors);
  const { color, background } = chooseColors(contrastingColors);

  const thumbnailsWidthPx = images.length > 1 ? THUMBNAILS_WIDTH_PX : 0;
  const [ref, { height: screenHeight, width: screenWidth }] = useMeasure<HTMLDivElement>();
  const { aspectRatio } = getMinAspectRatioDimensions(piece.images ?? []);

  const maxWidth = screenWidth - thumbnailsWidthPx;
  const desiredWidth = aspectRatio <= 1 ? screenHeight * aspectRatio : maxWidth;
  const width = Math.min(desiredWidth, maxWidth) + thumbnailsWidthPx;

  return (
    <Wrapper ref={ref}>
      <CarouselWrapper width={width} thumbnailsWidthPx={thumbnailsWidthPx}>
        <ImageGallery
          items={images}
          showPlayButton={false}
          showFullscreenButton={false}
          thumbnailPosition="right"
          showThumbnails={images.length > 1}
        />
        {/*sized*/}
      </CarouselWrapper>
      <InfoWrapper background={background} color={color}>
        <Title color={color}>{piece.title}</Title>
        <Info>
          {piece.category && <SubTitle>{piece.category}</SubTitle>}
          {piece.description && <div>{piece.description}</div>}
          {piece.material && <div>{piece.material}</div>}
          {piece.size && <div>{piece.size}</div>}
          {piece.care && <div>{piece.care}</div>}
          {piece.size && <div>size: {piece.size}</div>}
        </Info>
        {product && (
          <>
            <br />
            <AddToCart product={product} color={background} backgroundColor={color} />
          </>
        )}
      </InfoWrapper>
    </Wrapper>
  );
};

export default Piece;

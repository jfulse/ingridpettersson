import { identity } from "lodash/fp";

import { EMPTY_ARRAY } from "../constants";
import makeGetServerSideProps, { Props } from "../utils/makeGetServerSideProps";
import getApiUrl from "../utils/getApiUrl";
import { ResolvedProduct } from "../types";
import useData from "../hooks/useData";
import ImageMasonry from "../components/ImageMasonry";

const getShopApiUrl = () => `${getApiUrl()}/api/shop`;

export const getServerSideProps = makeGetServerSideProps(getShopApiUrl);

const Shop = (props: Props<{ pieces: ResolvedProduct[] }>) => {
  const { data } = useData(getShopApiUrl());
  const products: ResolvedProduct[] =
    (data || props.data)?.products ?? EMPTY_ARRAY;

  const images = products.map(({ piece }) => piece.firstImage).filter(identity);
  console.log("🐸 images", images);

  return (
    <div>
      Products:{" "}
      {products
        .map(({ piece, price }) => `${piece.title} (${price})`)
        .join(", ")}
      <ImageMasonry images={images} />
    </div>
  );
};

export default Shop;

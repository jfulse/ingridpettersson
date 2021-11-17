import { useMemo } from "react";

import { EMPTY_ARRAY } from "../constants";
import makeGetServerSideProps, { Props } from "../utils/makeGetServerSideProps";
import getApiUrl from "../utils/getApiUrl";
import filterTruthy from "../utils/filterTruthy";
import { ResolvedProduct } from "../types";
import useData from "../hooks/useData";
import ImageGrid from "../components/ImageGrid";

const getShopApiUrl = () => `${getApiUrl()}/api/shop`;

export const getServerSideProps = makeGetServerSideProps(getShopApiUrl);

const Shop = (props: Props<{ pieces: ResolvedProduct[] }>) => {
  const { data } = useData(getShopApiUrl());
  const products: ResolvedProduct[] = (data || props.data)?.products ?? EMPTY_ARRAY;

  const images = useMemo(() => filterTruthy(products.map(({ piece }) => piece.firstImage)), [products]);
  console.log("🐸 images", images);

  return (
    <div>
      <ImageGrid images={images} />
    </div>
  );
};

export default Shop;

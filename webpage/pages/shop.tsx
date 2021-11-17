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

  const imageObjects = useMemo(
    () =>
      products
        .filter(({ stock }) => stock > 0)
        .map(({ piece: { firstImage, secondImage, _id, title }, price }) => ({
          image: firstImage,
          secondaryImage: secondImage,
          title: title,
          subtitle: `${price} NOK`,
          id: _id,
        })),
    [products]
  );

  return (
    <div>
      <ImageGrid imageObjects={imageObjects} />
    </div>
  );
};

export default Shop;

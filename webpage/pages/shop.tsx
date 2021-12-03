import { useMemo } from "react";

import { EMPTY_ARRAY } from "../constants";
import makeGetStaticProps, { Props } from "../utils/makeGetStaticProps";
import getApiUrl from "../utils/getApiUrl";
import filterTruthy from "../utils/filterTruthy";
import { ResolvedProduct } from "../types";
import useData from "../hooks/useData";
import ImageGrid from "../components/ImageGrid";
import Layout from "../components/Layout";

const getShopApiUrl = () => `${getApiUrl()}/api/shop`;

export const getStaticProps = makeGetStaticProps(getShopApiUrl);

const Shop = (props: Props<{ products: ResolvedProduct[] }>) => {
  const { data } = useData<{ products: ResolvedProduct[] }>(props.dataUrl);
  const products: ResolvedProduct[] = (data || props.data)?.products ?? EMPTY_ARRAY;

  const imageObjects = useMemo(
    () =>
      filterTruthy(
        products
          .filter(({ stock }) => stock > 0)
          .map(({ piece, price }) => {
            if (!piece) return undefined;
            const { firstImage, secondImage, _id, title } = piece;

            return {
              image: firstImage,
              secondaryImage: secondImage,
              title: title,
              subtitle: `${price} NOK`,
              id: _id,
              href: `pieces/${_id}`,
            };
          })
      ),
    [products]
  );

  return (
    <Layout projects={props.projects}>
      <ImageGrid imageObjects={imageObjects} />
    </Layout>
  );
};

export default Shop;

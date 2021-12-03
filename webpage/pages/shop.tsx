import { useMemo } from "react";

import { EMPTY_ARRAY } from "../constants";
import makeGetStaticProps, { Props } from "../utils/makeGetStaticProps";
import getShop from "../queries/getShop";
import filterTruthy from "../utils/filterTruthy";
import { ResolvedProduct } from "../types";
import useData from "../hooks/useData";
import ImageGrid from "../components/ImageGrid";
import Layout from "../components/Layout";

export const getStaticProps = makeGetStaticProps(getShop);

type Shop = { products: ResolvedProduct[] };

const Shop = (props: Props<Shop>) => {
  const { data } = useData<Shop>(getShop, "shop");
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

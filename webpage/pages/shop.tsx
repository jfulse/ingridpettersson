import { useMemo } from "react";

import { EMPTY_ARRAY } from "../constants";
import makeGetStaticProps, { Props } from "../utils/makeGetStaticProps";
import getShop from "../queries/getShop";
import filterTruthy from "../utils/filterTruthy";
import { ResolvedProduct } from "../types";
import useData from "../hooks/useData";
import ProductGrid from "../components/ProductGrid";
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
            const { firstImage, _id, title, category } = piece;

            return {
              image: firstImage,
              title: title,
              price,
              id: _id,
              category,
              href: `pieces/${_id}`,
            };
          })
      ),
    [products]
  );

  return (
    <Layout projects={props.projects} email={props.email}>
      <ProductGrid imageObjects={imageObjects} />
    </Layout>
  );
};

export default Shop;

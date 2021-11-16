import { EMPTY_ARRAY } from "../constants";
import makeGetServerSideProps, { Props } from "../utils/makeGetServerSideProps";
import getApiUrl from "../utils/getApiUrl";
import { ResolvedProduct } from "../types";
import useData from "../hooks/useData";

const getShopApiUrl = () => `${getApiUrl()}/api/shop`;

export const getServerSideProps = makeGetServerSideProps(getShopApiUrl);

const Shop = (props: Props<{ pieces: ResolvedProduct[] }>) => {
  const { data } = useData(getShopApiUrl());
  const products: ResolvedProduct[] =
    (data || props.data)?.products ?? EMPTY_ARRAY;

  return (
    <div>
      Products:{" "}
      {products
        .map(({ piece, price }) => `${piece.title} (${price})`)
        .join(", ")}
    </div>
  );
};

export default Shop;

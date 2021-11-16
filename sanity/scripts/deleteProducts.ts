import client from "../utils/client";

const deleteProducts = async () => {
  const products = await client.fetch(`*[ _type == 'product' ]`);
  let transaction = client.transaction();

  products.forEach(({ _id }) => {
    transaction.delete(_id);
  });

  await transaction.commit();
};

deleteProducts()
  .then(() => console.log("✅ Done"))
  .catch(console.error);

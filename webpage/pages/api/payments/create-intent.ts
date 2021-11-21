import type { NextApiRequest, NextApiResponse } from "next";
import { get } from "lodash/fp";
import Stripe from "stripe";

import { ResolvedProduct } from "../../../types";
import { sanityClient } from "../../../utils/sanityClient";
import countRepetitions from "../../../utils/countRepetitions";

// TODO: Create restricted keys

const PPRODUCTS_QUERY = `*[_type == "product" && _id in $ids ] {
    _id,
    price,
    stock,
    reserved
  }`;

if (!process.env.SECRET_STRIPE_API_KEY) {
  throw new Error("SECRET_STRIPE_API_KEY not found");
}

const stripe = new Stripe(process.env.SECRET_STRIPE_API_KEY, {
  apiVersion: "2020-08-27",
});

// Amount is given in cents (i.e. øre for NOK)
const calculateOrderAmount = async (ids: string[]): Promise<number> => {
  const idsWithCounts = countRepetitions(ids);
  const products = await sanityClient.fetch(PPRODUCTS_QUERY, { ids });
  const outOfStock = products.filter(
    ({ stock, reserved }: { stock: number; reserved: number }) => stock - reserved < 1
  );

  if (outOfStock > 0) {
    throw new Error(`Out of stock on products ${outOfStock.map(get("id")).join(", ")}`);
  }

  const amount: number = products.reduce(
    (total: number, { _id, price }: ResolvedProduct) => total + idsWithCounts[_id] * price,
    0
  );

  return amount;
};

export default async (req: NextApiRequest, res: NextApiResponse<{ clientSecret: string } | string>) => {
  if (req.method !== "POST") {
    res.status(405).send("Only POST requests allowed");
    return;
  }

  const { itemIds, email, address, total } = req.body;
  const {
    name,
    addressLine1: line1,
    addressLine2: line2,
    country,
    city,
    state,
    postalCode: postal_code, // eslint-disable-line camelcase
  } = address;

  let invalid = false;

  // eslint-disable-next-line camelcase
  [city, country, line1, postal_code, state, email].forEach((field: string) => {
    if (field) return;
    res.status(400).send(`Missing ${field}`);
    invalid = true;
  });

  if (invalid) return;

  const amount = await calculateOrderAmount(itemIds);

  if (amount !== total) {
    console.error("Calculated amounts on the frontend and backend unequal");
    res.status(403).send("Something went wrong");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "nok", // TODO
    payment_method_types: ["card"],
    receipt_email: email,
    description: "test description",
    // payment_method, TODO: https://stripe.com/docs/api/payment_intents/create#create_payment_intent-payment_method,
    statement_descriptor: "statement description",
    statement_descriptor_suffix: "suffix",
    shipping: {
      name,
      address: {
        city,
        country,
        line1,
        line2,
        postal_code,
        state,
      },
    },
  });

  if (!paymentIntent.client_secret) {
    res.status(500).send("Could not create client secret");
    return;
  }

  res.status(200).json({ clientSecret: paymentIntent.client_secret });
};

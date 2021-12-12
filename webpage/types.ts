import { MouseEventHandler } from "react";
import { RGBA } from "image-palette";

export type MenuItem = {
  title: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  menuItems?: MenuItem[];
  hidden?: boolean;
};

export type ResolvedAsset = {
  url: string;
  metadata: {
    dimensions: { aspectRatio: number; height: number; width: number };
  };
};

export type ResolvedImage = {
  _key?: string;
  _type?: "image" | "youtubeEmbed";
  url?: string;
  asset?: ResolvedAsset;
};

export type ResolvedProject = {
  _id: string;
  title: string;
  images?: ResolvedImage[];
  year: number;
};

export type ResolvedProduct = {
  _id: string;
  piece?: ResolvedPiece;
  price: number;
  stock: number;
  reserved: number;
};

export type ResolvedPiece = {
  _id: string;
  title: string;
  category?: string;
  firstImage?: ResolvedImage;
  secondImage?: ResolvedImage;
  images?: ResolvedImage[];
  description?: string;
  colour?: string;
  material?: string;
  care?: string;
  size?: number;
  product?: ResolvedProduct;
};

export type ResolvedBio = {
  headline: string;
  body: string;
  image?: ResolvedImage;
};

export type Color = { rgba: RGBA; luma: number; amount: number };

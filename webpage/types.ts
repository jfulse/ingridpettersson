export type MenuItem = {
  title: string;
  href?: string;
  onClick?: () => void;
  menuItems?: MenuItem[];
};

export type ResolvedAsset = {
  url: string;
  metadata: {
    dimensions: { aspectRatio: number; height: number; width: number };
  };
};

export type ResolvedImage = {
  _key?: string;
  ownerId?: string;
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
  piece: ResolvedPiece;
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
};

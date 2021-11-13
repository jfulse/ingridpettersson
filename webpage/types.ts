export type MenuItem = {
  title: string;
  href?: string;
  onClick?: () => void;
  menuItems?: MenuItem[];
};

export type ResolvedAsset = {
  metadata: { dimensions: { aspectRatio: number } };
};

export type ResolvedImage = {
  _id: string;
  asset: ResolvedAsset;
};

export type ResolvedProject = {
  _id: string;
  title: string;
  images?: ResolvedImage[];
  year: number;
};

export type ResolvedPiece = {
  _id: string;
  title: string;
  firstImage: ResolvedImage;
};

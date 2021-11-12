export type MenuItem = {
  title: string;
  href?: string;
  onClick?: () => void;
  menuItems?: MenuItem[];
};

export type ResolvedImage = {
  _id: string;
  asset: { metadata: { dimensions: { aspectRatio: number } } };
};

export type ResolvedProject = {
  _id: string;
  title: string;
  images?: ResolvedImage[];
  year: number;
};

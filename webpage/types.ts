export type MenuItem = {
  title: string;
  href?: string;
  onClick?: () => void;
  menuItems?: MenuItem[];
};

export type ResolvedProject = {
  _id: string;
  title: string;
  images?: { url: string }[];
  year: number;
};

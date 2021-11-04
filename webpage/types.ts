export type MenuItem = {
  title: string;
  href?: string;
  onClick?: () => void;
  menuItems?: MenuItem[];
};

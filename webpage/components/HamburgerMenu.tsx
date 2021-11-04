import HamburgerButton from "./HamburgerButton";
import DropdownMenu, { MenuItems } from "./DropdownMenu";

const HamburgerMenu = ({ items }: { items: MenuItems }) => (
  <DropdownMenu items={items} component={HamburgerButton} />
);

export default HamburgerMenu;

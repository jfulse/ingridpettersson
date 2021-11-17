import HamburgerButton from "./HamburgerButton";
import DropdownMenu from "./DropdownMenu";
import { MenuItem } from "../types";

const HamburgerMenu = ({ items }: { items: MenuItem[] }) => <DropdownMenu items={items} component={HamburgerButton} />;

export default HamburgerMenu;

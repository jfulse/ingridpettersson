import { ReactNode } from "react";
import Link from "./Link";

type Props = {
  href?: string;
  children: ReactNode;
};

const MaybeLink = ({ href, children }: Props) => {
  if (href) return <Link href={href}>{children}</Link>;
  return <>{children}</>;
};

export default MaybeLink;

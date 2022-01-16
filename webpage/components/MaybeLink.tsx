import { MouseEventHandler, ReactNode } from "react";
import Link from "./Link";

type Props = {
  href?: string;
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler;
};

const MaybeLink = ({ href, children, className, onClick }: Props) => {
  if (href) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <span className={className} onClick={onClick}>
      {children}
    </span>
  );
};

export default MaybeLink;

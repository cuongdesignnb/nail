import React, { ReactNode } from "react";
import clsx from "clsx";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Container({ children, className, id }: ContainerProps) {
  return (
    <div
      id={id}
      className={clsx(
        "max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
export default Container;

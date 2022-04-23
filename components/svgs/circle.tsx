import React from "react";
import { SVGProps } from "../../types/SVGProps";

export const Circle: React.FC<SVGProps> = ({ className }: SVGProps) => (
  <svg
    className={className}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12.9581" r="10.5" stroke="black" strokeWidth="3" />
  </svg>
);

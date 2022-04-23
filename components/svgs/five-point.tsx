import React from "react";
import { SVGProps } from "../../types/SVGProps";

export const FivePoint: React.FC<SVGProps> = ({ className }: SVGProps) => (
  <svg
    className={className}
    viewBox="0 0 31 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="4.90063" cy="12.1465" r="3.64398" fill="black" />
    <circle cx="8.54467" cy="23.0785" r="3.64398" fill="black" />
    <circle cx="23.1206" cy="23.0785" r="3.64398" fill="black" />
    <circle cx="26.7646" cy="12.1465" r="3.64398" fill="black" />
    <circle cx="14.6179" cy="3.64398" r="3.64398" fill="black" />
    <path
      d="M27.9495 11.8081L15.2248 3.52973L3.68641 12.0325L9.21759 24.394L22.3683 24.1452L27.9495 11.8081Z"
      stroke="black"
      strokeWidth="2.42932"
    />
  </svg>
);

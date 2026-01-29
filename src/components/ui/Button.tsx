"use client";

import React from "react";
import { useDesign } from "../layout/DesignProvider";
import { getThemeClasses } from "@/lib/design/theme";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const { keywords } = useDesign();
  const theme = getThemeClasses(keywords);
  const baseStyles =
    "transition-all duration-300 font-medium hover:-translate-y-0.5";
  const themeStyles = `${theme.button.padding} ${theme.button.radius} ${theme.button.border}`;

  const variantStyles =
    variant === "primary"
      ? "bg-secondary text-white hover:brightness-90"
      : "bg-gray-200 text-gray-800 hover:brightness-90";

  return (
    <button
      className={`${baseStyles} ${themeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

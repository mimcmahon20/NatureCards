import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Avatar({
  className,
  size = "md",
  ...props
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-gray-200",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

export type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function AvatarImage({ className, alt = "", ...props }: AvatarImageProps) {
  return (
    <img
      className={cn("object-cover w-full h-full", className)}
      alt={alt}
      {...props}
    />
  );
}

export type AvatarFallbackProps = React.HTMLAttributes<HTMLDivElement>;

export function AvatarFallback({
  className,
  children,
  ...props
}: AvatarFallbackProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-full h-full bg-gray-400 text-white text-sm font-medium",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

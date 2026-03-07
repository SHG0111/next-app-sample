"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/utils/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

interface AvatarBadgeProps extends React.ComponentPropsWithoutRef<"span"> {
  /**
   * The count to display in the badge
   */
  count?: number;
  /**
   * The maximum count before showing "99+"
   * @default 99
   */
  maxCount?: number;
  /**
   * Badge variant style
   * @default "default"
   */
  variant?: "default" | "success" | "warning" | "error";
}

const AvatarBadge = React.forwardRef<HTMLSpanElement, AvatarBadgeProps>(
  (
    { className, count, maxCount = 99, variant = "default", style, ...props },
    ref,
  ) => {
    const displayCount =
      count !== undefined && count > maxCount ? "99+" : count;

    const variantColors = {
      default: "#3b82f6", // blue-500
      success: "#10b981", // green-500
      warning: "#eab308", // yellow-500
      error: "#ef4444", // red-500
    };

    return (
      <div className="relative">
        <span
          ref={ref}
          className={cn(
            "absolute bottom-0 right-0 flex h-6 w-6   items-center justify-center rounded-full border-2 z-10 border-white text-xs font-semibold text-white",
            className,
          )}
          style={{
            backgroundColor: variantColors[variant],
            ...style,
          }}
          {...props}
        >
          {displayCount}
          <span className="absolute bottom-0 right-0 inline-flex w-6 h-6 animate-ping duration-1000 z-0  rounded-full bg-red-400 opacity-75"></span>
        </span>
      </div>
    );
  },
);
AvatarBadge.displayName = "AvatarBadge";

interface AvatarBadgeFallbackProps extends React.ComponentPropsWithoutRef<"span"> {
  /**
   * Fallback text when badge content is loading
   */
  children?: React.ReactNode;
}

const AvatarBadgeFallback = React.forwardRef<
  HTMLSpanElement,
  AvatarBadgeFallbackProps
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gray-400 text-xs font-semibold text-white",
      className,
    )}
    {...props}
  >
    {children || "?"}
  </span>
));
AvatarBadgeFallback.displayName = "AvatarBadgeFallback";

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarBadgeFallback,
  type AvatarBadgeProps,
  type AvatarBadgeFallbackProps,
};

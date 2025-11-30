"use client";

import { cn } from "@/lib/utils";

export function Loader({
  size = "default",
  className,
  text = "Loading...",
  showText = true,
  variant = "spinner"
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="text-center">
          <div className={cn(
            "animate-spin rounded-full border-2 border-primary/20 border-t-primary mx-auto",
            sizeClasses[size]
          )} />
          {showText && (
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="text-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          </div>
          {showText && (
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="text-center">
          <div className={cn(
            "bg-primary/20 rounded-full animate-pulse",
            sizeClasses[size]
          )} />
          {showText && (
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// Full page loader component
export function PageLoader({ text = "Loading...", className }) {
  return (
    <div className={cn("flex min-h-screen items-center justify-center bg-background", className)}>
      <div className="text-center">
        <div className="relative inline-flex">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/10"></div>
          </div>
        </div>
        <p className="mt-6 text-base font-medium text-foreground">
          {text}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Please wait</p>
      </div>
    </div>
  );
}

// Table loader component
export function TableLoader({ colSpan = 1, text = "Loading..." }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-8">
        <Loader text={text} />
      </td>
    </tr>
  );
}
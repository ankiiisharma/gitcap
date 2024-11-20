import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    return (
      <div
        className={cn(
          "relative inline-block h-10 w-10 overflow-hidden rounded-full",
          className
        )}
        ref={ref}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-200">
            {fallback ? (
              <span className="text-sm font-medium">
                {fallback.slice(0, 2).toUpperCase()}
              </span>
            ) : (
              <span className="text-sm font-medium">?</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

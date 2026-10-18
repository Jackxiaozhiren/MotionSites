import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("liquid-glass cursor-pointer transition-transform duration-300 hover:scale-[1.03]", className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

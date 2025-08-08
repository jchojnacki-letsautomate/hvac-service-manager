import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-md text-base font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-blue focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        // Główny przycisk w kolorze marki z wysokim kontrastem
        default: "bg-brand-blue text-white hover:bg-brand-blue/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        // Wyraźny kontur w kolorze marki; na hover zmienia się w przycisk wypełniony
        outline:
          "border border-brand-blue text-brand-blue bg-background hover:bg-brand-blue hover:text-white",
        // Drugi kolor marki
        secondary:
          "bg-brand-orange text-white hover:bg-brand-orange/90",
        ghost:
          "text-foreground/80 hover:bg-muted/60",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 rounded-md gap-2 px-4 has-[>svg]:px-3 text-sm",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-5 text-lg",
        icon: "size-11 rounded-md text-white",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
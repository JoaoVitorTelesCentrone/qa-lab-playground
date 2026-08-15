import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-ring/40 transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary border-primary/20 [a&]:hover:bg-primary/15",
        secondary:
          "bg-secondary text-secondary-foreground border-transparent [a&]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/20 [a&]:hover:bg-destructive/15",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent",
        neon:
          "bg-primary/10 text-primary border-primary/20 [a&]:hover:bg-primary/15",
        ghost:
          "border-transparent text-muted-foreground [a&]:hover:bg-accent [a&]:hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

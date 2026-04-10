import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-wider w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-ring/50 transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-mint/20 text-mint border-mint/30 [a&]:hover:bg-mint/30",
        secondary:
          "bg-off-white/10 text-off-white/80 border-off-white/20 [a&]:hover:bg-off-white/20",
        destructive:
          "bg-coral/20 text-coral border-coral/30 [a&]:hover:bg-coral/30",
        outline:
          "border-mint/40 text-mint [a&]:hover:bg-mint/10",
        neon:
          "bg-neon/20 text-neon border-neon/40 [a&]:hover:bg-neon/30",
        ghost:
          "border-transparent text-off-white/60 [a&]:hover:bg-off-white/10 [a&]:hover:text-off-white",
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

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 cursor-pointer box-text",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[#A8C5C3] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20",
        destructive:
          "bg-coral text-[#3D5454] hover:bg-[#F4A8A3] hover:-translate-y-0.5 animate-coral-glow",
        outline:
          "border-2 border-mint/30 bg-transparent text-mint hover:bg-mint/10 hover:border-mint/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[#657578] hover:-translate-y-0.5",
        ghost:
          "hover:bg-off-white/10 hover:text-off-white text-off-white/70",
        link: "text-mint underline-offset-4 hover:underline hover:text-[#A8C5C3]",
        neon:
          "bg-neon text-[#3D5454] hover:bg-[#C8E85F] hover:-translate-y-0.5 animate-neon-glow font-extrabold",
        coral:
          "bg-coral text-[#3D5454] hover:bg-[#F4A8A3] hover:-translate-y-0.5 font-extrabold",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        xs: "h-7 gap-1 rounded-lg px-3 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-6 text-base",
        icon: "size-10",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

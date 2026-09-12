import * as SliderPrimitive from "@radix-ui/react-slider";
import { useEffect, useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Slider({
  className,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div
        className={cn("relative z-10 h-11 w-full", className)}
        aria-hidden="true"
      />
    );
  }
  return (
    <SliderPrimitive.Root
      className={cn("relative z-10 flex h-11 w-full select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow rounded-full bg-raised">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-accent" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-5 rounded-full bg-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_20%,transparent)] outline-none focus-visible:ring-2 focus-visible:ring-accent" />
    </SliderPrimitive.Root>
  );
}

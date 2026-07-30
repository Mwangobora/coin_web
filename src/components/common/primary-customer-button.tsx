import type { ButtonHTMLAttributes } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PrimaryCustomerButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      size="lg"
      className={cn("h-14 w-full text-base", className)}
      {...props}
    />
  );
}

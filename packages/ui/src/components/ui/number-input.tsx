"use client";

import { CaretDown, CaretUp } from "@phosphor-icons/react";
import {
  Button,
  Group,
  Input,
  NumberField,
  type NumberFieldProps,
} from "react-aria-components";
import { cn } from "../../lib/utils";

interface NumberInputProps extends Omit<NumberFieldProps, "children"> {
  className?: string;
}

export function NumberInput({ className, ...props }: NumberInputProps) {
  return (
    <NumberField {...props}>
      <Group
        className={cn(
          "relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-md border border-input bg-background text-sm shadow-xs outline-none transition-[color,box-shadow] data-focus-within:border-ring data-disabled:opacity-50 data-focus-within:ring-[3px] data-focus-within:ring-ring/50",
          className
        )}
      >
        <Input className="flex-1 bg-transparent px-3 py-2 text-foreground tabular-nums outline-none" />
        <div className="flex h-[calc(100%+2px)] flex-col">
          <Button
            className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-muted-foreground/80 text-sm transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            slot="increment"
          >
            <CaretUp aria-hidden="true" size={12} weight="bold" />
          </Button>
          <Button
            className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-muted-foreground/80 text-sm transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            slot="decrement"
          >
            <CaretDown aria-hidden="true" size={12} weight="bold" />
          </Button>
        </div>
      </Group>
    </NumberField>
  );
}

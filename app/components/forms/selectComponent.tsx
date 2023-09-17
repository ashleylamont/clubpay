import { forwardRef } from "react";
import type { JSX } from "react/jsx-runtime";

const SelectComponent = forwardRef<
  HTMLSelectElement,
  JSX.IntrinsicElements["select"]
>(({ className = "", ...props }, ref) => (
  <select
    ref={ref}
    className={`select select-bordered ${className}`}
    {...props}
  />
));

SelectComponent.displayName = "SelectComponent";

export default SelectComponent;

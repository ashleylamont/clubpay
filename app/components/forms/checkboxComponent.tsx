import { forwardRef } from "react";

const CheckboxComponent = forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements["input"]
>(({ type = "checkbox", className = "", ...props }, ref) => (
  <input ref={ref} type={type} className={`checkbox ${className}`} {...props} />
));

CheckboxComponent.displayName = "CheckboxComponent";

export default CheckboxComponent;

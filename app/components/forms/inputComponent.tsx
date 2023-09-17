import { forwardRef } from "react";

const InputComponent = forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements["input"]
>(({ type = "text", className = "", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={`input input-bordered ${className}`}
    {...props}
  />
));

InputComponent.displayName = "InputComponent";

export default InputComponent;

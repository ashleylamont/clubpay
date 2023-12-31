import { forwardRef } from "react";

const MultilineComponent = forwardRef<
  HTMLTextAreaElement,
  JSX.IntrinsicElements["textarea"]
>(({ className = "", ...props }, ref) => (
  <textarea ref={ref} className={`textarea ${className}`} {...props} />
));

MultilineComponent.displayName = "MultilineComponent";

export default MultilineComponent;

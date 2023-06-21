import { useIsSubmitting } from "remix-validated-form";
import type { ButtonProps } from "@mui/material/Button";
import Button from "@mui/material/Button";

export default function SubmitButton(buttonProps: ButtonProps) {
  const isSubmitting = useIsSubmitting();
  return (
    <Button type="submit" disabled={isSubmitting} {...buttonProps}>
      {isSubmitting ? "Submitting..." : "Submit"}
    </Button>
  );
};

export default function FieldComponent({
  className = "",
  ...props
}: JSX.IntrinsicElements["div"]) {
  return <div className={`form-control mb-4 ${className}`} {...props} />;
}

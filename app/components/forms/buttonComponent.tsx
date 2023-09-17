export default function ButtonComponent({
  className = "",
  ...props
}: JSX.IntrinsicElements["button"]) {
  return <button className={`btn btn-primary ${className}`} {...props} />;
}

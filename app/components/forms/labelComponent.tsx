export default function LabelComponent({
  className = "",
  children,
  ...props
}: JSX.IntrinsicElements["label"]) {
  return (
    <label className={`label ${className}`} {...props}>
      <span className="label-text">{children}</span>
    </label>
  );
}

import { useField } from "remix-validated-form";
import type { TextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";

export type TextInputProps = {
  name: string;
  label: string;
} & TextFieldProps;

export default function TextInput({name, label, ...textFieldProps}: TextInputProps): JSX.Element {
  const {error, getInputProps} = useField(name);
  return (
    <TextField label={label} inputProps={getInputProps()} error={!!error} helperText={error} {...textFieldProps} name={name}/>
  )
}

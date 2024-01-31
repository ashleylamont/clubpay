import type { FormProps, FormSchema } from "remix-forms";
import { createForm } from "remix-forms";
import {
  Form as FrameworkForm,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import FieldComponent from "~/components/forms/fieldComponent";
import LabelComponent from "~/components/forms/labelComponent";
import InputComponent from "~/components/forms/inputComponent";
import MultilineComponent from "~/components/forms/multilineComponent";
import SelectComponent from "~/components/forms/selectComponent";
import CheckboxComponent from "~/components/forms/checkboxComponent";
import ButtonComponent from "~/components/forms/buttonComponent";
import CheckboxWrapperComponent from "~/components/forms/checkboxWrapperComponent";

const RemixForm = createForm({
  component: FrameworkForm,
  useNavigation,
  useSubmit,
  useActionData,
});

function Form<Schema extends FormSchema>(props: FormProps<Schema>) {
  return (
    <RemixForm<Schema>
      className="w-full"
      fieldComponent={FieldComponent}
      labelComponent={LabelComponent}
      inputComponent={InputComponent}
      multilineComponent={MultilineComponent}
      selectComponent={SelectComponent}
      checkboxComponent={CheckboxComponent}
      checkboxWrapperComponent={CheckboxWrapperComponent}
      buttonComponent={ButtonComponent}
      {...props}
    />
  );
}

export { Form };

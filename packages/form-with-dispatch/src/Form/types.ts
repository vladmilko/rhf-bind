import { FieldValues, SubmitErrorHandler, SubmitHandler, UseFormProps } from 'react-hook-form';

/**
 * Extended configuration options for a form component, enabling control over submission, error handling,
 * validation, debugging, and HTML form properties.
 *
 * @template FormValues - Specifies the type for form field values, ensuring type safety and validation.
 * @template ExtraArgs - Optionally defines a type for any additional arguments passed to `formDispatch`.
 */
export interface FormProps<
  FormValues extends FieldValues,
  ExtraArgs extends Record<string, unknown> = Record<string, unknown>,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
> extends UseFormProps<FormValues, TContext> {
  /**
   * Function invoked upon successful form submission.
   */
  onSubmit?: TTransformedValues extends undefined
    ? SubmitHandler<FormValues>
    : TTransformedValues extends FieldValues
      ? SubmitHandler<TTransformedValues>
      : never;

  /**
   * Function invoked when form validation fails, providing detailed error information.
   */
  onSubmitFailed?: SubmitErrorHandler<FormValues>;

  /**
   * Optional arguments passed to the `formDispatch` function to provide additional parameters or context.
   *
   * This allows for passing custom state or configurations required during form actions, adding flexibility
   * to form action handling logic.
   */
  extraArgs?: ExtraArgs;

  /**
   * Additional properties applied to the HTML form element, excluding `onSubmit` to avoid conflicts.
   *
   * Use this field to apply standard HTML attributes or styling directly on the form element.
   */
  formElementProps?: Omit<
    React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
    'onSubmit'
  >;
}

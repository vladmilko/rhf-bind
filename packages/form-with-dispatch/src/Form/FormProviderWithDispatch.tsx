import { FieldValues, FormProvider, FormProviderProps } from 'react-hook-form';

import type { FormDispatch } from '$useFormDispatch';
import { FormDispatchContext } from '$useFormDispatch/useFormDispatch';

export interface FormProviderWithDispatchProps<
  FormValues extends FieldValues = FieldValues,
  ExtraArgs extends Record<string, unknown> = Record<string, unknown>,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
> extends FormProviderProps<FormValues, TContext, TTransformedValues> {
  formDispatch: FormDispatch<FormValues, ExtraArgs>;
}

/**
 * `FormProviderWithDispatch` is an extension of the `FormProvider` component from `react-hook-form`.
 * It adds support for a custom `formDispatch` prop, enabling additional custom functionality
 * for form actions that can be passed down and utilized within nested components.
 *
 * @template FormValues - Type for the form fields, typically inferred from the specific form's schema.
 * @template ExtraArgs - Optional type for additional arguments passed to `formDispatch`, enabling
 * customization of the form's context or action parameters.
 * @template TContext - Type for any additional context data required by `useForm`, defaulting to `any`.
 * @template TTransformedValues - If specified, provides typing for transformed values that
 * `useForm` might handle upon form submission.
 */
export const FormProviderWithDispatch = <
  FormValues extends FieldValues = FieldValues,
  ExtraArgs extends Record<string, unknown> = Record<string, unknown>,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>({
  children,
  formDispatch,
  ...props
}: FormProviderWithDispatchProps<FormValues, ExtraArgs, TContext, TTransformedValues>) => {
  return (
    <FormProvider<FormValues, TContext, TTransformedValues> {...props}>
      <FormDispatchContext.Provider value={formDispatch as FormDispatch}>{children}</FormDispatchContext.Provider>
    </FormProvider>
  );
};

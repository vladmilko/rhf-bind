import { PropsWithChildren } from 'react';
import { FieldValues } from 'react-hook-form';

import { useFormWithDispatch } from '$useFormWithDispatch';

import { FormProviderWithDispatch } from './FormProviderWithDispatch';
import type { FormProps } from './types';

/**
 * `Form` component is a wrapper that provides form state and handling to nested elements.
 * It integrates with `react-hook-form` via `useForm`, passing its form methods to the
 * nested components through `FormProviderWithDispatch`, making them accessible with `useFormContext`.
 *
 * @template FormValues - Specifies the types for form field values, enabling typed form handling.
 * @template ExtraArgs - Allows additional arguments to be passed to `formDispatch`, useful for
 * contextual data or parameters required in form actions.
 * @template TContext - Optional context data type for any extra state required by `useForm`.
 * @template TTransformedValues - If specified, this type is used for any transformed values
 * returned by `useForm` when submitting data.
 */
export const Form = <
  FormValues extends FieldValues = FieldValues,
  ExtraArgs extends Record<string, unknown> = Record<string, unknown>,
  TContext = any,
  TTransformedValues extends FieldValues = FormValues,
>({
  children,
  formElementProps,
  extraArgs,
  onSubmit,
  onSubmitFailed,
  ...useFormProps
}: PropsWithChildren<FormProps<FormValues, ExtraArgs, TContext, TTransformedValues>>) => {
  const methods = useFormWithDispatch<FormValues, ExtraArgs, TContext, TTransformedValues>(useFormProps, extraArgs);

  /**
   * Prevents form submission when Enter is pressed, except within a `<textarea>`.
   */
  const keyDownHandler = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) {
      e.preventDefault();
    }
  };

  return (
    <FormProviderWithDispatch<FormValues, ExtraArgs, TContext, TTransformedValues> {...methods}>
      <form
        onKeyDown={keyDownHandler}
        {...formElementProps}
        onSubmit={onSubmit && methods.handleSubmit(onSubmit, onSubmitFailed)}
      >
        {children}
      </form>
    </FormProviderWithDispatch>
  );
};

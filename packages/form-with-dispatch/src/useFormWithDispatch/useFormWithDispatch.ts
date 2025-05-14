import { useMemo } from 'react';
import { FieldValues, useForm as useFormRhf, UseFormProps } from 'react-hook-form';

import { createFormDispatch } from './helpers';

export const useFormWithDispatch = <
  FormValues extends FieldValues,
  ExtraArgs extends Record<string, unknown> = Record<string, unknown>,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>(
  props?: UseFormProps<FormValues, TContext>,
  extraArgs?: ExtraArgs,
) => {
  const methods = useFormRhf<FormValues, TContext, TTransformedValues>(props);

  const { setValue, setError, getValues, clearErrors, trigger, reset, getFieldState, resetField } = methods;

  const formDispatch = useMemo(
    () =>
      createFormDispatch<FormValues, ExtraArgs>(
        {
          setValue,
          setError,
          getValues,
          clearErrors,
          trigger,
          reset,
          getFieldState,
          resetField,
        },
        { ...extraArgs } as ExtraArgs,
      ),
    [setValue, setError, getValues, clearErrors, trigger, reset, getFieldState, resetField, extraArgs],
  );

  return { ...methods, formDispatch };
};

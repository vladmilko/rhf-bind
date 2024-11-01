import { FieldValues } from 'react-hook-form';

import type { FormActionProps, FormDispatch } from '$useFormDispatch';

export const createFormDispatch =
  <FormValues extends FieldValues = FieldValues, ExtraArgs extends Record<string, unknown> = Record<string, unknown>>(
    props: Omit<FormActionProps<FormValues>, 'formDispatch'>,
    extraArgs: ExtraArgs,
  ): FormDispatch<FormValues, ExtraArgs> =>
  action =>
    action({ ...props, formDispatch: createFormDispatch(props, extraArgs) }, extraArgs);

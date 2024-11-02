import { createContext, useContext } from 'react';
import { FieldValues } from 'react-hook-form';

import { USE_FORM_DISPATCH_ERROR_MESSAGE } from './consts';
import { FormDispatch } from './types';

/**
 * Context to provide form action dispatching via `FormDispatch`.
 *
 * This context enables form actions to be dispatched, allowing encapsulation of
 * custom business logic that interacts with form state. The default value is `null`,
 * which is checked in the `useFormDispatch` hook to ensure the context is provided.
 */
export const FormDispatchContext = createContext<FormDispatch | null>(null);

/**
 * Custom hook to retrieve the form action dispatcher (`FormDispatch`) from context.
 *
 * This hook enables the dispatching of form actions that can encapsulate custom
 * business logic and operations on the form's state.
 *
 * @template FormValues - Type of form values managed by `react-hook-form`. Defaults to `FieldValues`.
 * @template ExtraArgs - Optional type for additional arguments passed to actions, defaults to an empty object.
 *
 * @throws Will throw an error if `FormDispatchContext` is not available.
 */
export const useFormDispatch = <
  FormValues extends FieldValues = FieldValues,
  ExtraArgs extends Record<string, unknown> = Record<string, unknown>,
>() => {
  const formDispatch = useContext(FormDispatchContext);

  if (!formDispatch) {
    throw new Error(USE_FORM_DISPATCH_ERROR_MESSAGE);
  }

  return formDispatch as FormDispatch<FormValues, ExtraArgs>;
};

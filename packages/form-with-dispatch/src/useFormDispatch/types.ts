import { FieldValues, UseFormReturn } from 'react-hook-form';

/**
 * Properties passed to form actions in `FormDispatch`.
 *
 * This type is a subset of methods from `UseFormReturn` provided by `react-hook-form` and
 * includes only essential functions for interacting with form values, setting errors,
 * and triggering validations. It also adds a `formDispatch` function, enabling custom
 * form action dispatching.
 *
 * @template FormValues - Structure of the form values managed by `react-hook-form`.
 * @template ExtraArgs - Optional additional arguments that can be passed into actions
 * for custom logic. Defaults to an empty object.
 */
export type FormActionProps<
  FormValues extends FieldValues,
  ExtraArgs extends Record<string, unknown> = Record<string, unknown>,
> = Pick<
  UseFormReturn<FormValues>,
  'getValues' | 'reset' | 'setError' | 'setValue' | 'trigger' | 'clearErrors' | 'getFieldState' | 'resetField'
> & { formDispatch: FormDispatch<FormValues, ExtraArgs> };

/**
 * Defines a custom action function to be dispatched within a form, enabling
 * interaction with form values and optional extra arguments.
 *
 * @template FormValues - Structure of the form values handled by the form.
 * @template Return - Type of the value returned by the action. Defaults to `void`.
 * @template ExtraArgs - Optional additional arguments for custom logic. Defaults to an empty object.
 */
export type FormAction<
  FormValues extends FieldValues = FieldValues,
  Return = void,
  ExtraArgs extends Record<string, unknown> = Record<string, unknown>,
> = (props: FormActionProps<FormValues, ExtraArgs>, extraArgs: ExtraArgs) => Return;

/**
 * Dispatch function for executing a form action, providing enhanced control over form state
 * by integrating with `react-hook-form` methods and enabling custom behavior.
 *
 * This function takes a `FormAction`, executes it with specified arguments, and
 * returns the result.
 *
 * @template FormValues - Structure of the form values.
 * @template ExtraArgs - Optional additional arguments passed to the form action. Defaults to an empty object.
 */
export type FormDispatch<
  FormValues extends FieldValues = FieldValues,
  ExtraArgs extends Record<string, unknown> = Record<string, unknown>,
> = <Return>(action: FormAction<FormValues, Return, ExtraArgs>) => Return;

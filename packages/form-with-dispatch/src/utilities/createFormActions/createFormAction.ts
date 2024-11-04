import { useCallback } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FormActionProps } from '$useFormDispatch';
import { useFormDispatch } from '$useFormDispatch';

/**
 * A helper function to create reusable form actions compatible with `react-hook-form`,
 * allowing for encapsulation of complex form logic and business rules in form actions.
 *
 * This function returns a tuple:
 *  - A hook (`useActionHook`) that provides a version of the form action already bound to
 *    the form dispatch, so it can be invoked directly in components.
 *  - The form action creator function (`actionCreator`), which allows the action to be dispatched
 *    manually if needed.
 *
 * @template Props - Custom properties specific to the form action.
 * @template FormState - Form values type, extending `FieldValues` from `react-hook-form`.
 * @template ReturnType - Expected return type of the action, default is `void`.
 * @template ExtraArgsForm - Additional arguments for handling specific logic, default is a generic record.
 *
 * @example
 * // Define the form action using `createFormAction`
 * const [useSubmitAction, submitAction] = createFormAction(
 *   (props, { setValue }, extraArgs) => {
 *     // Business logic and form interactions
 *     setValue('fieldName', props.value);
 *   }
 * );
 *
 * // Use the bound action in a component
 * const MyComponent = () => {
 *   const submit = useSubmitAction();
 *   submit({ value: 'newValue' });
 * };
 */
export const createFormAction = <
  Props,
  FormState extends FieldValues = FieldValues,
  ReturnType = void,
  ExtraArgsForm extends Record<string, unknown> = Record<string, unknown>,
>(
  action: (
    props: Props,
    actionProps: FormActionProps<FormState, ExtraArgsForm>,
    extraArgs: ExtraArgsForm,
  ) => ReturnType,
) => {
  // Creates a bound action function for specific form interactions
  const actionCreator =
    (props: Props) => (actionProps: FormActionProps<FormState, ExtraArgsForm>, extraArgs: ExtraArgsForm) =>
      action(props, actionProps, extraArgs);

  // Hook that uses `formDispatch` to automatically bind the action for dispatch
  const useActionHook = () => {
    const formDispatch = useFormDispatch<FormState, ExtraArgsForm>();

    return useCallback((props: Props) => formDispatch(actionCreator(props)), [formDispatch]);
  };

  return [useActionHook, actionCreator] as [typeof useActionHook, typeof actionCreator];
};

import { useCallback, useMemo } from 'react';
import mergeRefs from 'merge-refs';
import { FieldPath, FieldPathValue, FieldValues, PathValue, RefCallBack, useController } from 'react-hook-form';

import { ComposeField, UseComposeControllerProps } from './types';

/**
 * Custom hook that extends `react-hook-form`'s `useController` with additional handlers for change events.
 *
 * `useComposeController` provides a controlled form field with enhanced change behavior:
 * - Executes custom `onChange` logic alongside the `useController`'s onChange handler.
 * - Supports optional validation before applying a new value.
 * - Allows merging multiple refs (e.g., internal `useController` ref and an external `fieldRef`).
 *
 * @template FormValues - Type of form values (extends `FieldValues` from `react-hook-form`).
 * @template TName - Type for the field name within the form values (extends `FieldPath<FormValues>`).
 * @template FieldValue - Type of the field's value (defaults to `FieldPathValue<FormValues, TName>`).
 * @template FieldRef - Type of the field ref (defaults to `RefCallBack`).
 *
 * @param {UseComposeControllerProps<FormValues, TName, FieldValue>} props - Hook props.
 * @param {(value: FieldValue) => void} [props.onChange] - Optional external `onChange` handler.
 * @param {(newValue: FieldValue, prevValue: FieldValue) => boolean | Promise<boolean>} [props.shouldChangeValue] - Optional callback to conditionally accept/reject value changes.
 * @param {React.Ref<Element | null>} [props.fieldRef] - Optional external ref to the field element.
 *
 * @returns {object} Object containing:
 * - `field`: A controlled field with merged `onChange`, `onBlur`, `ref`, and `value` properties.
 * - `fieldState`: The state of the field (e.g., validation errors).
 */
export const useComposeController = <
  FormValues extends FieldValues = FieldValues,
  TName extends FieldPath<FormValues> = FieldPath<FormValues>,
  FieldValue = FieldPathValue<FormValues, TName>,
  FieldRef = RefCallBack,
>({
  onChange: propsOnChange,
  shouldChangeValue,
  fieldRef,
  defaultValue,
  ...props
}: UseComposeControllerProps<FormValues, TName, FieldValue, FieldRef>) => {
  const {
    field: { onBlur, onChange, ref, value },
    fieldState,
  } = useController<FormValues, TName>({ ...props, defaultValue: defaultValue as PathValue<FormValues, TName> });

  /**
   * Handler for processing `onChange` events.
   *
   * This handler applies both internal and external `onChange` logic, invoking `shouldChangeValue`
   * if defined to conditionally accept or reject new values. If `shouldChangeValue` returns
   * `true`, the new value is applied; otherwise, the change is ignored.
   *
   * @param newValue - The new value for the field.
   */
  const onChangeHandler = useCallback(
    (newValue: FieldValue) => {
      const changeHandlers = () => {
        onChange(newValue);
        propsOnChange?.(newValue);
      };

      // Execute changeHandlers if no `shouldChangeValue` or if it approves the new value
      if (!shouldChangeValue) {
        changeHandlers();
        return;
      }

      Promise.resolve(shouldChangeValue(newValue, value)).then(canChange => {
        if (canChange) {
          changeHandlers();
        }
      });
    },
    [value, onChange, propsOnChange, shouldChangeValue],
  );

  /**
   * Memoized field object that combines `useController` field properties with custom handlers.
   *
   * - `onChange`: Uses `onChangeHandler` to apply custom change logic.
   * - `onBlur`: Directly uses `onBlur` from `useController`.
   * - `ref`: Combines `useController` ref with an optional external `fieldRef`.
   * - `value`: Current field value.
   */
  const composedField = useMemo(
    () => ({
      onChange: onChangeHandler,
      onBlur,
      ref: mergeRefs<FieldRef | null>(ref, fieldRef),
      value,
    }),
    [onChangeHandler, onBlur, ref, fieldRef, value],
  ) as ComposeField<FieldValue, FieldRef>;

  return { field: composedField, fieldState };
};

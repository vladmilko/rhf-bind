import { MutableRefObject, Ref, RefCallback } from 'react';
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  Noop,
  RegisterOptions,
  UseControllerProps,
  Validate,
} from 'react-hook-form';

/**
 * Type for register options with overridden `validate` and `value` properties.
 *
 * This type modifies the `RegisterOptions` from `react-hook-form` by allowing:
 * 1. A custom validation function (or a set of validations).
 * 2. An optional initial field value.
 *
 * @template FieldValue - Type of the field's value.
 * @template FormValues - Type of the form values object (extends `FieldValues` from `react-hook-form`).
 */
export type OverriddenRegisterOptions<FieldValue, FormValues extends FieldValues = FieldValues> = Omit<
  RegisterOptions<FormValues>,
  'validate'
> & {
  /**
   * Custom validation function(s) for the field.
   *
   * This can be a single validation function or an object where each key is associated with a validation function.
   */
  validate?: Validate<FieldValue, FormValues> | Record<string, Validate<FieldValue, FormValues>>;

  /** Initial value for the field */
  value?: FieldValue;
};

/**
 * Properties for the `useComposeController` hook.
 *
 * Extends the properties from `UseControllerProps` of `react-hook-form`, with additional support for custom change handling,
 * pre-change validation, and a field reference.
 *
 * @template FormValues - Type of form values object (extends `FieldValues` from `react-hook-form`).
 * @template TName - Type of the field name (extends `FieldPath` for the `FormValues`).
 * @template FieldValue - Type of the field's value.
 */
export type UseComposeControllerProps<
  FormValues extends FieldValues = FieldValues,
  TName extends FieldPath<FormValues> = FieldPath<FormValues>,
  FieldValue = FieldPathValue<FormValues, TName>,
> = UseControllerProps<FormValues, TName> & {
  /**
   * Validation rules and options for the field.
   *
   * This uses the `OverriddenRegisterOptions` type, allowing custom `validate` and `value` properties.
   */
  rules?: OverriddenRegisterOptions<FieldValue, FormValues>;

  /**
   * User-defined handler for change events on the field.
   *
   * @param value - The new value for the field.
   */
  onChange?: (value: FieldValue) => void;

  /**
   * Callback executed before updating the field's value.
   *
   * The field value is only updated if this callback returns `true`.
   *
   * @param newValue - Proposed new value.
   * @param prevValue - Current value before the change.
   * @returns `true` to allow the update; `false` to cancel the update. May also return a Promise resolving to a boolean.
   */
  shouldChangeValue?: (newValue: FieldValue, prevValue: FieldValue) => boolean | Promise<boolean>;

  /** Reference to the DOM element associated with the field. */
  fieldRef?: ReactRef<Element | null> | null | undefined;
};

/**
 * Type alias for a React ref, which can be either a callback ref or a `MutableRefObject`.
 *
 * @template T - The type of the referenced value.
 */
type ReactRef<T> = RefCallback<T> | MutableRefObject<T>;

/**
 * Interface representing the field object returned by the `useComposeController` hook.
 *
 * This object is useful for integrating custom components with `react-hook-form`.
 *
 * @template FieldValue - Type of the field's value.
 */
export interface ComposeField<FieldValue> {
  /**
   * Handler for change events on the field.
   *
   * @param value - The new value for the field.
   */
  onChange: (value: FieldValue) => void;

  /** Handler triggered on blur events for the field. */
  onBlur: Noop;

  /** Reference to the DOM element associated with the field. */
  ref: Ref<Element | null>;

  /** Current value of the field. */
  value: FieldValue;
}

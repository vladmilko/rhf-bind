import { ControllerFieldState, FieldPath, FieldPathValue, FieldValues, RefCallBack } from 'react-hook-form';

import { ComposeField, UseComposeControllerProps } from '$useComposeController';

/**
 * Interface representing properties injected into components wrapped by `withComposeController`.
 * Includes form `field` data and `fieldState` (validation status and metadata).
 */
interface ControlProps<FieldValue, FieldRef = RefCallBack> {
  /** Provides the field data for controlled components. */
  field: ComposeField<FieldValue, FieldRef>;

  /** Contains validation status and other field-specific metadata. */
  fieldState: ControllerFieldState;
}

/**
 * Type for props passed to components wrapped by `withComposeController`.
 * Combines `ControlProps` with the original component's props, omitting form-specific props
 * (`onChange`, `value`, `defaultValue`) to prevent conflicts.
 */
export type ComposedComponentProps<FieldValue, ComponentProps, FieldRef = RefCallBack> = ControlProps<
  FieldValue,
  FieldRef
> &
  Omit<ComponentProps, 'onChange' | 'value' | 'defaultValue'>;

/**
 * Utility type that omits specific form-related properties (`onChange`, `ref`, `value`,
 * `fieldState`, `field`, `defaultValue`) from a component's props, allowing `withComposeController`
 * to manage them and ensure clear typing for other component-specific props.
 */
export type OmittedFieldProps<ComponentProps> = Omit<
  ComponentProps,
  'onChange' | 'ref' | 'value' | 'fieldState' | 'field' | 'defaultValue'
>;

/**
 * Props type for components enhanced with `withComposeController`, which injects controlled form handling
 * capabilities and optionally disables controller functionality.
 *
 * @template FormValues - Type representing the structure of form values handled by `react-hook-form`.
 * @template TName - Field path for a specific form field within `FormValues`.
 * @template FieldValue - Type representing the value of the field specified by `TName`.
 * @template FieldRef - Type of the field ref (defaults to `RefCallBack`).
 */
export type WithComposeControllerComponentProps<
  FormValues extends FieldValues = FieldValues,
  TName extends FieldPath<FormValues> = FieldPath<FormValues>,
  FieldValue = FieldPathValue<FormValues, TName>,
  FieldRef = RefCallBack,
> = Omit<UseComposeControllerProps<FormValues, TName, FieldValue, FieldRef>, 'name' | 'disabled'> & {
  /** Path name for the field within `FormValues`. */
  fieldName: TName;

  /** Optional property to disable controller functionality for the component. */
  disabledController?: boolean;
};

export type OverrideComposeControllerProps<
  ComponentProps,
  FormValues extends FieldValues = FieldValues,
  FieldValue = unknown,
  FieldRef = RefCallBack,
> = WithComposeControllerComponentProps<FormValues, FieldPath<FormValues>, FieldValue, FieldRef> &
  OmittedFieldProps<ComponentProps>;

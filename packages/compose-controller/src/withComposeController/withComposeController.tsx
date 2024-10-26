import { type ComponentType, useMemo } from 'react';
import type { FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import { OverriddenRegisterOptions, useComposeController } from '$useComposeController';

import { WithComposeControllerComponentProps } from './types';

/**
 * Higher-Order Component (HOC) wraps a component to inject controlled
 * form behavior from `useComposeController`. It extends the wrapped component with two
 * additional properties:
 * - `field`: Contains configuration and data for controlled form handling.
 * - `fieldState`: Provides field validation status and metadata.
 *
 * @template ComponentProps - Props of the component being wrapped.
 * @template FormValues - Structure of form values managed by `react-hook-form`. Defaults to `FieldValues`.
 * @template TName - Path to the specific field within `FormValues`. Defaults to `FieldPath<FormValues>`.
 * @template FieldValue - Type of the value at the specified field path. Defaults to `FieldPathValue<FormValues, TName>`.
 *
 * @param Component - React component to wrap with controlled form behavior.
 * @param defaultRules - Optional default validation rules for the form field.
 *
 * @returns WrappedComponent - A component that manages form state and field logic for `Component`.
 */
export const withComposeController = <
  ComponentProps,
  FormValues extends FieldValues = FieldValues,
  TName extends FieldPath<FormValues> = FieldPath<FormValues>,
  FieldValue = FieldPathValue<FormValues, TName>,
>(
  Component: ComponentType<ComponentProps>,
  defaultRules?: OverriddenRegisterOptions<FieldValue, FormValues>,
) => {
  const WrappedComponent = ({
    fieldName,
    defaultValue,
    rules,
    onChange,
    shouldChangeValue,
    control,
    shouldUnregister,
    disabledController,
    fieldRef,
    ...otherProps
  }: WithComposeControllerComponentProps<FormValues, TName, FieldValue>) => {
    // Merge default and custom validation rules, prioritizing `rules`.
    const resolvedRules = useMemo(() => ({ ...defaultRules, ...rules }), [rules]);

    const controllerProps = useComposeController<FormValues, TName, FieldValue>({
      name: fieldName,
      rules: resolvedRules,
      disabled: disabledController,
      defaultValue,
      onChange,
      control,
      shouldUnregister,
      shouldChangeValue,
      fieldRef,
    });

    return <Component {...(otherProps as ComponentProps)} {...controllerProps} />;
  };

  WrappedComponent.displayName = Component.displayName || Component.name || 'Component';

  return WrappedComponent;
};

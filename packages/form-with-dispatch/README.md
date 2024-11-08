# @rhf-bind/form-with-dispatch

A utility library to streamline form handling in React, extending `react-hook-form` with custom dispatching mechanisms and contextual support. Ideal for managing complex form logic, nested components, and dynamic form states, while enabling modular, type-safe form action handling.

## Features

- **Extended Context Management**: Simplifies form state management across nested components.
- **Flexible Form Actions**: Provides a `formDispatch` mechanism for advanced workflows.
- **Type-Safe Interfaces**: Generic types ensure type-safe interactions and prevent runtime errors.
- **Integration with** `react-hook-form`: Wraps `useForm` to provide additional control over form behavior.

## Installation

Install the package via npm or yarn:

```bash
npm install @rhf-bind/form-with-dispatch
# or
yarn add @rhf-bind/form-with-dispatch
```

## Getting Started

This library builds on `react-hook-form` by adding extra capabilities for modular form actions and dispatching.

Here’s a simple example demonstrating how to use `Form` and `useFormDispatch` with form actions:

**SomeFormComponent**

```tsx
import { Form } from '@rhf-bind/form-with-dispatch';
import { SomeFieldComponent } from './SomeFieldComponent';

const SomeFormComponent = () => {
  const onSubmit = (data: SomeFormState) => {
    // Some your handle logic
  };

  return (
    <Form onSubmit={onSubmit}>
      <SomeFieldComponent />
    </Form>
  );
};
```

**SomeFieldComponent**

```tsx
// Example using useFormDispatch and plain form action
import { useFormDispatch } from '@rhf-bind/form-with-dispatch';
import { someFieldAction } from './someFieldAction';

export const SomeFieldComponent = () => {
  const formDispatch = useFormDispatch<SomeFormState>();

  const onChange = (val: string) => {
    formDispatch(someFieldAction(val));
  };
};

// Example using hook from createFormAction utility for creating form action
import { useSomeFieldAction } from './someFieldAction';

export const SomeFieldComponent = () => {
  const someFieldAction = useSomeFieldAction();

  const onChange = (val: string) => {
    someFieldAction(val);
  };
};
```

**someFieldAction**

```ts
// Creating form action using createFormAction
const [useSomeFieldAction, someFieldAction] = createFormAction<string, SomeFormState>(
  (props, { setValue, getValues, trigger }, extraArgs) => {
    const { otherField } = getValues();

    if (otherField === 'anyValue') {
      trigger('someOtherField');
    } else {
      setValue('fieldName', value);
    }
  },
);

// Or you can create a form action like this
export const someFieldAction =
  (value: string): FormAction<SomeFormState> =>
  ({ setValue, getValues, trigger }, extraArgs) => {
    // Business logic and form interactions
  };
```

Below are the core components and hooks included in the package.

## Core Components, Hooks and utilities

### `useFormDispatch` Hook

The `useFormDispatch` hook provides access to the formDispatch function within components wrapped by `Form` or `FormProviderWithDispatch`. This function allows you to perform custom form actions, modify form state, and interact with form methods dynamically.

**Key Use Case**: Trigger form actions both within and across multiple form actions, allowing for nested or sequential actions based on complex conditions.

```ts
const formDispatch = useFormDispatch<FormValues, ExtraArgs>();
```

- **Type Generics**:

  - `FormValues` - The type for the form’s field values, typically inferred from the form schema.
  - `ExtraArgs` - Optional type for additional arguments provided to `formDispatch`, useful for passing custom data or parameters.

- **Return Value:**

  - `formDispatch` - A dispatch function that allows dynamic form actions. This function accepts an action function, which has access to form methods, `extraArgs`, and other actions.

- **Usage Example:**

  **SomeComponent.tsx**

  ```tsx
  import { mainFormAction } from './actions';

  const SomeComponent = () => {
    const formDispatch = useFormDispatch<FormValues, ExtraArgs>();
    const handleMainAction = (someStr: string) => {
      formDispatch(mainFormAction(someStr));
    };

    return <button onClick={() => handleMainAction('someStr')}>Execute Main Action</button>;
  };
  ```

  **actions.ts**

  ```tsx
  const nestedFormAction =
    (): FormAction<FormValues> =>
    ({ setValue, getValues, trigger }, extraArgs) => {
      setValue('field2', 'Nested Action Name');
      trigger('field3');
    };

  export const mainFormAction =
    (value: string): FormAction<FormValues> =>
    ({ setValue, formDispatch }, extraArgs) => {
      if (value === 'someStr') {
        setValue('field1', true);
      } else {
        // // Call the nested action within the main action
        formDispatch(nestedFormAction());
      }
    };
  ```

- **Nested Action Calling**:
  - You can call one action from within another by passing the second action directly to `formDispatch`. This approach is especially useful when creating complex workflows where multiple form operations need to occur in sequence or depend on one another.
  - This nested action feature can facilitate modular design, enabling the reuse of smaller, specialized actions within larger, composite actions.

### `useFormWithDispatch` Hook

This custom hook wraps `react-hook-form`'s `useForm` to add additional dispatch capabilities.

```tsx
const { register, handleSubmit, formDispatch } = useFormWithDispatch<FormValues, ExtraArgs>(
  {
    mode: 'all',
    defaultValues: { field1: '' },
  },
  {
    /* some data that you want to use in form actions */
  },
);
```

- **Type Generics**:

  - `FormValues` - The type for the form’s field values, typically inferred from the form schema.
  - `ExtraArgs` - Optional type for additional arguments provided to `formDispatch`, useful for passing custom data or parameters.
  - `TContext` - Optional context data type for any extra state required by `useForm`.
  - `TTransformedValues` - If specified, this type is used for any transformed values returned by `useForm` when submitting data.

- **Parameters**:

  1. `All props` that apply to `useForm` hook, such as `defaultValues`, `mode`, `reValidateMode`, etc. This allows for granular control over the form's behavior and validation strategy.

  2. `extraArgs`: `ExtraArgs` (optional). Custom arguments provided to enrich the form dispatch context (`formDispatch`). These arguments allow contextual parameters or settings to be accessed within custom form actions.

### `Form` Component

The `Form` component is a wrapper around `react-hook-form` that integrates with `formDispatch` for additional control.

```tsx
<Form<FormValues, ExtraArgs>
  onSubmit={onSubmitHandler}
  onSubmitFailed={onErrorHandler}
  extraArgs={extraArgs}
  formElementProps={formElementProps}
>
  {/* Form Fields */}
</Form>
```

- **Type Generics**:

  - `FormValues` - The type for the form’s field values, typically inferred from the form schema.
  - `ExtraArgs` - Optional type for additional arguments provided to `formDispatch`, useful for passing custom data or parameters.
  - `TContext` - Optional context data type for any extra state required by `useForm`.
  - `TTransformedValues` - If specified, this type is used for any transformed values returned by `useForm` when submitting data.

- **Props**:

  - `All props` that apply to `useForm` hook, such as `defaultValues`, `mode`, `reValidateMode`, etc. This allows for granular control over the form's behavior and validation strategy.
  - `onSubmit`: `(formData: FormValues, event?: React.BaseSyntheticEvent) => void` (optional)
    - Callback triggered when the form is successfully submitted. Receives the current form values and the event that triggered the submission. It is only called if all fields pass validation.
  - `onSubmitFailed`: `SubmitErrorHandler<FormValues>` (optional)
    - Callback triggered if form validation fails, passing the errors in each invalid form field. Useful for custom error handling logic.
  - `extraArgs`: `ExtraArgs` (optional)
    - Custom arguments or configuration that can be used within `formDispatch` actions. These are typically used to provide context-specific data or parameters required for certain form-related operations.
  - `formElementProps`: `Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>` (optional)
    - HTML attributes for the `<form>` element, excluding the `onSubmit` handler which is managed internally by the `Form` component. Commonly used for styling or adding specific behavior directly to the form, like CSS classes or inline styles.

### `FormProviderWithDispatch` Component

The `FormProviderWithDispatch` component allows nested components to access `formDispatch` for modular action handling.

```tsx
const methods = useFormWithDispatch<FormValues, ExtraArgs>();

<FormProviderWithDispatch {...methods}>{/* Child components can use formDispatch */}</FormProviderWithDispatch>;
```

- **Type Generics**:

  - `FormValues` - The type for the form’s field values, typically inferred from the form schema.
  - `ExtraArgs` - Optional type for additional arguments provided to `formDispatch`, useful for passing custom data or parameters.
  - `TContext` - Optional context data type for any extra state required by `useForm`.
  - `TTransformedValues` - If specified, this type is used for any transformed values returned by `useForm` when submitting data.

### `createFormAction` Utility

`createFormAction` is a utility function that helps you define reusable form actions with bound `formDispatch`. This allows for simplified form action creation and dispatch handling.

```ts
const [useMyFormAction, myFormAction] = createFormAction<Props, FormState, ReturnType, ExtraArgsForm>(
  (props, actionProps, extraArgs) => {
    // Define action logic here
    return someReturnValue;
  },
);
```

- **Type Generics**:

  - `Props` - Type for any properties required by the action itself, typically relevant to the action’s specific requirements.
  - `FormState` - The type for the form field values.
  - `ReturnType` - The expected return type from the action, defaults to void.
  - `ExtraArgsForm` - Type for additional arguments passed to the action, defaulting to an empty object (Record<string, unknown>).

- **Parameters**:

  - `action` - A callback function containing the logic of the action to be performed. This function receives:
    - `props` - The specific properties for the action.
    - `actionProps` - An object of form methods and properties like - `setValue`, `trigger`, etc.
    - `extraArgs` - Any additional arguments passed for custom action requirements.

- **Return Value**:

  - A tuple:
    - `useActionHook` - A custom hook to dispatch the action bound to `formDispatch`.
    - `actionCreator` - The action itself, allowing for manual invocation if needed.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request to discuss improvements or bug fixes.

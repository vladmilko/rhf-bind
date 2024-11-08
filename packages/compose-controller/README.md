# @rhf-bind/compose-controller

A utility library that provides utility hook `useComposeController` and Higher-Order Component `withComposeController` to integrate controlled form elements with enhanced behavior into `react-hook-form`.

The main components are designed to streamline form control, custom validation, and change handling, making it easy to manage form state and field logic.

## Installation

Install the package via npm or yarn:

```bash
npm install @rhf-bind/compose-controller
# or
yarn add @rhf-bind/compose-controller
```

## API Documentation

### `useComposeController` Hook

The `useComposeController` hook extends `react-hook-form`'s `useController` by adding support for custom `onChange` logic and pre-change validation, allowing for more control over form field updates.

```ts
const { field, fieldState } = useComposeController({
  name: 'email',
  control,
  rules: { required: 'Email is required' },
  onChange: value => {
    /* Some handle logic */
  },
  shouldChangeValue: (newValue, prevValue) => newValue !== prevValue,
  fieldRef: someRef,
});
```

#### Type Generics

- `FormValues` - Type of form values (extends `FieldValues` from `react-hook-form`).
- `TName` - Type for the field name within the form values (extends `FieldPath<FormValues>`).
- `FieldValue` - Type of the field's value (defaults to `FieldPathValue<FormValues, TName>`).

#### Parameters

- `name`: The field name (string) in the form values.
  control (optional): The form control object from `react-hook-form`.
- `rules` (optional): Validation rules for the field.
- `onChange` (optional): Optional handler invoked with the new value whenever it changes.
- `shouldChangeValue` (optional): Callback to conditionally accept or reject the new value.
- `fieldRef` (optional): Optional external reference to the field element.

### `withComposeController` Higher-Order Component

The `withComposeController` HOC wraps a component, injecting controlled form behavior via `useComposeController`. This allows any component to use `react-hook-form`'s controlled field handling directly.

```tsx
const InputWithController = withComposeController(InputComponent);

<InputWithController
  fieldName="username"
  control={control}
  rules={{ required: 'Username is required' }}
  defaultValue="someName"
  onChange={value => {
    /* Some handle logic */
  }}
/>;
```

#### Type Generics

- `FormValues` - Type of form values (extends `FieldValues` from `react-hook-form`).
- `TName` - Type for the field name within the form values (extends `FieldPath<FormValues>`).
- `FieldValue` - Type of the field's value (defaults to `FieldPathValue<FormValues, TName>`).

#### Parameters

- `Component`: The component to be wrapped and controlled.
- `defaultRules`: Optional default validation rules.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request to discuss improvements or bug fixes.

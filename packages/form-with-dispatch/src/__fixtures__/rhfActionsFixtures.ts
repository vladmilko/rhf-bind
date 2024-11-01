import { FieldValues, UseFormReturn } from 'react-hook-form';

export interface TestFormValues extends FieldValues {
  testField: string;
}

type RhfFormActions<FormValues extends FieldValues> = Pick<
  UseFormReturn<FormValues>,
  'getValues' | 'reset' | 'setError' | 'setValue' | 'trigger' | 'clearErrors' | 'getFieldState' | 'resetField'
>;

export const createRHFActionsFixture = <FormValues extends FieldValues = FieldValues>(
  overrides?: RhfFormActions<FormValues>,
): RhfFormActions<FormValues> => ({
  clearErrors: jest.fn(),
  getFieldState: jest.fn(),
  getValues: jest.fn(),
  reset: jest.fn(),
  resetField: jest.fn(),
  setError: jest.fn(),
  setValue: jest.fn(),
  trigger: jest.fn(),
  ...overrides,
});

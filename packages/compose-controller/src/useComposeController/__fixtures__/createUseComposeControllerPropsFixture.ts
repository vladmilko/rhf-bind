import { UseComposeControllerProps } from '../types';

export type MockFormState = { testField: string };
export type UseComposeControllerPropsFixture = UseComposeControllerProps<MockFormState, 'testField'>;

export const createUseComposeControllerPropsFixture = (
  overrides?: Partial<UseComposeControllerPropsFixture>,
): UseComposeControllerPropsFixture => ({
  name: 'testField',
  defaultValue: '',
  onChange: jest.fn(),
  rules: { required: '' },
  disabled: false,
  shouldUnregister: false,
  ...overrides,
});

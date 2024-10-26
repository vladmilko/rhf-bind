import { render } from '@testing-library/react';
import type { Control, ControllerFieldState } from 'react-hook-form';

import { useComposeController } from '$useComposeController';

import { WithComposeControllerComponentProps } from '../types';
import { withComposeController } from '../withComposeController';

jest.mock('../../useComposeController');

interface TestFormState {
  testField: string;
}
type MockComponentProps = { testProp: string };
type WrappedMockComponentProps = WithComposeControllerComponentProps<TestFormState, 'testField'> & MockComponentProps;

describe('withComposeController HOC', () => {
  const MockComponent = jest.fn();
  const WrappedMockComponent = withComposeController<MockComponentProps, TestFormState, 'testField'>(MockComponent);

  type TypedUseComposeController = typeof useComposeController<TestFormState, 'testField'>;
  const mockUseComposeController = useComposeController as jest.MockedFn<TypedUseComposeController>;

  const mockUseComposeControllerReturnValue: ReturnType<TypedUseComposeController> = {
    field: { value: 'testValue', onBlur: jest.fn(), onChange: jest.fn(), ref: jest.fn() },
    fieldState: {} as ControllerFieldState,
  };

  const MOCK_PROPS: WrappedMockComponentProps = {
    fieldName: 'testField',
    testProp: 'someValue',
    shouldChangeValue: jest.fn(),
    defaultValue: '',
    onChange: jest.fn(),
    disabledController: false,
    rules: {},
    shouldUnregister: false,
    control: {} as Control<TestFormState>,
    fieldRef: jest.fn(),
  };

  test('calls MockComponent with the returned values from mockUseComposeController', () => {
    mockUseComposeController.mockReturnValue(mockUseComposeControllerReturnValue);

    render(<WrappedMockComponent {...MOCK_PROPS} />);

    expect(mockUseComposeController).toHaveBeenCalledTimes(1);
    expect(mockUseComposeController).toHaveBeenCalledWith({
      name: MOCK_PROPS.fieldName,
      shouldChangeValue: MOCK_PROPS.shouldChangeValue,
      onChange: MOCK_PROPS.onChange,
      defaultValue: MOCK_PROPS.defaultValue,
      rules: MOCK_PROPS.rules,
      disabled: MOCK_PROPS.disabledController,
      control: MOCK_PROPS.control,
      shouldUnregister: MOCK_PROPS.shouldUnregister,
      fieldRef: MOCK_PROPS.fieldRef,
    });

    expect(MockComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockUseComposeControllerReturnValue,
        testProp: MOCK_PROPS.testProp,
      }),
      {},
    );
  });
});

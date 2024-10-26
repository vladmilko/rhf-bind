import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import * as RHF from 'react-hook-form';

import {
  createUseComposeControllerPropsFixture,
  MockFormState,
  UseComposeControllerPropsFixture,
} from '../__fixtures__';
import { useComposeController } from '../useComposeController';

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  __esModule: true,
}));

describe('useComposeController', () => {
  const renderUseComposeController = (props: UseComposeControllerPropsFixture) =>
    renderHook(() => useComposeController(props), {
      wrapper: function Wrapper({ children }: { children: ReactNode }) {
        const methods = RHF.useForm();
        return <RHF.FormProvider {...methods}>{children}</RHF.FormProvider>;
      },
    });

  const baseProps = createUseComposeControllerPropsFixture();

  describe('useController calls', () => {
    const mockUseController = jest.spyOn(RHF, 'useController');

    const baseExpectedProps: RHF.UseControllerProps<MockFormState, 'testField'> = {
      name: baseProps.name,
      defaultValue: baseProps.defaultValue,
      rules: baseProps.rules,
      disabled: baseProps.disabled,
      shouldUnregister: baseProps.shouldUnregister,
    };

    test('should call useController with exact baseExpectedProps', () => {
      renderUseComposeController(baseProps);

      expect(mockUseController).toHaveBeenCalledWith(baseExpectedProps);
    });

    test('should call useController with control from props', () => {
      const { result } = renderHook(RHF.useForm<MockFormState>);
      const controlledProps = { ...baseExpectedProps, control: result.current.control };

      renderHook(() => useComposeController(controlledProps));

      expect(mockUseController).toHaveBeenCalledWith(controlledProps);
    });
  });

  describe('field state and onChange behavior', () => {
    test('should call props onChange with specified value', async () => {
      const testValue = '123';
      const { result } = renderUseComposeController(baseProps);

      result.current.field.onChange(testValue);

      expect(baseProps.onChange).toHaveBeenCalledWith(testValue);
      expect(baseProps.onChange).toHaveBeenCalledTimes(1);
    });

    test('should initialize field value with defaultValue', () => {
      const defaultValue = 'defaultValue';
      const { result } = renderUseComposeController({ ...baseProps, defaultValue });

      expect(result.current.field.value).toBe(defaultValue);
    });
  });

  describe('shouldChangeValue conditional logic', () => {
    test('should only call onChange when shouldChangeValue returns true', async () => {
      const mockShouldChangeValue = jest.fn(newValue => newValue === 't');
      const { result } = renderUseComposeController({ ...baseProps, shouldChangeValue: mockShouldChangeValue });

      result.current.field.onChange('3');
      await waitFor(() => {
        expect(mockShouldChangeValue).toHaveBeenCalledWith('3', '');
        expect(baseProps.onChange).not.toHaveBeenCalled();
      });

      result.current.field.onChange('t');

      await waitFor(() => {
        expect(mockShouldChangeValue).toHaveBeenCalledWith('t', '');
        expect(baseProps.onChange).toHaveBeenCalledWith('t');
      });
    });

    test('should not call onChange if shouldChangeValue disallows due to prevValue', async () => {
      const mockShouldChangeValue = jest.fn((_, prevValue) => prevValue !== 'test1');
      const { result } = renderUseComposeController({
        ...baseProps,
        shouldChangeValue: mockShouldChangeValue,
        defaultValue: 'test1',
      });

      result.current.field.onChange('111');

      await waitFor(() => {
        expect(mockShouldChangeValue).toHaveBeenCalledWith('111', 'test1');
        expect(baseProps.onChange).not.toHaveBeenCalled();
      });

      result.current.field.onChange('anotherValue');
      await waitFor(() => {
        expect(mockShouldChangeValue).toHaveBeenCalledWith('anotherValue', 'test1');
        expect(baseProps.onChange).not.toHaveBeenCalled();
      });
    });

    test('should call onChange when shouldChangeValue is not provided', async () => {
      const { result } = renderUseComposeController(baseProps);

      result.current.field.onChange('newValue');
      await waitFor(() => expect(baseProps.onChange).toHaveBeenCalledWith('newValue'));
    });
  });
});

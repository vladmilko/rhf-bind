import { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import { FieldValues, useFormContext } from 'react-hook-form';

import type { FormDispatch } from '$useFormDispatch';
import { FormDispatchContext } from '$useFormDispatch/useFormDispatch';

import { FormProviderWithDispatch, FormProviderWithDispatchProps } from '../FormProviderWithDispatch';

const mockFormDispatch: FormDispatch<FieldValues, Record<string, unknown>> = jest.fn();
const mockProps = {
  formDispatch: mockFormDispatch,
  children: <div data-testid="child-component">Child Component</div>,
} as FormProviderWithDispatchProps;

describe('FormProviderWithDispatch', () => {
  it('renders children inside FormProvider', () => {
    render(<FormProviderWithDispatch {...mockProps} />);

    const child = screen.getByTestId('child-component');
    expect(child).toBeInTheDocument();
  });

  it('provides formDispatch through FormDispatchContext', () => {
    const TestComponent = () => {
      const formDispatch = useContext(FormDispatchContext);
      expect(formDispatch).toBe(mockFormDispatch);

      return null;
    };

    render(
      <FormProviderWithDispatch {...mockProps}>
        <TestComponent />
      </FormProviderWithDispatch>,
    );
  });

  it('passes props correctly to FormProvider', () => {
    const formMethods = { handleSubmit: jest.fn() }; // mock form methods
    const propsWithFormMethods = { ...mockProps, ...formMethods };

    const TestComponent = () => {
      const methods = useFormContext();
      expect(methods).toMatchObject(formMethods);

      return null;
    };

    render(
      <FormProviderWithDispatch {...propsWithFormMethods}>
        <TestComponent />
      </FormProviderWithDispatch>,
    );
  });
});

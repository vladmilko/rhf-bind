import { fireEvent, render, screen } from '@testing-library/react';
import type { FieldValues } from 'react-hook-form';

import { createRHFActionsFixture } from '$__fixtures__';
import * as useFormEsm from '$useFormWithDispatch';

import { Form } from '../Form';
import { FormProviderWithDispatch } from '../FormProviderWithDispatch';
import type { FormProps } from '../types';

jest.mock('$useFormWithDispatch', () => ({
  useFormWithDispatch: jest.fn(),
}));

jest.mock('../FormProviderWithDispatch', () => ({
  FormProviderWithDispatch: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('Form', () => {
  const mockHandleSubmit = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnSubmitFailed = jest.fn();

  const mockUseFormReturnActions = createRHFActionsFixture();

  const mockUseFormReturn = {
    handleSubmit: (onSubmit: jest.Mock, onError: jest.Mock) => mockHandleSubmit(onSubmit, onError),
    ...mockUseFormReturnActions,
  };

  const spyUseForm = jest
    .spyOn(useFormEsm, 'useFormWithDispatch')
    .mockReturnValue(mockUseFormReturn as ReturnType<typeof useFormEsm.useFormWithDispatch>);

  it('renders children and calls useForm and form with provided props', () => {
    const extraArgs = { extraParam: 'test' };
    const formProps: FormProps<FieldValues, typeof extraArgs> = {
      mode: 'all',
      criteriaMode: 'firstError',
      defaultValues: {},
      context: {},
      delayError: 1000,
      disabled: false,
      errors: {},
      values: {},
      reValidateMode: 'onBlur',
      resetOptions: {},
    };
    const formElementProps = {
      id: 'custom-form-id',
      'data-testid': '12',
      style: { width: '10px' },
    };

    render(
      <Form {...formProps} extraArgs={extraArgs} formElementProps={formElementProps}>
        <div data-testid="child">Child Component</div>
      </Form>,
    );

    expect(spyUseForm).toHaveBeenCalledWith(formProps, extraArgs);

    expect(screen.getByTestId('child')).toBeInTheDocument();

    expect(screen.getByTestId(formElementProps['data-testid'])).toHaveAttribute('id', formElementProps.id);
    expect(screen.getByTestId(formElementProps['data-testid'])).toHaveStyle(formElementProps.style);
  });

  it('wraps children with FormProviderWithDispatch and passes form methods', () => {
    render(
      <Form onSubmit={mockOnSubmit}>
        <div data-testid="child">Child Component</div>
      </Form>,
    );

    expect(FormProviderWithDispatch).toHaveBeenCalledWith(
      expect.objectContaining(mockUseFormReturn),
      expect.any(Object),
    );
  });

  it('prevents form submission on Enter key press outside of textarea', () => {
    render(
      <Form>
        <input type="text" data-testid="textInput" />
        <textarea data-testid="textarea" />
      </Form>,
    );

    fireEvent.keyDown(screen.getByTestId('textInput'), { key: 'Enter' });
    expect(mockHandleSubmit).not.toHaveBeenCalled();

    fireEvent.keyDown(screen.getByTestId('textarea'), { key: 'Enter' });
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });

  it('calls handleSubmit with onSubmit and onSubmitFailed when form is submitted', () => {
    render(
      <Form onSubmit={mockOnSubmit} onSubmitFailed={mockOnSubmitFailed}>
        <button type="submit">Submit</button>
      </Form>,
    );

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));
    expect(mockHandleSubmit).toHaveBeenCalledWith(mockOnSubmit, mockOnSubmitFailed);
  });

  it('does not call onSubmit if it is not provided', () => {
    render(
      <Form>
        <button type="submit">Submit</button>
      </Form>,
    );

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });
});

import { renderHook } from '@testing-library/react';
import type { FieldValues, UseFormProps } from 'react-hook-form';
import * as RHF from 'react-hook-form';

import { createRHFActionsFixture } from '$__fixtures__';

import * as helpersEsm from '../helpers';
import { useFormWithDispatch } from '../useFormWithDispatch';

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}));

jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  __esModule: true,
}));

describe('useForm', () => {
  const mockUseFormReturnActions = createRHFActionsFixture();

  const spyRhfUseForm = jest.spyOn(RHF, 'useForm').mockReturnValue(mockUseFormReturnActions as RHF.UseFormReturn);
  const spyCreateFormDispatch = jest.spyOn(helpersEsm, 'createFormDispatch');

  it('returns form methods from useForm and creates formDispatch with appropriate dependencies', () => {
    const dummyProps: UseFormProps<FieldValues> = {};
    const extraArgs = { arg1: 'value1', arg2: 'value2' };

    const { result } = renderHook(() => useFormWithDispatch(dummyProps, extraArgs));

    expect(spyRhfUseForm).toHaveBeenCalledWith(dummyProps);

    expect(spyCreateFormDispatch).toHaveBeenCalledWith(mockUseFormReturnActions, extraArgs);

    expect(result.current).toEqual({
      ...mockUseFormReturnActions,
      formDispatch: expect.any(Function),
    });
  });

  it('creates formDispatch only when dependencies change', () => {
    const { result, rerender } = renderHook(() => useFormWithDispatch({}));
    const initialFormDispatch = result.current.formDispatch;

    rerender();
    expect(result.current.formDispatch).toBe(initialFormDispatch);

    mockUseFormReturnActions.setValue = jest.fn();
    rerender();
    expect(result.current.formDispatch).not.toBe(initialFormDispatch);
  });

  it('provides formDispatch function that interacts with createFormDispatch', () => {
    const sampleAction = jest.fn();
    const { result } = renderHook(() => useFormWithDispatch({}));

    result.current.formDispatch(sampleAction);
    expect(spyCreateFormDispatch).toHaveBeenCalled();
    expect(sampleAction).toHaveBeenCalled();
  });
});

import { act, renderHook } from '@testing-library/react';

import { createRHFActionsFixture, TestFormValues } from '$__fixtures__';
import type { FormActionProps } from '$useFormDispatch';
import { useFormDispatch } from '$useFormDispatch';

import { createFormAction } from '../createFormAction';

jest.mock('$useFormDispatch');

type ExtraArgsForm = {
  flag: boolean;
};

describe('createFormAction', () => {
  const mockFormActionProps = createRHFActionsFixture<TestFormValues>();

  const mockFormDispatch = jest.fn();
  (useFormDispatch as jest.Mock).mockReturnValue(mockFormDispatch);

  test('should create an action and dispatch it with the correct arguments', () => {
    // Define a test action
    const testAction = jest.fn(
      (
        props: { newValue: string },
        { setValue }: FormActionProps<TestFormValues, ExtraArgsForm>,
        extraArgs: ExtraArgsForm,
      ) => {
        setValue('field1', props.newValue);
        return extraArgs.flag;
      },
    );

    const [_, testActionCreator] = createFormAction(testAction);

    const extraArgs = { flag: true };
    testActionCreator({ newValue: 'newVal' })(
      mockFormActionProps as FormActionProps<TestFormValues, ExtraArgsForm>,
      extraArgs,
    );

    expect(testAction).toHaveBeenCalledWith({ newValue: 'newVal' }, mockFormActionProps, extraArgs);
    expect(mockFormActionProps.setValue).toHaveBeenCalledWith('field1', 'newVal');
  });

  test('should return a hook that calls formDispatch with the created action', () => {
    const testAction = jest.fn();
    const [useTestAction] = createFormAction(testAction);

    // Render hook and call with props
    const { result } = renderHook(() => useTestAction());
    act(() => result.current({ newValue: 'testValue' }));

    expect(mockFormDispatch).toHaveBeenCalledWith(expect.any(Function));

    // Ensure dispatched action correctly applies the `actionCreator`
    const actionCreatorCall = mockFormDispatch.mock.calls[0][0];
    const mockActionProps = {} as FormActionProps<TestFormValues, ExtraArgsForm>;
    const mockExtraArgs = { flag: false };

    actionCreatorCall(mockActionProps, mockExtraArgs);
    expect(testAction).toHaveBeenCalledWith({ newValue: 'testValue' }, mockActionProps, mockExtraArgs);
  });

  test('should preserve function identity between renders', () => {
    const [useTestAction] = createFormAction(jest.fn());
    const { result, rerender } = renderHook(() => useTestAction());

    const firstCall = result.current;
    rerender();
    const secondCall = result.current;

    expect(firstCall).toBe(secondCall); // Checks that the function is memoized with useCallback
  });

  test('should return the correct type from the action when invoked', () => {
    const testAction = jest.fn(
      (props, mockFormActionProps: FormActionProps<TestFormValues, ExtraArgsForm>, extraArgs: ExtraArgsForm) => {
        return extraArgs.flag ? 'success' : 'failure';
      },
    );

    const [_, testActionCreator] = createFormAction(testAction);

    const extraArgs = { flag: true };
    const returnValue = testActionCreator({})(
      mockFormActionProps as FormActionProps<TestFormValues, ExtraArgsForm>,
      extraArgs,
    );

    expect(returnValue).toBe('success');
  });
});

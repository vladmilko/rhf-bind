import { createRHFActionsFixture, TestFormValues } from '$__fixtures__';
import type { FormAction } from '$useFormDispatch';

import { createFormDispatch } from '../createFormDispatch';

describe('createFormDispatch', () => {
  const mockFormActionProps = createRHFActionsFixture<TestFormValues>();
  const extraArgs = { someArg: 'example' };
  const formDispatch = createFormDispatch(mockFormActionProps, extraArgs);

  test('should call action with provided props and extraArgs', () => {
    const mockAction: FormAction<TestFormValues> = jest.fn();

    formDispatch(mockAction);

    expect(mockAction).toHaveBeenCalledWith({ ...mockFormActionProps, formDispatch: expect.any(Function) }, extraArgs);
  });

  test('should support nested actions by passing formDispatch recursively', () => {
    const nestedAction: FormAction<TestFormValues> = ({ formDispatch }) => {
      formDispatch(innerAction);
    };

    const innerAction: FormAction<TestFormValues> = jest.fn();

    formDispatch(nestedAction);

    expect(innerAction).toHaveBeenCalledWith({ ...mockFormActionProps, formDispatch: expect.any(Function) }, extraArgs);
  });

  test('should allow action to access form methods like setValue', () => {
    const testValue = 'new value';
    const mockAction: FormAction<TestFormValues> = ({ setValue }) => {
      setValue('testField', testValue);
    };

    formDispatch(mockAction);

    expect(mockFormActionProps.setValue).toHaveBeenCalledWith('testField', testValue);
  });

  test('should allow action to access extraArgs', () => {
    const mockAction: FormAction<TestFormValues> = (props, args) => {
      expect(args).toEqual(extraArgs);
    };

    formDispatch(mockAction);
  });

  test('should correctly handle async actions', async () => {
    const asyncAction: FormAction<TestFormValues, Promise<string>> = async () => {
      return 'async result';
    };

    const result = await formDispatch(asyncAction);

    expect(result).toBe('async result');
  });
});

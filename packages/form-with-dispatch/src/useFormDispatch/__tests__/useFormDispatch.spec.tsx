import { renderHook } from '@testing-library/react';

import { createRHFActionsFixture } from '$__fixtures__';
import * as dispatchHelpers from '$useFormWithDispatch/helpers/createFormDispatch';

import { FormAction, FormDispatch } from '../types';
import { FormDispatchContext, useFormDispatch } from '../useFormDispatch';

interface TestFormState {
  testField1: string;
  testField2: number;
}

describe('useFormDispatch', () => {
  const mockRHFActions = createRHFActionsFixture<TestFormState>();
  let formDispatch: FormDispatch<TestFormState>;

  beforeEach(() => {
    const { result } = renderHook(() => useFormDispatch<TestFormState>(), {
      wrapper: ({ children }) => (
        <FormDispatchContext.Provider
          value={dispatchHelpers.createFormDispatch<TestFormState>(mockRHFActions, {}) as unknown as FormDispatch}
        >
          {children}
        </FormDispatchContext.Provider>
      ),
    });
    formDispatch = result.current;
  });

  describe('React Hook Form (RHF) Action Tests', () => {
    test('should set field value using setValue action', () => {
      const testField1NewValue = '123';
      const testAction =
        (value: string): FormAction<TestFormState> =>
        ({ setValue }) =>
          setValue('testField1', value);

      formDispatch(testAction(testField1NewValue));

      expect(mockRHFActions.setValue).toHaveBeenCalledWith('testField1', testField1NewValue);
    });

    test('should retrieve field value using getValues action', () => {
      const testAction =
        (): FormAction<TestFormState> =>
        ({ getValues }) =>
          getValues('testField1');

      formDispatch(testAction());

      expect(mockRHFActions.getValues).toHaveBeenCalledWith('testField1');
    });

    test('should get field state using getFieldState action', () => {
      const testAction =
        (): FormAction<TestFormState> =>
        ({ getFieldState }) =>
          getFieldState('testField2');

      formDispatch(testAction());

      expect(mockRHFActions.getFieldState).toHaveBeenCalledWith('testField2');
    });

    test('should set field error using setError action', () => {
      const testField2Error = 'test error';
      const testAction =
        (): FormAction<TestFormState> =>
        ({ setError }) =>
          setError('testField2', { types: { required: testField2Error } });

      formDispatch(testAction());

      expect(mockRHFActions.setError).toHaveBeenCalledWith('testField2', {
        types: { required: testField2Error },
      });
    });

    test('should clear field errors using clearErrors action', () => {
      const testAction =
        (): FormAction<TestFormState> =>
        ({ clearErrors }) =>
          clearErrors('testField2');

      formDispatch(testAction());

      expect(mockRHFActions.clearErrors).toHaveBeenCalledWith('testField2');
    });

    test('should reset form using reset action', () => {
      const testAction =
        (): FormAction<TestFormState> =>
        ({ reset }) =>
          reset();

      formDispatch(testAction());

      expect(mockRHFActions.reset).toHaveBeenCalled();
    });

    test('should reset specific field using resetField action', () => {
      const testAction =
        (): FormAction<TestFormState> =>
        ({ resetField }) =>
          resetField('testField1');

      formDispatch(testAction());

      expect(mockRHFActions.resetField).toHaveBeenCalledWith('testField1');
    });

    test('should trigger validation using trigger action', () => {
      const testAction =
        (): FormAction<TestFormState> =>
        ({ trigger }) =>
          trigger('testField1', { shouldFocus: true });

      formDispatch(testAction());

      expect(mockRHFActions.trigger).toHaveBeenCalledWith('testField1', { shouldFocus: true });
    });
  });

  describe('Action Return Value Tests', () => {
    const testReturnValue = 'testReturnValue';

    test('should return value from synchronous action', () => {
      const testSyncAction =
        (): FormAction<TestFormState, string> =>
        ({ getValues }) => {
          getValues('testField1');
          return testReturnValue;
        };

      const returnedValue = formDispatch(testSyncAction());

      expect(mockRHFActions.getValues).toHaveBeenCalledWith('testField1');
      expect(returnedValue).toBe(testReturnValue);
    });

    test('should return value from asynchronous action', async () => {
      const testAsyncAction =
        (): FormAction<TestFormState, Promise<string>> =>
        async ({ getFieldState }) => {
          getFieldState('testField2');
          return Promise.resolve(testReturnValue);
        };

      const returnedValue = await formDispatch(testAsyncAction());

      expect(mockRHFActions.getFieldState).toHaveBeenCalledWith('testField2');
      expect(returnedValue).toBe(testReturnValue);
    });
  });

  test('should dispatch nested action', () => {
    const testActionOne =
      (): FormAction<TestFormState> =>
      ({ setValue }) =>
        setValue('testField1', '123');

    const testActionTwo =
      (): FormAction<TestFormState> =>
      ({ formDispatch: innerDispatch }) =>
        innerDispatch(testActionOne());

    formDispatch(testActionTwo());

    expect(mockRHFActions.setValue).toHaveBeenCalledWith('testField1', '123');
  });
});

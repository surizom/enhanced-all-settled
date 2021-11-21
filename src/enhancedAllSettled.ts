import {
  isFulfilledPromise,
  isRejectedPromise,
  PromiseSettledResult,
  rejectedReason,
  settlePromise,
} from './settlePromise';
import { compact } from './utils';

export type EnhancedPromiseFulfilledResult<inputType> = inputType;

export type EnhancedPromiseRejectedResult<inputType> = {
  inputValue: inputType;
  reason: any;
};

type EnhancedAllSettledResult<inputType, outputType> = {
  rejected: EnhancedPromiseRejectedResult<inputType>[];
  results: outputType[];
  successful: inputType[];
};

const segregateInputObjectsByStatus =
  <inputType, outputType>(inputObjects: inputType[]) =>
  (promiseResults: PromiseSettledResult<outputType>[]) => {
    const rejected = compact(
      inputObjects.map((object, index) => {
        const result = promiseResults[index];
        return isRejectedPromise(result)
          ? {
              inputValue: object,
              reason: rejectedReason(result),
            }
          : undefined;
      })
    );

    const successful = inputObjects.filter(
      (_, index) => promiseResults[index].status === 'fulfilled'
    );

    return {
      rejected,
      successful,
    };
  };

export type EnhancedAllSettledOptions = {
  logStack?: boolean;
};

export const enhancedAllSettled =
  <inputType, outputType>(
    promiseToApply: (object: inputType) => Promise<outputType>,
    options?: EnhancedAllSettledOptions
  ) =>
  async (
    inputObjects: inputType[]
  ): Promise<EnhancedAllSettledResult<inputType, outputType>> => {
    const promiseSettledResults = await Promise.all(
      inputObjects.map(settlePromise(promiseToApply, options?.logStack))
    );

    const promiseFulfilledResults = promiseSettledResults
      .filter(isFulfilledPromise)
      .map(promiseResults => promiseResults.value);

    return {
      results: promiseFulfilledResults,
      ...segregateInputObjectsByStatus(inputObjects)(promiseSettledResults),
    };
  };

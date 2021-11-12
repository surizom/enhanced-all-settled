import {
  isFulfilledPromise,
  PromiseSettledResult,
  rejectedReason,
  settlePromise,
} from './settlePromise';

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
  <inputType, outputType>(objectsToSync: inputType[]) =>
  (promiseResults: PromiseSettledResult<outputType>[]) => {
    const rejected = objectsToSync
      .filter((_, index) => promiseResults[index].status === 'rejected')
      .map((object, index) => ({
        inputValue: object,
        reason: rejectedReason(promiseResults[index]),
      }));

    const successful = objectsToSync.filter(
      (_, index) => promiseResults[index].status === 'fulfilled'
    );

    return {
      rejected,
      successful,
    };
  };

export const enhancedAllSettled =
  <inputType, outputType>(
    promiseToApply: (object: inputType) => Promise<outputType>
  ) =>
  async (
    inputObjects: inputType[]
  ): Promise<EnhancedAllSettledResult<inputType, outputType>> => {
    const promiseSettledResults = await Promise.all(
      inputObjects.map(settlePromise(promiseToApply))
    );

    const promiseFulfilledResults = promiseSettledResults
      .filter(isFulfilledPromise)
      .map(promiseResults => promiseResults.value);

    return {
      results: promiseFulfilledResults,
      ...segregateInputObjectsByStatus(inputObjects)(promiseSettledResults),
    };
  };

export type PromiseFulfilledResult<outputType> = {
  status: 'fulfilled';
  value: outputType;
};

export type PromiseRejectedResult = {
  reason: string;
  status: 'rejected';
};

const errorToString = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export type PromiseSettledResult<outputType> =
  | PromiseFulfilledResult<outputType>
  | PromiseRejectedResult;

export const isFulfilledPromise = <outputType>(
  promise: PromiseSettledResult<outputType>
): promise is PromiseFulfilledResult<outputType> =>
  promise.status === 'fulfilled';

export const isRejectedPromise = <outputType>(
  promise: PromiseSettledResult<outputType>
): promise is PromiseRejectedResult => promise.status === 'rejected';

export const rejectedReason = (promise: PromiseRejectedResult): string =>
  promise.reason;

export const settlePromise =
  <inputType, outputType>(promise: (obj: inputType) => Promise<outputType>) =>
  async (object: inputType): Promise<PromiseSettledResult<outputType>> => {
    try {
      const output = await promise(object);

      return {
        status: 'fulfilled',
        value: output,
      };
    } catch (error) {
      return {
        status: 'rejected',
        reason: errorToString(error),
      };
    }
  };

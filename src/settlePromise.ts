export type PromiseFulfilledResult<outputType> = {
  status: 'fulfilled';
  value: outputType;
};

export type PromiseRejectedResult = {
  reason: string;
  status: 'rejected';
};

const errorToString = (error: any, logStack?: boolean): string => {
  if (error instanceof Error) {
    const stack = logStack && error.stack ? '\n' + error.stack : '';

    return `${error.message}${stack}`;
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
  <inputType, outputType>(
    promise: (obj: inputType) => Promise<outputType>,
    logStack?: boolean
  ) =>
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
        reason: errorToString(error, logStack),
      };
    }
  };

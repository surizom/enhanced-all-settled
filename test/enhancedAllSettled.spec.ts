import { enhancedAllSettled } from '../src';

it('should test basic error / succes case', async () => {
  const waitFor = async (milliseconds?: any): Promise<string> => {
    if (!milliseconds) {
      throw new Error('no duration provided');
    }

    if (typeof milliseconds !== 'number') {
      throw 'only numbers are allowed';
    }
    await new Promise(resolve => setTimeout(() => resolve(milliseconds), 0));

    return `succesfully awaited ${milliseconds} ms`;
  };

  const inputValues = [13, 79, undefined, 'blabla'];

  const results = await enhancedAllSettled(waitFor)(inputValues);

  expect(results).toEqual({
    rejected: [
      {
        inputValue: undefined,
        reason: 'no duration provided',
      },
      {
        inputValue: 'blabla',
        reason: 'only numbers are allowed',
      },
    ],
    results: ['succesfully awaited 13 ms', 'succesfully awaited 79 ms'],
    successful: [13, 79],
  });
});

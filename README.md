# enhanced-all-settled

A better implementation of JS internal `Promise.allSettled`

# Usage

```ts
const waitFor = async (milliseconds?: any): Promise<string> => {
  if (!milliseconds) {
    throw new Error('no duration provided');
  }

  await new Promise(resolve => setTimeout(() => resolve(milliseconds), 0));

  return `succesfully awaited ${milliseconds} ms`;
};

const settledOptions = { logStack: false };

const inputValues = [13, 79, undefined, 'blabla'];

const settled = await enhancedAllSettled(waitFor, settledOptions)(inputValues);

//  settled = {
//     rejected: [
//       {
//         inputValue: undefined,
//         reason: 'no duration provided',
//       },
//       {
//         inputValue: 'blabla',
//         reason: 'only numbers are allowed',
//        },
//     ],
//     successful: [13, 79],
//     results: ['succesfully awaited 13 ms', 'succesfully awaited 79 ms'],
//   };
```

# Features

- More consistent types that you can actually import in your code (for typescript users)

- Explicit returns of inputs corresponding to rejected / successful executions

- Works even in the browser and for old Node.js versions

- Better mapping to failure reasons (in the classic node implementation, errors instantiated with the Error constructor are mapped to `reason: false`, which is not very helpful)

- Optional logging of the entire stack of errors for better debugging

# Roadmap

Add options for :

- Setting a timeout upon which promises are considered to be failing by default

- A second function to use if you're only interested in successful promises' output

- Optional providing of your own error logging function

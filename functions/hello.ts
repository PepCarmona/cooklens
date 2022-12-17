import { Handler } from '@netlify/functions';
import { getLastItem } from '../src/helpers/array';

const handler: Handler = async (event, context) => {
  const array = [1, 2, 3];
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World',
      lastItem: getLastItem(array),
    }),
  };
};

export { handler };

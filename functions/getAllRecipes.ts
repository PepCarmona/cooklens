import { Handler } from '@netlify/functions';
import { CustomError } from './helpers/errors';
import Recipe from './models/recipe.model';
import { paginate } from './helpers/pagination';
import { connectDB } from './helpers/database';
import { getFunctionUrl } from './helpers/context';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event, context) => {
  const searchType = event.queryStringParameters.searchType || 'title';
  const searchText = event.queryStringParameters.searchText || '';

  let filter = {};

  let regex = new RegExp('.*');

  try {
    regex = new RegExp(
      searchText.toString().length > 0 ? searchText.toString() : '.*',
      'i'
    );
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('Could not create regex', error)),
    };
  }

  switch (searchType) {
    case 'title':
      filter = { title: regex };
      break;
    case 'ingredient':
      filter = { 'ingredients.name': regex };
      break;
    case 'tag':
      filter = { 'tags.value': regex };
      break;
  }

  console.log('function url', getFunctionUrl(event, context));
  const host = new URL(getFunctionUrl(event, context)).host;
  const url = new URL(host + '/api/getAllRecipes');

  if (searchType !== 'title') {
    url.searchParams.append('searchType', searchType.toString());
  }
  if (searchText) {
    url.searchParams.append('searchText', searchText.toString());
  }

  try {
    const query = Recipe.find(filter);
    const paginatedResult = await paginate(
      query,
      url,
      event.queryStringParameters
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(paginatedResult),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('Could not paginate result', error)),
    };
  }
};

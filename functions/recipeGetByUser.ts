import { Handler } from '@netlify/functions';
import { paginate } from './helpers/pagination';
import { getFunctionHost } from './helpers/context';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import Recipe from './models/recipe.model';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event, context) => {
  const userId = event.queryStringParameters.id;

  if (!userId) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('No user provided')),
    };
  }

  const url = new URL(getFunctionHost(event, context) + '/api/recipeGetByUser');
  url.searchParams.append('id', userId.toString());

  try {
    const query = Recipe.find({ author: userId });
    const paginatedResult = await paginate(
      query,
      url,
      event.queryStringParameters
    );

    return {
      statusCode: 200,
      body: JSON.stringify(paginatedResult),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('Could not paginate result', error)),
    };
  }
};

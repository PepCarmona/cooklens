import { Handler } from '@netlify/functions';
import { UserInfo } from '../types';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import Recipe from './models/recipe.model';
import './models/user.model';

connectDB(process.env.MONGODB_URI);

const handler: Handler = async (event, context) => {
  let count: number;

  try {
    count = await Recipe.count();
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Could not count total number of recipes', error)
      ),
    };
  }

  const random = Math.floor(Math.random() * count);

  try {
    const foundRecipe = await Recipe.findOne()
      .skip(random)
      .populate<{ author: UserInfo }>('author');

    return {
      statusCode: 200,
      body: JSON.stringify(foundRecipe),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('Could not find recipe', error)),
    };
  }
};

export { handler };

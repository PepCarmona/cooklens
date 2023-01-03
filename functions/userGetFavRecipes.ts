import { Handler } from '@netlify/functions';
import middy from 'middy';
import { connectDB } from './helpers/database';
import { defaultLimitPerPage } from './helpers/pagination';
import { CustomError } from './helpers/errors';
import {
  authMiddleware,
  HandlerEventAuthenticated,
} from './middleware/authMiddleware';
import User from './models/user.model';
import './models/recipe.model';
import { DatabaseRecipe } from '../types';

connectDB(process.env.MONGODB_URI);

const getFavRecipes: Handler = async (event) => {
  const page = event.queryStringParameters.page
    ? parseInt(event.queryStringParameters.page.toString())
    : 1;
  const limit = event.queryStringParameters.limit
    ? parseInt(event.queryStringParameters.limit.toString())
    : defaultLimitPerPage;
  const skip = (page - 1) * limit;

  const user = (event as HandlerEventAuthenticated).auth.user;

  try {
    const foundUser = await User.findById(user._id)
      .select({
        favRecipes: {
          $slice: limit !== 0 ? [skip, skip + limit + 1] : Number.MAX_VALUE,
        },
      })
      .populate<{ favRecipes: DatabaseRecipe[] }>('favRecipes');

    if (!foundUser) {
      return {
        statusCode: 500,
        body: JSON.stringify(
          new CustomError('Document with provided id not found')
        ),
      };
    }

    const next = limit !== 0 && foundUser.favRecipes?.length === limit + 1;

    if (next) {
      foundUser.favRecipes?.pop();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: foundUser.favRecipes,
        next,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('Could not find user by id', error)),
    };
  }
};

export const handler = middy(getFavRecipes).use(authMiddleware());

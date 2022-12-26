import { Handler } from '@netlify/functions';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import User from './models/user.model';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event) => {
  const userId = event.queryStringParameters.id;

  if (!userId) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('User Id not provided')),
    };
  }

  try {
    const foundUser = await User.findById(userId).select('-password -__v');
    return {
      statusCode: 200,
      body: JSON.stringify(foundUser),
    };
  } catch (error) {
    if (error?.name === 'CastError') {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('The provided id is not valid')),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('Could not find user by id', error)),
    };
  }
};

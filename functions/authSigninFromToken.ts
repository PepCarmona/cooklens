import { Handler } from '@netlify/functions';
import { verify } from 'jsonwebtoken';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import { UserDecodedPayload } from './middleware/authMiddleware';
import User from './models/user.model';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event) => {
  let token: string;
  try {
    token = JSON.parse(event.body).token;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Provided body is not a valid JSON object', error)
      ),
    };
  }

  verify(token, process.env.JWTSECRET!, async (error, decoded) => {
    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('Unable to verify token', error)),
      };
    }

    const payload = decoded as UserDecodedPayload;
    if (payload.exp <= Date.now() / 1000) {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('Token expired')),
      };
    }

    try {
      const foundUser = await User.findById(payload.user._id);

      if (foundUser === null) {
        return {
          statusCode: 500,
          body: JSON.stringify(new CustomError('User does not exist')),
        };
      }

      if (!('_doc' in foundUser && typeof foundUser._doc === 'object')) {
        return {
          statusCode: 500,
          body: JSON.stringify(new CustomError('Not valid document')),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ ...foundUser._doc, password: undefined }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify(
          new CustomError('Error sending confirmation mail', error)
        ),
      };
    }
  });
};

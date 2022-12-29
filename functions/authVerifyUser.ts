import { Handler } from '@netlify/functions';
import { sign } from 'jsonwebtoken';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import User from './models/user.model';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event) => {
  const confirmationCode = event.queryStringParameters.code;

  if (!confirmationCode) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('No code provided')),
    };
  }

  try {
    const updatedUser = User.findOneAndUpdate(
      { confirmationCode: confirmationCode },
      { status: 'active' },
      { new: true }
    );
    if (!updatedUser) {
      return {
        statusCode: 500,
        body: JSON.stringify(
          new CustomError('Error finding user with confirmation code')
        ),
      };
    }

    sign(
      { user: updatedUser },
      process.env.JWTSECRET!,
      { expiresIn: 31556926 },
      (error, token) => {
        if (error) {
          return {
            statusCode: 500,
            body: JSON.stringify(
              new CustomError('Could not sign token', error)
            ),
          };
        }

        if (!('_doc' in updatedUser && typeof updatedUser._doc === 'object')) {
          return {
            statusCode: 500,
            body: JSON.stringify(new CustomError('Not valid document')),
          };
        }

        return {
          statusCode: 200,
          body: JSON.stringify({
            user: { ...updatedUser._doc, password: undefined },
            token,
          }),
        };
      }
    );
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Error finding user with confirmation code', error)
      ),
    };
  }
};

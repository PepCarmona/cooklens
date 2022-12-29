import { Handler } from '@netlify/functions';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import User, { SigninForm } from './models/user.model';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event) => {
  let signinForm: SigninForm;
  try {
    signinForm = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError(
          'Provided signin form is not a valid JSON object',
          error
        )
      ),
    };
  }

  try {
    const foundUser = await User.findOne({ username: signinForm.username });
    if (foundUser === null) {
      return {
        statusCode: 404,
        body: JSON.stringify(new CustomError('User not found')),
      };
    }

    if (foundUser.status === 'pending') {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('Email not verified')),
      };
    }

    const isValidPassword = await compare(
      signinForm.password,
      foundUser.password
    );

    if (!isValidPassword) {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('Invalid password')),
      };
    }

    sign(
      { user: foundUser },
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

        if (!('_doc' in foundUser && typeof foundUser._doc === 'object')) {
          return {
            statusCode: 500,
            body: JSON.stringify(new CustomError('Not valid document')),
          };
        }

        return {
          statusCode: 200,
          body: JSON.stringify({
            user: { ...foundUser._doc, password: undefined },
            token,
          }),
        };
      }
    );
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Could not find user by username', error)
      ),
    };
  }
};

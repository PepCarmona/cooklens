import { Handler } from '@netlify/functions';
import { hash } from 'bcryptjs';
import { getFunctionHost } from './helpers/context';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import { sendPasswordRecoveryMail } from './helpers/mail';
import User from './models/user.model';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event, context) => {
  let email = event.queryStringParameters.email;

  try {
    const foundUser = await User.findOne({ email });
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

    const token = await hash(foundUser.username + foundUser.password, 8);

    try {
      await sendPasswordRecoveryMail(
        {
          ...foundUser.toObject(),
          recoveryToken: token,
        },
        getFunctionHost(event, context)
      );

      return {
        statusCode: 200,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify(
          new CustomError('Error sending recovery mail', error)
        ),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Could not find user by mail', error)
      ),
    };
  }
};

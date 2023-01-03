import { Handler } from '@netlify/functions';
import { compare, hash } from 'bcryptjs';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import { sendPasswordRecoveryMail } from './helpers/mail';
import User from './models/user.model';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event) => {
  const email = event.queryStringParameters.email;
  const recoveryToken = event.queryStringParameters.token;
  const newPassword = event.queryStringParameters.newPassword;

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

    const recoveryTokenValue = foundUser.username + foundUser.password;

    const isValidRecoveryToken = await compare(
      recoveryTokenValue,
      recoveryToken
    );

    if (!isValidRecoveryToken) {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('Invalid recovery token')),
      };
    }

    await foundUser.update({
      $set: { password: await hash(newPassword, 8) },
    });

    return {
      statusCode: 200,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Could not find user by mail', error)
      ),
    };
  }
};

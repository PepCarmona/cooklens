import { Handler } from '@netlify/functions';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { connectDB } from './helpers/database';
import { CustomError } from './helpers/errors';
import { sendConfirmationMail } from './helpers/mail';
import User from './models/user.model';
import { SignupForm } from './models/user.model';

connectDB(process.env.MONGODB_URI);

export const handler: Handler = async (event) => {
  let signupForm: SignupForm;
  try {
    signupForm = JSON.parse(event.body).user;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError(
          'Provided signup form is not a valid JSON object',
          error
        )
      ),
    };
  }

  if (!signupForm || Object.keys(signupForm).length === 0) {
    return {
      statusCode: 500,
      body: JSON.stringify(new CustomError('Cannot save empty objects')),
    };
  }

  if (!signupForm.username || !signupForm.email || !signupForm.password) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('User has missing information for sign up')
      ),
    };
  }

  try {
    const foundUserByUsername = await User.findOne({
      username: signupForm.username,
    });

    if (foundUserByUsername !== null) {
      return {
        statusCode: 500,
        body: JSON.stringify(new CustomError('This username already exists')),
      };
    }

    try {
      const foundUserByMail = await User.findOne({ email: signupForm.email });

      if (foundUserByMail !== null) {
        return {
          statusCode: 500,
          body: JSON.stringify(
            new CustomError('This email is already being used by another user')
          ),
        };
      }

      const confirmationCode = sign(
        { email: signupForm.email },
        process.env.JWTSECRET!
      );

      const user = new User({
        ...signupForm,
        password: await hash(signupForm.password, 8),
        confirmationCode,
      });

      try {
        const savedUser = await user.save();
        try {
          await sendConfirmationMail(savedUser);
          let tokenGenerationError: Error;
          let generatedToken: string;
          sign(
            { savedUser },
            process.env.JWTSECRET!,
            { expiresIn: 31556926 },
            (error, token) => {
              tokenGenerationError = error;
              generatedToken = token;
            }
          );

          if (tokenGenerationError) {
            return {
              statusCode: 500,
              body: JSON.stringify(
                new CustomError('Error generating token', tokenGenerationError)
              ),
            };
          }

          if (!('_doc' in savedUser && typeof savedUser._doc === 'object')) {
            return {
              statusCode: 500,
              body: JSON.stringify(new CustomError('Not valid document')),
            };
          }

          return {
            statusCode: 200,
            body: JSON.stringify({
              user: { ...savedUser._doc, password: undefined },
              token: generatedToken,
            }),
          };
        } catch (error) {
          return {
            statusCode: 500,
            body: JSON.stringify(
              new CustomError('Error sending confirmation mail', error)
            ),
          };
        }
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify(
            new CustomError('Could not save user to database', error)
          ),
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify(
          new CustomError('Could not find user by email', error)
        ),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        new CustomError('Could not find user by username', error)
      ),
    };
  }
};

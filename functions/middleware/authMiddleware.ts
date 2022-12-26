import { Middleware, MiddlewareObject } from 'middy';
import { JwtPayload, verify } from 'jsonwebtoken';
import { HandlerEvent, HandlerResponse } from '@netlify/functions';
import { CustomError } from '../helpers/errors';
import { UserInfo } from '../../types';

export interface HandlerEventAuthenticated extends HandlerEvent {
  auth: UserDecodedPayload;
}
interface UserDecodedPayload extends JwtPayload {
  user: UserInfo;
}

export const authMiddleware: Middleware<never> = (): MiddlewareObject<
  HandlerEventAuthenticated,
  HandlerResponse
> => ({
  before: async ({ event, callback }, next) => {
    const token = event.headers['x-access-token'] as string | undefined;

    if (!token) {
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify(new CustomError('No token provided')),
      });
    }

    verify(token, process.env.JWTSECRET!, (error, decoded) => {
      if (error) {
        return callback(null, {
          statusCode: 500,
          body: JSON.stringify(
            new CustomError('Unable to verify token', error)
          ),
        });
      }

      if (!decoded) {
        return callback(null, {
          statusCode: 500,
          body: JSON.stringify(new CustomError('Empty token')),
        });
      }

      const payload = decoded as UserDecodedPayload;
      event.auth = payload;
      next();
    });
  },
});

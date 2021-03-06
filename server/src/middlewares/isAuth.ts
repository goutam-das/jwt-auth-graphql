import { MiddlewareFn } from "type-graphql";
import { verify } from 'jsonwebtoken';
import { MyContext } from '../types';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    const authorization = context.req.headers['authorization'];

    if (!authorization) throw new Error('not authenticated');

    try {
        const token = authorization.split(' ')[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET_KEY!);
        context.payload = payload as any;
    } catch (error) {
        throw new Error('not authenticated');
    }

    return next();
}
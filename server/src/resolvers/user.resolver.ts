import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { hash, compare } from 'bcryptjs';
import User from '../entities/user.entity';
import { MyContext } from '../types';
import { createAccessToken, createRefreshToken } from '../lib/auth';
import { sendRefreshToken } from '../lib/sendRefreshToken';
import { isAuth } from '../middlewares/isAuth';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
}

@Resolver()
export default class UserResolver {
    @Query(() => String)
    @UseMiddleware(isAuth)
    logout(
        @Ctx() { payload }: MyContext
    ) {
        return `Your user id is: ${payload?.userId}`;
    }

    @Query(() => [User])
    async users() {
        return User.find();
    }

    @Mutation(() => Boolean)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        try {
            const hashPassword = await hash(password, 12);
            await User.insert({ email, password: hashPassword });
            return true;
        } catch (error) {
            return false
        };
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { res }: MyContext
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error("Wrong email or password");
        const validPassword = await compare(password, user.password);
        if (!validPassword) throw new Error("Wrong email or password");
        // Set Refresh Token
        sendRefreshToken(res, createRefreshToken(user));
        return {
            accessToken: createAccessToken(user)
        };
    }
}
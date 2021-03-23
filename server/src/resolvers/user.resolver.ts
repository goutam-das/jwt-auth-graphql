import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { hash, compare } from 'bcryptjs';
import User from '../entities/user.entity';
import { MyContext } from '../types';
import { createAccessToken, createRefreshToken } from '../lib/auth';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
}

@Resolver()
export default class UserResolver {
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

        res.cookie('jid', createRefreshToken(user), { httpOnly: true });

        return {
            accessToken: createAccessToken(user)
        };
    }
}
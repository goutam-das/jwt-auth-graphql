import { sign } from 'jsonwebtoken';
import User from "../entities/user.entity";

export const createAccessToken = (user: User) => {
    return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET_KEY!, {
        expiresIn: "15m"
    })
}

export const createRefreshToken = (user: User) => {
    return sign({ userId: user.id, tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET_KEY!, {
        expiresIn: "7d"
    })
}
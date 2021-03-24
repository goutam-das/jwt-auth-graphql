import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import User from '../entities/user.entity';
import { createAccessToken, createRefreshToken } from '../lib/auth';
import { sendRefreshToken } from '../lib/sendRefreshToken';

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const token = req.cookies.jid;
    if (!token)
        return res.send({ ok: false, accessToken: "" });

    let payload: any = null;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET_KEY!)
    } catch (error) {
        console.log(error);
        return res.send({ ok: false, accessToken: "" });
    }
    // token is valid and
    // we can send an access token
    const user = await User.findOne({ where: { id: payload?.userId } });
    if (!user) return res.send({ ok: false, accessToken: "" });
    // Set Refresh Token
    sendRefreshToken(res, createRefreshToken(user));
    return res.send({ ok: true, accessToken: createAccessToken(user) });
}
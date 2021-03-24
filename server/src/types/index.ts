import { Request, Response } from 'express';

export interface IPayload {
    userId: string;
    tokenVersion: number;
}

export interface MyContext {
    req: Request;
    res: Response;
    payload: IPayload;
}
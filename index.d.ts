import express from "express";
declare global {
    namespace Express {
        interface Request {
            _subdomainLevel?: number;
        }
    }
}
export default function (subdomain: any, fn: any): (req: express.Request, res: express.Response, next: express.NextFunction) => any;

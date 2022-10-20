import express from "express";
declare global {
    namespace Express {
        interface Request {
            _subdomainLevel?: number;
        }
    }
}
export default function (subdomain: string, fn: express.Router, offset?: number): (req: express.Request, res: express.Response, next: express.NextFunction) => void;

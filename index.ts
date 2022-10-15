import express from "express";

declare global {
  namespace Express {
    interface Request {
      _subdomainLevel?: number;
    }
  }
}

export default function(subdomain: any, fn: any) {
  if(!subdomain || typeof subdomain !== "string") {
    throw new Error("The first parameter must be a string representing the subdomain");
  }

  //check fn handles three params..
  if(!fn || typeof fn !== "function" || fn.length < 3) {
    throw new Error("The second parameter must be a function that handles fn(req, res, next) params.");
  }

  return function (req: express.Request, res: express.Response, next: express.NextFunction) {
    req._subdomainLevel ||= 0;
    let relevantSubdomains = req.subdomains.slice(req._subdomainLevel);

    let match = subdomain.split('.').every((v, i) => v === '*' || v === relevantSubdomains[i]);

    if(match) {
      req._subdomainLevel ++;
      return fn(req, res, next);
    } else {
      return next();
    }
  };
};

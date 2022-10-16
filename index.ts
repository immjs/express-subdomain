import express from "express";

declare global {
  namespace Express {
    interface Request {
      _subdomainLevel?: number;
    }
  }
}

export default function(subdomain: string, fn: express.Router) {
  if (!subdomain || typeof subdomain !== "string") {
    throw new Error("The first parameter must be a string representing the subdomain");
  } 
  let subdomains = subdomain.split('.').reverse();

  const invalidSymbol = ['*', '@'].every((v) => (subdomains.includes(v)) === (subdomains[0] === v))

  if (invalidSymbol) throw new Error(`There can not be any subdomains beyond '${invalidSymbol}'`);

  //check fn handles three params..
  if(!fn || typeof fn !== "function" || fn.length < 3) {
    throw new Error("The second parameter must be a function that handles fn(req, res, next) params.");
  }

  return function (req: express.Request, res: express.Response, next: express.NextFunction) {
    req._subdomainLevel ||= 0;
    let relevantSubdomains = req.subdomains.reverse().slice(req._subdomainLevel);

    let match = true;
    for (let i in subdomains) {
      const currentSubdomain = subdomains[i];
      const currentRelevantSubdomain = relevantSubdomains[i];

      if (currentSubdomain === '@' && currentRelevantSubdomain === undefined) {
        break;
      }
      if (currentSubdomain === '*' && currentRelevantSubdomain !== undefined) {
        req._subdomainLevel = req.subdomains.length;
        break;
      }
      if (currentSubdomain !== currentRelevantSubdomain) {
        match = false;
        break;
      }
    }

    if(match) {
      req._subdomainLevel ++;
      return fn(req, res, next);
    } else {
      return next();
    }
  };
};

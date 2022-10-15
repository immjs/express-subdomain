"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(subdomain, fn) {
    if (!subdomain || typeof subdomain !== "string") {
        throw new Error("The first parameter must be a string representing the subdomain");
    }
    //check fn handles three params..
    if (!fn || typeof fn !== "function" || fn.length < 3) {
        throw new Error("The second parameter must be a function that handles fn(req, res, next) params.");
    }
    return function (req, res, next) {
        req._subdomainLevel || (req._subdomainLevel = 0);
        let relevantSubdomains = req.subdomains.slice(req._subdomainLevel);
        let match = subdomain.split('.').every((v, i) => v === '*' || v === relevantSubdomains[i]);
        if (match) {
            req._subdomainLevel++;
            return fn(req, res, next);
        }
        else {
            return next();
        }
    };
}
exports.default = default_1;
;

import { Request, Response, NextFunction } from 'express';

import auth from '../middlwares/auth';

const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== 'GET' && (req.baseUrl !== '/users' || (req.baseUrl === '/users' && req.path !== '/'))) {
    auth(req, res, next);
  } else {
    next();
  }
};

export default authenticationMiddleware;

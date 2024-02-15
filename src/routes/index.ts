import { Router } from 'express'; // импортируем роутер из express
import musOlympData from './musOlympData';
import announcements from './announcements';

import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import { NOT_FOUND_ERROR_MESSAGE } from '../utils/constants';

const router = Router();

router.use('/musOlympData', musOlympData);
router.use('/announcements', announcements);

// роут для запросов по несуществующим URL
router.use('*', (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
});

export default router;

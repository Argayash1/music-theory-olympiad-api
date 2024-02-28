import { Router } from 'express'; // импортируем роутер из express
import musOlympData from './musOlympData';
import adverts from './adverts';
import juryMembers from './juryMembers';
import results from './results';
import prepMaterials from './prepMaterials';
import archives from './archives';

import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import { NOT_FOUND_ERROR_MESSAGE } from '../utils/constants';

const router = Router();

router.use('/musOlympData', musOlympData);
router.use('/adverts', adverts);
router.use('/juryMembers', juryMembers);
router.use('/results', results);
router.use('/prepMaterials', prepMaterials);
router.use('/archives', archives);

// роут для запросов по несуществующим URL
router.use('*', (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
});

export default router;

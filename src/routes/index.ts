import { Router } from 'express'; // импортируем роутер из express

import users from './users';
import musOlympData from './musOlympData';
import adverts from './adverts';
import juryMembers from './juryMembers';
import results from './results';
import prepMaterials from './prepMaterials';
import archives from './archives';

import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import { NOT_FOUND_ERROR_MESSAGE } from '../utils/constants';
import authenticationMiddleware from '../middlwares/authenticationMiddleware';
import { createUserValidator, loginValidator } from '../middlwares/validators/userValidator';
import { createUser, login } from '../controllers/users';

const router = Router();

// роуты, не требующие авторизации - регистрация и логин
router.post('/signup', createUserValidator, createUser); // добавили роутер для регистрации
router.post('/signin', loginValidator, login); // добавили роутеры для авторизации

// Применяем middleware авторизации ко всем запросам, кроме GET и кроме роута '/users'
router.use(authenticationMiddleware);

router.use('/users', users);
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

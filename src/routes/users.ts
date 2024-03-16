// Импорт роутера
import { Router } from 'express'; // импортируем роутер из express

// Импорт контроллеров
import { getCurrentUserInfo, updateUserData } from '../controllers/users';

// Импорт валидаторов
const { userDataValidator } = require('../middlewares/validators/userValidator');

const router = Router();

// Роутеры
router.get('/me', getCurrentUserInfo);

router.patch('/me', userDataValidator, updateUserData);

export default router; // экспортировали этот роутер

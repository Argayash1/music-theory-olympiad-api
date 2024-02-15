import { Router } from 'express'; // импортируем роутер из express

import {
  getMusOlympData,
  createMusOlympData,
  updateMusOlympData,
  deleteMuseOlympDataById,
} from '../controllers/musOlympData';
import { musOlympDataValidator, musOlympDataIdValidator } from '../middlwares/validators/musOlympDataValidator';

const router = Router();

router.get('/', getMusOlympData);

router.post('/', createMusOlympData);

router.patch('/:musOlympId', musOlympDataIdValidator, musOlympDataValidator, updateMusOlympData);

router.delete('/:musOlympId', musOlympDataIdValidator, deleteMuseOlympDataById);

export default router;

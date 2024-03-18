import { Router } from 'express'; // импортируем роутер из express

import {
  getAdverts,
  getAdvertById,
  createAnnouncement,
  updateAdvertData,
  deleteAdvertById,
} from '../controllers/adverts';

import {
  advertDataValidator,
  advertQueryParamsValidator,
  advertIdValidator,
} from '../middlwares/validators/advertValidator';

const router = Router();

router.get('/', advertQueryParamsValidator, getAdverts);

router.get('/:advertId', advertIdValidator, getAdvertById);

router.post('/', advertDataValidator, createAnnouncement);

router.patch('/:advertId', advertIdValidator, advertDataValidator, updateAdvertData);

router.delete('/:advertId', advertIdValidator, deleteAdvertById);

export default router;

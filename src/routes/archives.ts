import { Router } from 'express'; // импортируем роутер из express

import {
  getArchives,
  getArchiveById,
  createArchive,
  updateArchiveData,
  deleteArchiveById,
} from '../controllers/archives';

import {
  archiveDataValidator,
  archiveQueryParamsValidator,
  archiveIdValidator,
} from '../middlwares/validators/archiveValidator';

const router = Router();

router.get('/', archiveQueryParamsValidator, getArchives);

router.post('/', archiveDataValidator, createArchive);

router.get('/:archiveId', archiveIdValidator, getArchiveById);

router.patch('/:archiveId', archiveIdValidator, archiveDataValidator, updateArchiveData);

router.delete('/:archiveId', archiveIdValidator, deleteArchiveById);

export default router;

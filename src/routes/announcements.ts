import { Router } from 'express'; // импортируем роутер из express

import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncementData,
  deleteAnnouncementById,
} from '../controllers/announcements';

import {
  announcementDataValidator,
  announcementQueryParamsValidator,
  announcementIdValidator,
} from '../middlwares/validators/announcementValidator';

const router = Router();

router.get('/', announcementQueryParamsValidator, getAnnouncements);

router.get('/:announcementId', announcementIdValidator, getAnnouncementById);

router.post('/', announcementDataValidator, createAnnouncement);

router.patch('/:announcementId', announcementIdValidator, announcementDataValidator, updateAnnouncementData);

router.delete('/:announcementId', announcementIdValidator, deleteAnnouncementById);

export default router;

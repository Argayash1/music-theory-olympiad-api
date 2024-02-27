import { Router } from 'express'; // импортируем роутер из express

import {
  getJuryMembers,
  getJuryMemberById,
  updateJuryMemberInfo,
  updateJuryMemberImage,
  createJuryMember,
  deleteUnionMemberById,
} from '../controllers/juryMembers';

import {
  juryMemberDataValidator,
  juryMemberQueryParamsValidator,
  juryMemberInfoDataValidator,
  juryMemberImageUrlValidator,
  juryMemberIdValidator,
} from '../middlwares/validators/juryMemberValidator';

const router = Router();

router.get('/', juryMemberQueryParamsValidator, getJuryMembers);

router.post('/', juryMemberDataValidator, createJuryMember);

router.get('/:memberId', juryMemberIdValidator, getJuryMemberById);

router.patch('/:memberId', juryMemberIdValidator, juryMemberInfoDataValidator, updateJuryMemberInfo);

router.patch('/:memberId/image', juryMemberIdValidator, juryMemberImageUrlValidator, updateJuryMemberImage);

router.delete('/:memberId', juryMemberIdValidator, deleteUnionMemberById);

export default router;

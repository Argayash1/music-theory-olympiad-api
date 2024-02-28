import { Router } from 'express'; // импортируем роутер из express

import {
  getPrepMaterials,
  getPrepMaterialById,
  createPrepMaterial,
  updatePrepMaterialData,
  deletePrepMaterialById,
} from '../controllers/prepMaterials';

import {
  prepMaterialDataValidator,
  prepMaterialQueryParamsValidator,
  prepMaterialIdValidator,
} from '../middlwares/validators/prepMaterialValidator';

const router = Router();

router.get('/', prepMaterialQueryParamsValidator, getPrepMaterials);

router.post('/', createPrepMaterial);

router.get('/:prepMaterialId', prepMaterialIdValidator, getPrepMaterialById);

router.patch('/:prepMaterialId', prepMaterialIdValidator, prepMaterialDataValidator, updatePrepMaterialData);

router.delete('/:prepMaterialId', prepMaterialIdValidator, deletePrepMaterialById);

export default router;

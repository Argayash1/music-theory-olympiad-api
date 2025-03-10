import { Router } from 'express'; // импортируем роутер из express

import { getResults, getResultByIndex, createResult, updateResultData, deleteResultById } from '../controllers/results';

import { resultDataValidator, resultQueryParamsValidator, resultIdValidator, resultIndexValidator, } from '../middlwares/validators/resultValidator';

const router = Router();

router.get('/', resultQueryParamsValidator, getResults);

router.post('/', resultDataValidator, createResult);

router.get('/:resultIndex', resultIndexValidator, getResultByIndex);

router.patch('/:resultId', resultIdValidator, resultDataValidator, updateResultData);

router.delete('/:resultId', resultIdValidator, deleteResultById);

export default router;

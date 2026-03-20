import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  toggle,
} from '../controllers/task.controller';

const router = Router();

// All task routes are protected
router.use(authenticate);

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', remove);
router.patch('/:id/toggle', toggle);

export default router;
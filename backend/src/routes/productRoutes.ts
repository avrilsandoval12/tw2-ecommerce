import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { param } from 'express-validator';
import { handleInputError } from '../middlewares/validation';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/classifications', ProductController.getClassifications);
router.get('/:id',
  param('id')
    .isInt().withMessage('ID inválido'),
  handleInputError,
  ProductController.getProductById
);

export default router;
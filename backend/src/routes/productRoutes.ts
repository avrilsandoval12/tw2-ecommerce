import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { param } from 'express-validator';
import { handleInputError } from '../middlewares/validation';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/classifications', ProductController.getClassifications);
router.get('/:id',
  param('id')
    .isInt().withMessage('ID inválido'),
  handleInputError,
  ProductController.getProductById
);



router.post('/', upload.single('imagen'), ProductController.createProduct);
router.put('/:id', upload.single('imagen'), ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);


export default router;
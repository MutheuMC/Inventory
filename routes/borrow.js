const { getBorrowers, postBorrowers, getBorrowedComponentById,getBorrowersByComponent} = require('../controllers/borrow')

const {Router} = require('express')

const borrowRouter = Router();


borrowRouter.get('/', getBorrowers);
borrowRouter.post('/', postBorrowers);
borrowRouter.get('/:id', getBorrowedComponentById);
// In the borrow routes file

borrowRouter.get('/', getBorrowersByComponent);
// ... (other routes)




module.exports = borrowRouter;
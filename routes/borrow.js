const { getBorrowers, postBorrowers, getBorrowedComponentById} = require('../controllers/borrow')

const {Router} = require('express')

const borrowRouter = Router();


borrowRouter.get('/', getBorrowers);
borrowRouter.post('/', postBorrowers);
borrowRouter.get('/:id', getBorrowedComponentById);





module.exports = borrowRouter;
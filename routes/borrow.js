const { getBorrowers, postBorrowers} = require('../controllers/borrow')

const {Router} = require('express')

const borrowRouter = Router();


borrowRouter.get('/', getBorrowers);
borrowRouter.post('/', postBorrowers);




module.exports = borrowRouter;
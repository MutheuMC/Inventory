const { Router } = require('express')
const componentsRouter = Router()

const{getComponents, createComponent, getComponentById,updateComponent,updateComponentQuantity, deleteComponent, getComponentsType} = require("../controllers/component");
const component = require('../models/component');

componentsRouter.get('/', getComponentsType);
componentsRouter.post('/', createComponent);
componentsRouter.get('/components/:componentsType', getComponents )

componentsRouter.get('/:id', getComponentById)
componentsRouter.put('/:id/update', updateComponent)
componentsRouter.put('/:id/update-quantity', updateComponentQuantity);


componentsRouter.delete('/delete', deleteComponent)


module.exports = componentsRouter
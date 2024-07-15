// const { Router } = require('express')
// const componentsRouter = Router()

// const{getComponents, createComponent, getComponentById,updateComponent,updateComponentQuantity, deleteComponent, getComponentsType,getComponentHistory} = require("../controllers/component");
// const component = require('../models/component');

// componentsRouter.get('/', getComponentsType);
// componentsRouter.post('/', createComponent);
// componentsRouter.get('/components/:componentsType', getComponents )

// componentsRouter.get('/:id', getComponentById)
// componentsRouter.put('/:id/update', updateComponent)
// componentsRouter.put('/:id/update-quantity', updateComponentQuantity);


// componentsRouter.delete('/delete', deleteComponent)

// // In the component routes file

// componentsRouter.get('/:id/history', getComponentHistory);


// module.exports = componentsRouter

const { Router } = require('express');
const componentsRouter = Router();

const {
  getComponents,
  createComponent,
  getComponentById,
  updateComponent,
  updateComponentQuantity,
  deleteComponent,
  getComponentsType,
  getComponentHistory
} = require("../controllers/component");

// Define routes
componentsRouter.get('/', getComponentsType);
componentsRouter.post('/', createComponent);
componentsRouter.get('/components/:componentsType', getComponents);

componentsRouter.get('/:id', getComponentById);
componentsRouter.put('/:id/update', updateComponent);
componentsRouter.put('/:id/update-quantity', updateComponentQuantity);
componentsRouter.delete('/:id', deleteComponent);

componentsRouter.get('/:id/history', getComponentHistory);

module.exports = componentsRouter;

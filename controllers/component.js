// const { where } = require('sequelize')
const { Component, ComponentsQuantity, BorrowedComponent, sequelize  }  = require('../models')

const { Op, fn, col } = require('sequelize');


module.exports.getComponents = async (req, res) => {
  // console.log("running")

  const componentType = req.params.componentsType;
  const partNumber = req.query.q;

  try {
    let components;
    if (partNumber) {
      components = await Component.findAndCountAll({
        where: {
          componentType: componentType,
          partNumber: {
            [Op.iLike]: `%${partNumber}%`
          }
        }
      });
    } else {
      components = await Component.findAndCountAll({
        where: {
          componentType: componentType
        }
      });
    }

    // Log the components object for debugging
    console.log("Fetched Components:", components);

    if (!components || components.rows.length === 0) {
      return res.status(404).json({ "message": "No components found" });
    }

    // Map over components to add `totalQuantity`, `borrowedQuantity`, and `remainingQuantity`
    const componentData = await Promise.all(components.rows.map(async (component) => {
      // Get the total quantity of the component
      const totalQuantityResult = await ComponentsQuantity.sum('quantity', {
        where: { componentUUID: component.uuid }
      });
      
      // Get the total borrowed quantity of the component
      const borrowedQuantityResult = await BorrowedComponent.sum('quantity', {
        where: { componentUUID: component.uuid }
      });

      // Calculate `totalQuantity`, `borrowedQuantity`, and `remainingQuantity`
      const totalQuantity = totalQuantityResult || 0;
      const borrowedQuantity = borrowedQuantityResult || 0;
      const remainingQuantity = totalQuantity - borrowedQuantity;

      return {
        ...component.toJSON(),
        totalQuantity,
        borrowedQuantity,
        remainingQuantity
      };
    }));

    // Log the final data to be sent in the response
    console.log("Component Data:", { count: components.count, rows: componentData });

    // Send the response with the component data
    res.status(200).json({ count: components.count, rows: componentData });
  } catch (error) {
    console.error("Error fetching components:", error);
    res.status(500).json({ "message": "Internal server error" });
  }
};



module.exports.getComponentsType = async (req, res) => {
  const name = req.query.q;
  let components;
  console.log("running")

  try {
    if (name) {
      components = await Component.findAll({
        attributes: [
          'componentType',
          [sequelize.fn('sum', sequelize.col('ComponentsQuantities.quantity')), 'totalQuantity'],
          [sequelize.fn('sum', sequelize.col('BorrowedComponents.quantity')), 'totalBorrowedQuantity'],
        ],
        include: [
          {
            model: ComponentsQuantity,
            attributes: [],  // No need to include quantity data from this join
          },
          {
            model: BorrowedComponent,
            attributes: [],  // No need to include quantity data from this join
          },
        ],
        group: ['componentType'],
        where: {
          componentType: {
            [Op.iLike]: `%${name}%`
          }
        },
        raw: true,  // Return plain data objects
      });

    } else {
      components = await Component.findAll({
        attributes: [
          'componentType',
          [sequelize.fn('sum', sequelize.col('ComponentsQuantities.quantity')), 'totalQuantity'],
          [sequelize.fn('sum', sequelize.col('BorrowedComponents.quantity')), 'totalBorrowedQuantity'],
        ],
        include: [
          {
            model: ComponentsQuantity,
            attributes: [],  // No need to include quantity data from this join
          },
          {
            model: BorrowedComponent,
            attributes: [],  // No need to include quantity data from this join
          },
        ],
        group: ['componentType'],
        raw: true,  // Return plain data objects
      });
    }

    // Process data to include remainingQuantity
    const result = components.map(component => ({
      componentType: component.componentType,
      totalQuantity: component.totalQuantity || 0,
      borrowedQuantity: component.totalBorrowedQuantity || 0,
      remainingQuantity: (component.totalQuantity || 0) - (component.totalBorrowedQuantity || 0),
    }));

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No components found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


  module.exports.createComponent = async (req, res) => {
    const { componentName, componentType, partNumber, quantity, status, condition, conditionDetails } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const component = await Component.create(
            { componentName, componentType, partNumber, status, condition, conditionDetails },
            { transaction }
        );

        if (component) {
            await ComponentsQuantity.create(
                { componentUUID: component.uuid, quantity },
                { transaction }
            );

            await transaction.commit();

            res.status(200).json({ "message": "Component created successfully" });
        } else {
            await transaction.rollback();
            res.status(404).json({ "message": "Error creating component" });
        }
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        res.status(500).json({ "message": "An error occurred" });
    }
};
module.exports.updateComponent = async (req, res) => {
  const id = req.params.id;
  const { componentName, componentType, partNumber, quantity, status, condition, conditionDetails } = req.body;

  const transaction = await sequelize.transaction();

  try {
      // Find the component by UUID
      const component = await Component.findOne({ where: { uuid: id }, transaction });

      if (component) {
          // Update the component details
          await Component.update(
              {
                  componentName: componentName || component.componentName,
                  componentType: componentType || component.componentType,
                  partNumber: partNumber || component.partNumber,
                  quantity: quantity !== undefined ? quantity : component.quantity,
                  status: status !== undefined ? status : component.status,
                  condition: condition !== undefined ? condition : component.condition,
                  conditionDetails: conditionDetails || component.conditionDetails,
              },
              {
                  where: { uuid: id },
                  transaction
              }
          );
          if (quantity !== undefined) {
              await ComponentsQuantity.create(
                  {
                      componentId: id,
                      quantity,
                  },
                  {
                      transaction
                  }
              );
          }

          // Commit the transaction
          await transaction.commit();

          res.status(200).json({ message: "Component updated successfully" });
      } else {
          // If component is not found, rollback the transaction
          await transaction.rollback();
          res.status(404).json({ message: "Component not found" });
      }
  } catch (error) {
      // If an error occurred, rollback the transaction
      await transaction.rollback();
      console.log(error);
      res.status(500).json({ message: error.message });
  }
};

module.exports.updateComponentQuantity = async (req, res)=>{
  const componentId = req.params.id;
  const quantity = req.body.quantity

  try{
  const quantityEntry = await ComponentsQuantity.create({componentId, quantity})
  if(!quantityEntry){
    res.status(400).json({message: "Cannot create  quantity"})
  }

  res.status(200).json({message : "quantity created successfully"})

  }catch(error){
    res.status(500).json({ message: error.message });

  }




}

module.exports.getComponentById = async (req, res)=>{
    const id = req.params.id
    try{
        const component = await Component.findOne({where: {uuid: id}})
            if(component){
                res.status(200).json(component)
                }
                // res.status(200).json(component)
            }

    catch(error)
    {
        res.status(500).json({"message": error.message})
    }
    
}

module.exports.deleteComponent = async (req, res)=>{

    const id = req.params.id

    try{
        const deletedComponent = await Component.destroy({where: { uuid: id}})

    }catch(error){
        res.status(500).json({"message": error.message})
    }

}

module.exports.search =async(req, res)=>{
  const name = req.body.name

  try{
    const searchedData = await Component.find({where: {firstName: name }})

  }catch(error){

  }
}
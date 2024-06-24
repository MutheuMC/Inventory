// const { where } = require('sequelize')
const { Component, sequelize }  = require('../models')
const {Op} = require('sequelize')

module.exports.getComponents = async (req, res) => {
  const componentType = req.params.componentsType;
  const partNumber = req.query.q;
  console.log(partNumber);

  let components;
  try {
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

    if (!components || components.length === 0) {
      res.status(404).json({ "message": "No components Found" });
    } else {
      res.status(200).json(components);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ "message": "Internal server error" });
  }
};




module.exports.getComponentsType = async (req, res) => {
  const name = req.query.q;
  let components

    try {

      if (name){
        components = await Component.findAndCountAll({
          where:{
            componentType:{
              [Op.iLike]: `%${name}%`  // Use Op.iLike for case-insensitive search
            }
          },
          attributes: ['componentType', [sequelize.fn('sum', sequelize.col('quantity')), 'totalQuantity']],
          group: ['componentType'],

        })

        // console.log(components)
      }
      else{
      components = await Component.findAndCountAll({
        attributes: ['componentType', [sequelize.fn('sum', sequelize.col('quantity')), 'totalQuantity']],
        group: ['componentType'],
      });

      // console.log(components)

    }
  
      if (components.rows.length > 0) {
        // console.log(components)
        res.status(200).json(components);
      } else {
        res.status(404).json({ message: "No components found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports.createComponent = async(req, res)=>{
    const {componentName, componentType, partNumber, quantity, status, condition, conditionDetails} = req.body

    try{
        const component = await Component.create({componentName,componentType, partNumber, quantity, status, condition, conditionDetails})

        if (component){
            res.status(200).json({"message" : "Component created successfully"})
        }else{
            res.status(404).json({"message" :"error"})
        }

    }catch(error){
        console.log(error)
    }
    
}
module.exports.updateComponent = async (req, res) => {
    const id = req.params.id;
    const { componentName, componentType, partNumber, quantity, status, condition, conditionDetails } = req.body;
  
    try {
      const component = await Component.findOne({ where: { uuid: id } });
  
      if (component) {
        await Component.update(
          {
            componentName: componentName || component.componentName,
            componentType: componentType || component.componentType,
            partNumber: partNumber || component.partNumber,
            quantity: quantity || component.quantity,
            status: status !== undefined ? status : component.status,
            condition: condition !== undefined ? condition : component.condition,
            conditionDetails: conditionDetails || component.conditionDetails,
          },
          {
            where: { uuid: id }
          }
        );
  
        res.status(200).json({ message: "Component updated successfully" });
      } else {
        res.status(404).json({ message: "Component not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

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
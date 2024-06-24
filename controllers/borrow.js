const {BorrowedComponent, Component, sequelize} = require('../models')

module.exports.getBorrowers = async (req, res)=>{

    try{
        const borrowers =  await BorrowedComponent.findAll();
        
        if(! borrowers){
            res.status(404).json("message : No borrowers found")
        }

        res.status(200).json(borrowers)

    }catch(error){

    }
}

module.exports.postBorrowers = async (req, res) => {
    console.log(req.body);
  
    const {
      componentUUID,
      fullName,
      borrowerID,
      borrowerContact,
      departmentName,
      dateOfIssue,
      actualReturnDate,
      expectedReturnDate,
      purpose,
      reasonForBorrowing,
    } = req.body;
  
    const t = await sequelize.transaction();
  
    try {
      // Create the borrow record within the transaction
      const borrow = await BorrowedComponent.create(
        {
          componentUUID,
          fullName,
          borrowerID,
          borrowerContact,
          departmentName,
          dateOfIssue,
          actualReturnDate,
          expectedReturnDate,
          purpose,
          reasonForBorrowing,
        },
        { transaction: t }
      );
  
      if (!borrow) {
        await t.rollback();
        return res.status(400).json({ message: "Error when inserting the data" });
      }
  
      // Reduce the component quantity within the transaction
      const component = await Component.findOne({ where: { uuid: componentUUID }, transaction: t });
  
      if (!component) {
        await t.rollback();
        return res.status(404).json({ message: "Component not found" });
      }
  
      if (component.quantity <= 0) {
        await t.rollback();
        return res.status(400).json({ message: "Insufficient component quantity" });
      }
  
      component.quantity -= 1;
  
      // Update the status if the quantity is 0
      if (component.quantity === 0) {
        component.status = true;
      }
  
      await component.save({ transaction: t });
  
      await t.commit();
      res.status(200).json({ message: "Successfully inserted the data to the database" });
  
    } catch (error) {
      await t.rollback();
      console.log(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };


const {Categories } = require('../models')

module.exports.getCategories = async (req, res)=>{
      
    try{
        const categories = await Categories.findAll()

        if(!categories){
            res.status(404).json("No categories found")
        }
        res.status(200).json(categories)

    }catch(error){
        res.status(500).json({message  :error.message})
    }

}
module.exports.createCategories = async (req, res) => {
    const { category } = req.body;

    const categoriesArray = category.split(',').map(cat => cat.trim());

    try {
    
        const newCats = await Categories.bulkCreate(
            categoriesArray.map(cat => ({ category: cat })),
            { ignoreDuplicates: true } 
        );

        if (!newCats) {
            return res.status(404).json({ message: "Could not create new categories" });
        }

        res.status(200).json({ message: "Categories created successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateCategories = async(req, res)=>{

}
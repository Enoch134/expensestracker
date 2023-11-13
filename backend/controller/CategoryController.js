import prisma from "../db/prisma.js";


/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */


export const getAllCategory = async(req,res) =>{
    try {
		const category = await prisma.category.findMany({
			include: { products: req.query?.products === "true" },
		});

		return res
			.status(200)
			.json({ status: "success", results: category.length, data: { category } });
	} catch (error) {
		return res.status(400).json({ status: "fail", message: error });
	}
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
export const getCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) }, 
      });
  
      if (category) {
        return res.status(200).json({ status: "success", data: { category } });
      } else {
        return res.status(404).json({ status: "fail", message: "Expense not found" });
      }
    } catch (error) {
      console.error(error); 
      return res.status(400).json({ status: "fail", message: "An error occurred" });
    } finally {
      await prisma.$disconnect(); 
    }
};
  

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
export const createCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
  

      const category = await prisma.category.create({
        data: {
          name,
          description,
        },
      });
  
      return res.status(201).json({ status: "success", data: { category } });
    } catch (error) {
      return res.status(400).json({ status: "fail", message: error.message });
    }
  };
  

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
export const updateCategory = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const category = await prisma.category.update({
        where: { id: parseInt(id) }, 
        data: req.body,
      });
  
      return res.status(200).json({ status: "success", data: { category: category } });
    } catch (error) {
      return res.status(400).json({ status: "fail", message: error.message });
    }
  };


/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
export const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const existingCategory = await prisma.category.findUnique({
        where: { id: parseInt(id) }, 
      });
  
      if (!existingCategory) {
        return res.status(404).json({ status: "fail", message: "Expense not found" });
      }
  
      await prisma.category.delete({
        where: { id: parseInt(id) }, 
      });
  
      return res.status(204).json({ status: "success", data: null });
    } catch (error) {
      return res.status(400).json({ status: "fail", message: error.message });
    }
  };
  
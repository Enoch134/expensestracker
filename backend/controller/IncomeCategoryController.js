import prisma from "../db/prisma.js";


/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */


export const getAllIncomeCategory = async(req,res) =>{
    try {
		const incomes = await prisma.incomes.findMany();

		return res
			.status(200)
			.json({ status: "success", results: incomes.length, data: { incomes } });
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
export const getIncomeCategory = async (req, res) => {
    try {
      const incomes = await prisma.incomes.findUnique({
        where: { id: parseInt(req.params.id) },
      });
  
      if (incomes) {
        return res.status(200).json({ status: "success", data: { incomes } });
      } else {
        return res.status(404).json({ status: "fail", message: "Category not found" });
      }
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
export const createIncomeCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
  

      const incomes = await prisma.incomes.create({
        data: {
          name,
          description,
        },
      });
  
      return res.status(201).json({ status: "success", data: { incomes } });
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
  export const updateIncomeCategory = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const incomes = await prisma.incomes.update({
        where: { id: parseInt(id) }, 
        data: req.body,
      });
  
      return res.status(200).json({ status: "success", data: { incomes: incomes } });
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
export const deleteIncomeCategory = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const incomes = await prisma.incomes.findUnique({
        where: { id: parseInt(id) }, 
      });
  
      if (!incomes) {
        return res.status(404).json({ status: "fail", message: "Income Category not found" });
      }
  
      await prisma.incomes.delete({
        where: { id: parseInt(id) }, 
      });
  
      return res.status(204).json({ status: "success", data: null });
    } catch (error) {
      return res.status(400).json({ status: "fail", message: error.message });
    }
  };
  
import prisma from "../db/prisma.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */

export const CalculateBalance = async (req, res) => {
    try {
      // Calculate the start and end dates for the desired time period
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
      // Calculate total expenses within the time period
      const totalExpenses = await prisma.$queryRaw`
        SELECT SUM(amount) AS totalAmount
        FROM Expense
        WHERE expense_date >= ${startDate.toISOString()}
        AND expense_date <= ${endDate.toISOString()}
      `;
  
      // Calculate total income within the time period
      const totalIncome = await prisma.$queryRaw`
        SELECT SUM(amount) AS totalAmount
        FROM Income
        WHERE income_date >= ${startDate.toISOString()}
        AND income_date <= ${endDate.toISOString()}
      `;
  
      // Calculate the balance by subtracting expenses from income
      const balance = (totalIncome[0]?.totalAmount || 0) - (totalExpenses[0]?.totalAmount || 0);

      console.log('Balance:', balance);
  
      res.status(200).json({ status: 'success', data: { balance } });
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ status: 'fail', message: error.message });
    } finally {
      await prisma.$disconnect();
    }
  };
  
import prisma from "../db/prisma.js";


/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */


export const getAllIncome = async (req, res) => {
  try {
    const income = await prisma.income.findMany();

    return res
      .status(200)
      .json({ status: "success", results: income.length, data: { income } });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */


export const getIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const income = await prisma.income.findUnique({
      where: { id: parseInt(id) }, 
    });

    if (income) {
      return res.status(200).json({ status: "success", data: { income } });
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
export const createIncome = async (req, res) => {
  try {
    const { category_name, amount, income_date } = req.body;

    // Convert the income_date string to ISO-8601 DateTime format
    const isoDate = new Date(income_date).toISOString();

    const income = await prisma.income.create({
      data: {
        category_name,
        amount,
        income_date: isoDate, // Use the ISO-8601 DateTime format
      },
    });

    return res.status(201).json({ status: "success", data: { income } });
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
  export const totalIncomeForLastMonth = async (req, res) => {
    try {
        // Calculate the start and end dates for the last month
    const currentDate = new Date();
    const lastMonthStartDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const lastMonthEndDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    const totalIncomeForLastMonth = await prisma.$queryRaw`
        SELECT SUM(amount) AS totalAmount
        FROM Income
        WHERE income_date >= ${lastMonthStartDate.toISOString()}
        AND income_date <= ${lastMonthEndDate.toISOString()}
      `;
    
     
      const lastMonths = totalIncomeForLastMonth[0]?.totalAmount || 0;
      console.log(lastMonths);
  
      res.status(200).json({ status: "success", data: {lastMonths} });
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ status: "fail", message: error.message });
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
   export const totalIncomeForYesterday = async (req, res) => {
    try {
      const currentDate = new Date();
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1); // Subtract one day to get yesterday's date
  
      const totalIncomeForYesterday = await prisma.$queryRaw`
        SELECT SUM(amount) AS totalAmount
        FROM Income
        WHERE DATE(income_date) = ${yesterday.toISOString().slice(0, 10)}
      `;
  
      const yesterdayIncome = totalIncomeForYesterday[0]?.totalAmount || 0;
      console.log(yesterdayIncome);
  
      res.status(200).json({ status: "success", data: { yesterdayIncome } });
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ status: "fail", message: error.message });
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
  export const totalIncomePerMonth = async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      
      const totalIncomePerMonth = await prisma.$queryRaw`
        SELECT SUM(amount) AS totalAmount
        FROM Income
        WHERE YEAR(income_date) = ${currentYear}
        AND MONTH(income_date) = ${currentMonth}
      `;
  
      const perMonths = totalIncomePerMonth[0]?.totalAmount || 0;
      console.log(perMonths);
  
      res.status(200).json({ status: "success", data: {perMonths} });
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ status: "fail", message: error.message });
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
export const updateIncome = async (req, res) => {
    try {
      const { id } = req.params; 
  
  
      if (req.body.income_date) {
        req.body.income_date = new Date(req.body.income_date).toISOString();
      }
  
     
      const updatedIncome = await prisma.income.update({
        where: { id: parseInt(id) }, 
        data: req.body,
      });
  
      return res.status(200).json({ status: "success", data: { expense: updatedIncome } });
    } catch (error) {
      return res.status(400).json({ status: "fail", message: error.message });
    }
  };
  
  export const totalIncomePerDay = async (req, res) => {
    try {
      const totalIncomePerDay = await prisma.$queryRaw`
      SELECT SUM(amount) AS totalAmount
      FROM Income
      WHERE DATE(income_date) = CURDATE();
      `;
  
      const perDay = totalIncomePerDay[0]?.totalAmount || 0;
      console.log(perDay);
  
      res.status(200).json({ status: "success", data: {perDay} });
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ status: "fail", message: error.message });
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
export const deleteIncome = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const existingIncome= await prisma.income.findUnique({
        where: { id: parseInt(id) }, 
      });
  
      if (!existingIncome) {
        return res.status(404).json({ status: "fail", message: "Expense not found" });
      }
  
      await prisma.income.delete({
        where: { id: parseInt(id) }, 
      });
  
      return res.status(204).json({ status: "success", data: null });
    } catch (error) {
      return res.status(400).json({ status: "fail", message: error.message });
    }
  };


  export const totalIncome = async (req, res) => {
    try {
      // Calculate the start and end dates for the desired time period
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
      // Calculate total income within the time period
      const totalIncome = await prisma.$queryRaw`
        SELECT SUM(amount) AS totalAmount
        FROM Income
        WHERE income_date >= ${startDate.toISOString()}
        AND income_date <= ${endDate.toISOString()}
      `;
  
      // Calculate the balance by subtracting expenses from income
      const incomes = (totalIncome[0]?.totalAmount || 0);
  

      console.log('Total Income:', incomes);
    
  
      res.status(200).json({ status: 'success', data: { incomes } });
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ status: 'fail', message: error.message });
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
export const totalIncomeForYear = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const totalIncomeForYear = await prisma.$queryRaw`
        SELECT SUM(amount) AS totalAmount
        FROM Income
        WHERE YEAR(income_date) = ${currentYear}
      `;

    const forYears = totalIncomeForYear[0]?.totalAmount || 0
    console.log(forYears);

    res.status(200).json({ status: "success", data:{forYears} });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ status: "fail", message: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

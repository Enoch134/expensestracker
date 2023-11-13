import prisma from "../db/prisma.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */

export const getAllExpense = async (req, res) => {
  try {
    const expense = await prisma.expense.findMany();

    return res
      .status(200)
      .json({ status: "success", results: expense.length, data: { expense } });
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

export const getExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) }
    });

    if (expense) {
      return res.status(200).json({ status: "success", data: { expense } });
    } else {
      return res
        .status(404)
        .json({ status: "fail", message: "Expense not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ status: "fail", message: "An error occurred" });
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
export const createExpense = async (req, res) => {
  try {
    const { category_name, amount, expense_date } = req.body;

    if (!category_name || !amount || !expense_date) {
      // Check for required fields
      return res.status(400).json({ status: 'fail', message: 'All fields are required.' });
    }

    // Convert the expense_date string to ISO-8601 DateTime format
    const isoDate = new Date(expense_date).toISOString();

    const expense = await prisma.expense.create({
      data: {
        category_name,
        amount,
        expense_date: isoDate,
      },
    });

    return res.status(201).json({ status: 'success', data: { expense } });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
export const totalExpenseForLastMonth = async (req, res) => {
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

    const totalExpensesForLastMonth = await prisma.$queryRaw`
        SELECT SUM(amount) AS totalAmount
        FROM Expense
        WHERE expense_date >= ${lastMonthStartDate.toISOString()}
        AND expense_date <= ${lastMonthEndDate.toISOString()}
      `;
    
      const lastMonth = totalExpensesForLastMonth[0]?.totalAmount || 0
    console.log(lastMonth);

    res
      .status(200)
      .json({ status: "success", data:{ lastMonth} });
  } catch (error) {
    console.error("An error occurred:", error);
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
export const totalExpenseForYesterday = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
    
    
    let lastMonthYear = currentYear;
    let lastMonths = currentMonth - 1;
    
    if (lastMonth === 0) {

      lastMonthYear--;
      lastMonths = 12;
    }
    
    const totalExpensesLastMonth = await prisma.$queryRaw`
      SELECT SUM(amount) AS totalAmount
      FROM Expense
      WHERE YEAR(expense_date) = ${lastMonthYear}
      AND MONTH(expense_date) = ${lastMonths}
    `;

    const lastMonth = totalExpensesLastMonth[0]?.totalAmount || 0
    console.log( lastMonth);

    res.status(200).json({ status: "success", data: {lastMonth }});
  } catch (error) {
    console.error("An error occurred:", error);
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
export const totalExpensePerMonth = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    const totalExpensesPerMonth = await prisma.$queryRaw`
      SELECT SUM(amount) AS totalAmount
      FROM Expense
      WHERE YEAR(expense_date) = ${currentYear}
      AND MONTH(expense_date) = ${currentMonth}
    `;
    
    
    const perMonth = totalExpensesPerMonth[0]?.totalAmount || 0
    console.log(perMonth);

    res.status(200).json({ status: "success", data: {perMonth }});
  } catch (error) {
    console.error("An error occurred:", error);
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
export const totalExpenseForYear = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const totalExpensesForYear = await prisma.$queryRaw`
        SELECT SUM(amount) AS totalAmount
        FROM Expense
        WHERE YEAR(expense_date) = ${currentYear}
      `;

    const forYear = totalExpensesForYear[0]?.totalAmount || 0
    console.log(forYear);

    res.status(200).json({ status: "success", data:{forYear} });
  } catch (error) {
    console.error("An error occurred:", error);
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
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.expense_date) {
      req.body.expense_date = new Date(req.body.expense_date).toISOString();
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: req.body
    });

    return res
      .status(200)
      .json({ status: "success", data: { expense: updatedExpense } });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

export const totalExpensePerDay = async (req, res) => {
  try {
    const totalExpensesPerDay = await prisma.$queryRaw`
      SELECT SUM(amount) AS totalAmount
      FROM Expense
      WHERE DATE(expense_date) = CURDATE();
      `;

    const expensesPerDay = totalExpensesPerDay[0]?.totalAmount || 0;
    console.log(totalExpensesPerDay);

    res.status(200).json({ status: "success", data: { expensesPerDay } });
  } catch (error) {
    console.error("An error occurred:", error);
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
export const totalExpense = async (req, res) => {
  try {
    // Calculate the start and end dates for the desired time period
    const currentDate = new Date();
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Calculate total expenses within the time period
    const totalExpenses = await prisma.$queryRaw`
        SELECT SUM(amount) AS totalAmount
        FROM Expense
        WHERE expense_date >= ${startDate.toISOString()}
        AND expense_date <= ${endDate.toISOString()}
      `;

    // Calculate the balance by subtracting expenses from income
    const expenses = totalExpenses[0]?.totalAmount || 0;

    console.log("Exp:", expenses);

    res.status(200).json({ status: "success", data: { expenses } });
  } catch (error) {
    console.error("An error occurred:", error);
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
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const existingExpense = await prisma.expense.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingExpense) {
      return res
        .status(404)
        .json({ status: "fail", message: "Expense not found" });
    }

    await prisma.expense.delete({
      where: { id: parseInt(id) }
    });

    return res.status(204).json({ status: "success", data: null });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

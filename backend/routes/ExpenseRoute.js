import Express  from "express";
import {
    getAllExpense,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    totalExpensePerDay,
    totalExpensePerMonth,
    totalExpenseForYesterday,
    totalExpenseForLastMonth,
    totalExpenseForYear,
    totalExpense,

} from "../controller/ExpenseController.js"

const router = Express.Router()


router.get("/expense", getAllExpense )
router.get("/totalExpense", totalExpense )
router.get("/expenseTotal", totalExpensePerDay )
router.get("/expenseTotalMonth", totalExpensePerMonth )
router.get("/expenseTotalYesterday", totalExpenseForYesterday )
router.get("/expenseTotalLastMonth", totalExpenseForLastMonth )
router.get("/expenseTotalYear", totalExpenseForYear )
router.post("/expense", createExpense )
router.get("/expense/:id", getExpense )
router.patch("/expense/:id", updateExpense )
router.delete("/expense/:id", deleteExpense )

export default router
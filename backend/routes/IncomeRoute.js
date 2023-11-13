import Express  from "express";
import {
    getAllIncome,
    getIncome,
    createIncome,
    updateIncome,
    deleteIncome,
    totalIncomePerDay,
    totalIncomePerMonth,
    totalIncomeForYesterday,
    totalIncomeForLastMonth,
    totalIncome,
    totalIncomeForYear
} from "../controller/IncomeController.js"

const router = Express.Router()


router.get("/income", getAllIncome )
router.get("/incomeForYear", totalIncomeForYear )
router.get("/totalIncome", totalIncome )
router.get("/incomePerDay", totalIncomePerDay )
router.get("/incomePerMonth", totalIncomePerMonth )
router.get("/incomeForYesterday", totalIncomeForYesterday )
router.get("/incomeForLastMonth", totalIncomeForLastMonth )
router.post("/income", createIncome )
router.get("/income/:id", getIncome )
router.patch("/income/:id", updateIncome )
router.delete("/income/:id", deleteIncome )

export default router
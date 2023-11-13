import Express  from "express";
import {
    deleteIncomeCategory,
    getIncomeCategory,
    createIncomeCategory,
    updateIncomeCategory,
    getAllIncomeCategory
} from "../controller/IncomeCategoryController.js"

const router = Express.Router()


router.get("/incomeCategory", getAllIncomeCategory )
router.post("/incomeCategory", createIncomeCategory )
router.get("/incomeCategory/:id", getIncomeCategory )
router.patch("/incomeCategory/:id", updateIncomeCategory )
router.delete("/incomeCategory/:id", deleteIncomeCategory )

export default router
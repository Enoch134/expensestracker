import Express  from "express";
import {
    deleteCategory,
    getCategory,
    createCategory,
    updateCategory,
    getAllCategory
} from "../controller/CategoryController.js"

const router = Express.Router()


router.get("/expenseCategory", getAllCategory )
router.post("/expenseCategory", createCategory )
router.get("/expenseCategory/:id", getCategory )
router.patch("/expenseCategory/:id", updateCategory )
router.delete("/expenseCategory/:id", deleteCategory )

export default router
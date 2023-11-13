import Express  from "express";
import {
    CalculateBalance,
} from "../controller/BalanceController.js"

const router = Express.Router()


router.get("/calculateBalance", CalculateBalance )


export default router
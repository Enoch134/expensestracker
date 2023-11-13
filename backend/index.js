import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'

import ExpenseRoute from './routes/ExpenseRoute.js'
import CategoryRoute from './routes/CategoryRoute.js'
import IncomeRoute from './routes/IncomeRoute.js'
import IncomeCategory from './routes/IncomeCategoryRoute.js'
import BalanceRoute from './routes/BalanceRoute.js'

const app = express()

dotenv.config()

const port = 5000

app.use(express.json());
app.use(express.static('./public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors({
        credentials: true,
        origin: `http://localhost:3000`
    }));
    


// app.get('/', (req, res) =>{
//     res.send('hello world')
// })
app.use(ExpenseRoute)
app.use(CategoryRoute)
app.use(IncomeRoute)
app.use(IncomeCategory)
app.use(BalanceRoute)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port:${PORT}`));

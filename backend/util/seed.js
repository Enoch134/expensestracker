import prisma from "../db/prisma.js";

async function main() {
    // Create a new expense
    const newExpense = await prisma.expense.create({
      data: {
        category_name: 'Groceries',
        amount: '50.00',
        expense_date: new Date(),
      },
    });
  
    console.log('Created expense:', newExpense);
  
    // Retrieve all expenses
    const expenses = await prisma.expense.findMany();
    console.log('All expenses:', expenses);
  }
  
  main()
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

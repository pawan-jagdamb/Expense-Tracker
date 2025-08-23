const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Expense = require("./models/expense");

const app = express();
const port = 8000;

// Middleware for Android connectivity
app.use(cors({
  origin: '*', // Allow all origins for Android development
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database connection
mongoose.connect("mongodb+srv://pawankumar9534078:ExpenseTracker@cluster0.fbu6mr0.mongodb.net/", {
  useNewUrlParser: true,
  
})
.then(() => {
  console.log("✅ Database connected successfully");
})
.catch(err => {
  console.error("❌ Error connecting to MongoDB:", err);
});

// Health check endpoint for Android
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running and ready for Android",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Create expense endpoint (for Android)
app.post("/expenses", async (req, res) => {
  try {
    const { type, description, account, category, amount, date, note, day } = req.body;

    // Basic validation for Android
    if (!type || !account || !category || !amount || !date || !day) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Validate amount
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid positive number"
      });
    }

    const newExpense = new Expense({
      type,
      description: description || '',
      account,
      category,
      amount: parseFloat(amount),
      date,
      note: note || '',
      day
    });

    await newExpense.save();

    console.log(`Expense created: ${type} - ${amount} - ${category}`);

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense: newExpense
    });

  } catch (error) {
    console.error("❌ Error creating expense:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating expense",
      error: error.message
    });
  }
});


app.get('/expenses', async (req, res) => {
  try {
    const {date, type, category} = req.query;
    
    // Build filter object
    const filter = {};
    if (date) filter.date = date;
    if (type) filter.type = type;
    if (category) filter.category = category;

    const expenses = await Expense.find(filter).sort({ timeStamp: -1 });

    // If no date filter, it means we want all expenses (for accounts screen)
    if (!date) {
      console.log(`✅ Retrieved ${expenses.length} all expenses for accounts`);
    } else {
      console.log(`✅ Retrieved ${expenses.length} expenses for date: ${date}`);
    }

    return res.status(200).json({
      success: true,
      data: expenses,
      count: expenses.length
    });
  } catch (error) {
    console.error('❌ Error getting expenses:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting expenses'
    });
  }
});

app.get("/allExpenses",async(req,res) => {
  try{
    console.log("backend hit");
    const expenses = await Expense.find({});
   return res.status(200).json(expenses);
  } catch(error){
    console.log("Error",error);
    return res.status(500).json({error:"Error getting expenses"})
  }
})






// Start server
app.listen(port, () => {
  console.log(`🚀 Android Backend Server running on port ${port}`);
  console.log(`📱 Health check: http://localhost:${port}/health`);
  console.log(`💾 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`🔗 For Android Emulator use: http://10.0.2.2:${port}`);
  console.log(`🔗 For Physical Device use your computer's IP address`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n Shutting down Android server...');
  mongoose.connection.close(() => {
    console.log(' Database connection closed');
    process.exit(0);
  });
});
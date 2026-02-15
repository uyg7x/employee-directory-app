// 1️⃣ IMPORTS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 2️⃣ DATABASE CONNECTION
mongoose.connect("mongodb://127.0.0.1:27017")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 3️⃣ SCHEMA + MODEL
const employeeSchema = new mongoose.Schema({
    employeeId: String,
    fullName: String,
    email: String,
    phone: String,
    department: String,
    salary: Number,
    joiningDate: {
        type: Date,
        default: Date.now
    }
});

const Employee = mongoose.model("Employee", employeeSchema);

// 4️⃣ ADD EMPLOYEE API
app.post("/add-employee", async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.json({ message: "Employee Added Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Adding Employee" });
    }
});


// 🔽 🔽 🔽 PUT SEARCH API HERE 🔽 🔽 🔽
async function searchEmployee() {
    const name = document.getElementById("searchName").value.trim();
    const employeeId = document.getElementById("searchId").value.trim();

    const params = new URLSearchParams();

    if (name) {
        params.append("name", name);
    }

    if (employeeId) {
        params.append("employeeId", employeeId);
    }

    const response = await fetch(`http://localhost:5000/search?${params.toString()}`);
    const resultDiv = document.getElementById("result");

    if (response.status === 404) {
        resultDiv.innerHTML = "<p>Employee Not Found</p>";
        return;
    }

    const data = await response.json();

    resultDiv.innerHTML = `
        <p><b>ID:</b> ${data.employeeId}</p>
        <p><b>Name:</b> ${data.fullName}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p><b>Department:</b> ${data.department}</p>
        <p><b>Salary:</b> ₹${data.salary}</p>
    `;
}


app.get("/search", async (req, res) => {
    try {
        const { name, employeeId } = req.query;

        let query = {};

        if (name) {
            query.fullName = { $regex: name, $options: "i" };
        }

        if (employeeId) {
            query.employeeId = employeeId;
        }

        if (!name && !employeeId) {
            return res.status(400).json({ message: "Enter name or employee ID" });
        }

        const employee = await Employee.findOne(query);

        if (!employee) {
            return res.status(404).json({ message: "Employee Not Found" });
        }

        res.json(employee);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

app.get("/", (req, res) => {
    res.send("Employee Management Server is Running 🚀");
});

// 6️⃣ START SERVER (ALWAYS LAST)
app.listen(5000, () => console.log("Server running on port 5000"));

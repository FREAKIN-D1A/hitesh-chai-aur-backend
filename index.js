require("dotenv").config();
import express from "express";

// Create an Express application
const app = express();

// Define a route for the root path ('/')
app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.get("/twitter", (req, res) => {
	res.send("<H1>Hello, twitter!</H2>");
});

// Specify the port number (e.g., 3000)
const port = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

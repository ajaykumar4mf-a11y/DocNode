import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";


//app configuration
const app = express();
const port = process.env.PORT || 9000;

// Connect to MongoDB
connectDB();

//middlewares
app.use(cors());  //allows to connect to the backend from the frontend
app.use(express.json());


//api endpoints
app.get("/", (req, res) => res.send("API is running!"));

app.listen(port, () => console.log(`listening on localhost:${port}`));
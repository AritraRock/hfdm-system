import { configDotenv } from "dotenv";
import connectDB from "./db/db.js";


configDotenv({
    path: './.env'
})

connectDB()
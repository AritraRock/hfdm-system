import { configDotenv } from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";


configDotenv({
    path: './.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is running at port:${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed!!!",err);
})
import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from'bcrypt'

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['manager', 'pantry', 'delivery'],
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String
        },
        refreshToken: {
            type: String,
        }
    }
);

// Pre-populate testing users
// userSchema.statics.seedTestUsers = async function () {
//     const testUsers = [
//         {
//             email: "hospital_manager@xyz.com",
//             password: "Password@2025",
//             role: "manager",
//             name: "Hospital Manager"
//         },
//         {
//             email: "hospital_pantry@xyz.com",
//             password: "Password@2025",
//             role: "pantry",
//             name: "Pantry Staff"
//         },
//         {
//             email: "hospital_delivery@xyz.com",
//             password: "Password@2025",
//             role: "delivery",
//             name: "Delivery Personnel"
//         }
//     ];

//     for (const user of testUsers) {
//         const existingUser = await this.findOne({ email: user.email });
//         if (!existingUser) {
//             await this.create(user);
//         }
//     }
// };

userSchema.pre("save", async function(next) {
    if(this.isModified("password")) this.password= await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);

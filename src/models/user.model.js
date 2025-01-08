import mongoose, { Schema } from "mongoose";

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

export const User = mongoose.model("User", userSchema);

import mongoose, { Schema } from "mongoose";

const patientSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        diseases: {
            type: [String],
            default: []
        },
        allergies: {
            type: [String],
            default: []
        },
        roomNumber: {
            type: String,
            required: true
        },
        bedNumber: {
            type: String,
            required: true
        },
        floorNumber: {
            type: Number,
            required: true
        },
        age: {
            type: Number,
            required: true,
            min: 0
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true
        },
        contactInfo: {
            phone: {
                type: String,
                required: true
            },
            email: {
                type: String,
                lowercase: true,
                match: [/.+\@.+\..+/, "Please enter a valid email"]
            }
        },
        emergencyContact: {
            name: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            relation: {
                type: String,
                required: true
            }
        },
        address: {
            type: String,
            required: true
        }
    }, 
    { timestamps: true}
);

export const Patient = mongoose.model("Patient", patientSchema);

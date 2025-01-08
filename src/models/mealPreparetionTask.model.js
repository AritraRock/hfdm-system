import mongoose, { Schema } from "mongoose";

const mealPreparationTaskSchema = new Schema(
    {
        dietChartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DietChart',
            required: true
        },
        mealType: {
            type: String,
            enum: ['Morning', 'Evening', 'Night'],
            required: true
        },
        assignedPantryStaff: {
            staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PantryStaff',
            required: true
            },
            name: String,
            contact: String
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed'],
            default: 'Pending'
        },
        startTime: {
            type: Date,
            default: Date.now
        },
        endTime: {
            type: Date
        }
    },
    { timestamps: true}
);

export const MealPreparationTask = mongoose.model("MealPreparationTask", mealPreparationTaskSchema);

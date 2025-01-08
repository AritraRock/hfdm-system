import mongoose, { Schema } from "mongoose";

const dietChartSchema = new Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true
        },
        meals: {
            morning: {
            items: [
                {
                name: String,
                quantity: String
                }
            ],
            instructions: String
            },
            evening: {
            items: [
                {
                name: String,
                quantity: String
                }
            ],
            instructions: String
            },
            night: {
            items: [
                {
                name: String,
                quantity: String
                }
            ],
            instructions: String
            }
        }
    },
    {timestamps:true}
);

export const DietChart = mongoose.model("DietChart", dietChartSchema);

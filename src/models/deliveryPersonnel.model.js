import mongoose, { Schema } from "mongoose";

const deliveryPersonnelSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    }, 
    { timestamps: true}
);

export const DeliveryPersonnel = mongoose.model("DeliveryPersonnel", deliveryPersonnelSchema);

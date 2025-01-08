import mongoose, { Schema } from "mongoose";

const mealDeliveryTaskSchema = new Schema(
  {
    preparationTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MealPreparationTask',
      required: true
    },
    assignedDeliveryPersonnel: {
      personnelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPersonnel',
        required: true
      },
      name: String,
      contact: String
    },
    deliveryStatus: {
      type: String,
      enum: ['Pending', 'Out for Delivery', 'Delivered'],
      default: 'Pending'
    },
    deliveryNotes: String,
    timestamp: {
      assignedAt: {
        type: Date,
        default: Date.now
      },
      deliveredAt: {
        type: Date
      }
    },
  },
  {timestamps:true}
);

export const MealDeliveryTask = mongoose.model("MealDeliveryTask", mealDeliveryTaskSchema);

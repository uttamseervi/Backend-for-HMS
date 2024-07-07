import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema({
    serviceType: {
        type: String,
        required: true
    },
    serviceDescription: {
        type: String,
        required: true,
    },
    servicePrice: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    serviceImage: {
        type: String,
        required: true,
    },
    requestedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null, // Default value if not requested by a user
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create index on serviceType for faster querying
serviceSchema.index({ serviceType: 1 });

const Service = mongoose.model("Service", serviceSchema);
export default Service;

import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema({
    roomType: {
        type: String,
        required: true,
        enum: ['Presidential Suite', 'Luxury Suite', 'Premium Room'], // Example of enum for room types
    },
    roomImage: {
        type: String,
        required: true
    },
    roomInfo: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true,
        min: [0, 'Cost cannot be negative'], // Ensures cost is not negative
    },
    allocatedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null, // Default value if the room is not allocated
    },
    checkInTime: {
        type: Date,
        default: null, // Default value if not set
    },
    checkOutTime: {
        type: Date,
        default: null, // Default value if not set
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Add an index on roomType for faster queries
roomSchema.index({ roomType: 1 });

const Room = mongoose.model("Room", roomSchema);
export default Room;

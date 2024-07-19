import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
    cost: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    roomId:{
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    cardType: {
        type: String,
        required: true,
    },
    cardNumber: {
        type: String,
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
    year:{
        type: String,
        required: true,
    },
    cardCvv: {
        type: String,
        required: true,
    },
    
},{
    timestamps: true,
})

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
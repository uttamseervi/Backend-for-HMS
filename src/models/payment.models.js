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
    amount: {
        type: Number,
        required: true
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
    }
})

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
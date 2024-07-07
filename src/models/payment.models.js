import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
    cost:{
        type:Schema.Types.ObjectId,
        ref:'Room'
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

const Payment = mongoose.model('Payment',paymentSchema);
export default Payment;
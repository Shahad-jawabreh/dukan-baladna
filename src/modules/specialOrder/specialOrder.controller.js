import specialModel from "../../../DB/model/specialorder.model.js";

export const addspecialOrder =async (req,res)   => {
    try {
        const orderData = req.body; // Get order data
        const newOrder = new specialModel(orderData); // Create a new order from model
        const savedOrder = await newOrder.save(); // Save the order in database
        console.log(savedOrder);
        res.status(201).json({ message: 'تم إرسال الطلب بنجاح' , orderId:savedOrder._id}); // success response and orderId
    } catch (error) {
       console.error("Error sending the order: ", error);
       res.status(500).json({ error: 'حدث خطأ أثناء إرسال الطلب' }); // error response
   }
} 

export const getspecialOrder = async(req, res) => {
    const sp = await specialModel.find({userId : req.user._id});
    if(!sp){
        return res.status(400).json(sp)

    }
    return res.json(sp)
}
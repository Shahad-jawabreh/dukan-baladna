import couponModel from "../../../DB/model/coupon.model.js";


export const create =async (req,res,next)=>{
    const {name,amount,expireDate} = req.body ;
    if((await couponModel.find({name})).length) {
        return res.json({massege : "this coupon is already exists"})
    }
    req.body.expireDate = new Date(expireDate);
    req.body.createdBy = req.user._id ;
    if(req.body.expireDate < new Date()) { 
        return res.json({massege : "coupon expired"})
    }
    const coupon = await couponModel.create(req.body);
    return res.json({massege : coupon})

}

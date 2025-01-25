import couponModel from "../../../DB/model/coupon.model.js";


export const create = async (req, res, next) => {
    const { name, amount, expireDate, couponType } = req.body;
  
      if (!name || !couponType || !expireDate) {
          return res.json({ message: "Missing required fields: name, couponType, expireDate" });
      }
    if ((await couponModel.find({ name })).length) {
      return res.json({ message: "this coupon is already exists" });
    }
      req.body.expireDate = new Date(expireDate);
      req.body.createdBy = req.user._id;
  
      if (req.body.expireDate < new Date()) {
          return res.json({ message: "coupon expired" });
      }
  
  
       if (couponType === 'fixed' || couponType === 'percentage') {
          if (!amount || isNaN(amount) || amount <= 0) {
              return res.json({ message: "Invalid coupon amount, must be a positive number" });
          }
         req.body.amount = parseInt(amount);
          } else if (couponType === 'freeDelivery') {
              req.body.amount = 0
          } else {
              return res.json({ message: "Invalid coupon type" });
          }
  
      const coupon = await couponModel.create(req.body);
      return res.json({ message: coupon });
  };
  // Assuming you have your coupon model set up as "couponModel"

// Get Coupons
export const getMyCoupons = async (req, res, next) => {
    try {
        const userId = req.user._id; // Assuming you have user object from middleware
      const coupons = await couponModel.find({ createdBy: userId }).lean();
         return res.status(200).json({ message: "Coupons fetched successfully", coupons });
    } catch (error) {
      return res.status(500).json({message: "Failed to fetch coupons"});
    }
};


// Edit Coupon
export const updateCoupon = async (req, res, next) => {
    try {
      const couponId = req.params.couponId;
      const userId = req.user._id;
      const { name, amount, expireDate, couponType } = req.body;

      const coupon = await couponModel.findById(couponId);
      if (!coupon) {
          return res.status(404).json({message: "Coupon not found"});
      }
     if(coupon.createdBy.toString() !== userId.toString()){
        return res.status(401).json({message: "Unauthorized"});
     }
     if(expireDate){
         req.body.expireDate = new Date(expireDate);
           if (req.body.expireDate < new Date()) {
           return res.json({ message: "coupon expired" });
            }
     }


        if (couponType === 'fixed' || couponType === 'percentage') {
            if (!amount || isNaN(amount) || amount <= 0) {
                return res.json({ message: "Invalid coupon amount, must be a positive number" });
            }
            req.body.amount = parseFloat(amount);
        } else if (couponType === 'freeDelivery') {
           req.body.amount = 0
        } else {
            return res.json({ message: "Invalid coupon type" });
        }
        const updatedCoupon = await couponModel.findByIdAndUpdate(
            couponId,
          req.body,
         {new:true}
        ).lean();

        return res.status(200).json({ message: "Coupon updated successfully" , coupon: updatedCoupon });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update coupon" });
    }
};

export const deleteCoupon = async(req, res) => {
    const coupon = req.params.couponId ;
    const updatedCoupon = await couponModel.findOneAndDelete({_id : coupon});
    if(!updatedCoupon) { 
        return res.status(400).json({message:"error"})
    }
    return res.status(200).json({message : "success"})
}

// API endpoint to apply coupon
export const applyCoupon = async (req, res, next) => {
    const { couponCode, createdBy, userId } = req.body;
   try {
      const coupon = await couponModel.findOne({ name: couponCode }).lean();

         if (!coupon) {
            return res.status(404).json({ message: "هذا الكوبون غير موجود" });
           }

        if (coupon.expireDate < new Date()) {
           return res.status(400).json({ message: "الكوبون انتهت صلاحيتة" });
      }
      await couponModel.findByIdAndUpdate(
        { _id: coupon._id },
        {
            $addToSet: {
                usedBy: { id: userId },
            },
        }
    );
      console.log(createdBy.toString());
      console.log(coupon);
      if(coupon.createdBy.toString() !== createdBy.toString()){
           return res.status(400).json({ message: "هذا الكوبون غير صالح لهذا الطباخ" });
        }

       if(coupon.usedBy.filter(obj => obj.userId == userId).length == 0){
         coupon.usedBy.push({userId : userId, userName: req.user.userName})
        coupon.usageCount +=1;
        await couponModel.findByIdAndUpdate(coupon._id, coupon)
       }else {
        return res.status(200).json({ message: "الكوبون صالح للاستخدام مرة واحدة فقط.", coupon: coupon });
       }

      return res.status(200).json({ message: "تم تطبيق الكوبون بنجاح", coupon: coupon });

    } catch (error) {
      return res.status(500).json({ message:error.message });
   }
};
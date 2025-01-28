import systemModel from "../../../DB/model/system.model.js";

export const getCommission = async (req, res) => {
    const { role } = req.user;
    const commission = await systemModel.find();

    if (commission.length > 0) {
            return res.json(commission[0]); 
    } else {
        return res.status(404).json({ message: 'Commission data not found' });
    }
};

// دالة تحديث العمولة
export const updateCommission = async (req, res) => {
    try {
        const updates = {}; 

        if (req.body.cookCommission) {
            updates.cookCommission = req.body.cookCommission;
            
        }
        if (req.body.driverCommission) {
            updates.driverCommission = req.body.driverCommission;
        }

        
        if (Object.keys(updates).length > 0) {
            const commission = await systemModel.findOneAndUpdate(
                {},
                { $set: updates }, // التحديثات
                { new: true } // إعادة السجل المعدل
            );
            return res.json(commission); // إرجاع السجل المعدل
        } else {
            return res.status(400).json({ message: 'No commission data provided to update' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error updating commission', error: error.message });
    }
};

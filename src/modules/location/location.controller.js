import locationModel from "../../../DB/model/location.model.js";

export const storeLocation = async (req , res) => {
    const {longitude, latitude , userId} = req.body ;
    const location = await locationModel.create({longitude, latitude , userId});
    if(!location)  {
        return res.json({massege : "error"});
    }
    return res.status(200).json({massege : "store location successfully"})

}
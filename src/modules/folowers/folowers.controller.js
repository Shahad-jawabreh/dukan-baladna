import folowingModel from "../../../DB/model/folow.model.js";
import userModel from "../../../DB/model/user.model.js";



export const addUser = async(req,res)=>{
    try {
        const cookerId = req.params.cookerId;
        const {userId, userName} = req.body;
    
            // Check if cooker exist
          const cooker = await userModel.findById(cookerId);
            if (!cooker) {
                return res.status(404).json({ message: 'Cooker not found' });
          }
    
          let follow = await folowingModel.findOne({salerId : cookerId});
    
            if(follow){
                  if(follow.folowers.some((folower) => folower.userId.toString() === userId)){
                     return res.status(400).json({ message: 'User already exist in followers' });
                  }
                  follow.folowers.push({
                      userId : userId,
                       userName : userName
                   })
                await  follow.save();
            }else{
                 follow = new folowingModel({
                   salerId : cookerId,
                    salerName : cooker.userName,
                     folowers : [{
                      userId : userId,
                       userName : userName
                     }]
                })
                  await follow.save();
            }
          res.status(200).json({ message: 'User added to followers successfully.' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error', error });
        }
}

export const getCookers = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming req.user is set by your authentication middleware
          if(!userId){
              return res.status(400).json({message: "userId is required"});
          }
        // Find all follow documents where the user ID exists in the followers array
      const followingRecords = await folowingModel.find({
        'folowers.userId': userId,
      }).populate("salerId");

        if (!followingRecords || followingRecords.length === 0) {
           return res.status(200).json({ message: "No cookers followed by the user.", following: [] });
          }


       const cookers = followingRecords.map((record) => (
          {
              _id : record.salerId._id,
             userName : record.salerId.userName,
             image : record.salerId.image,
           }
       ) );

      res.status(200).json({ message: 'Successfully retrieved cookers.', cookers: cookers});

    } catch (error) {
        console.error('Error getting following cookers:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
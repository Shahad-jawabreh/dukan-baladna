import notificationModel from "../../../DB/model/notification.model.js";
import userModel from "../../../DB/model/user.model.js";


export const createNotification =async (req,res,next)=>{
try {
    const { sender, receiver, type, title, body } = req.body;

    // Validate request body
    if (!sender || !receiver || !type || !title ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
     
    const senderID = await userModel.findById(sender);
    const senderImage = senderID?.image?.secure_url
    // Create and save notification
    const notification = await notificationModel.create({
      sender:senderID.userName,
      receiver,
      type,
      title,
      body,
      senderImage
    });

    
    res.status(200).json({ message: 'Notification saved successfully.', notification });
  } catch (error) {
    console.error('Error saving notification:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export const updateStatus = async (req, res) => {
  console.log('ll');
    const {status} = req.body ;
    const { id} = req.params ;
    console.log(id, status);

    const not = await notificationModel.findByIdAndUpdate(
      id, 
      { status: status },  
      { new: true }       
    );    if(not) { 
      return res.status(200).json({ message: not})
    }
    return res.status(400).json({ message: "error"})
}
export const getNotification = async (req, res, next) => {
  try {
    const { _id } = req.user; 
    const user = await userModel.findById(_id);
    const result = [];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userGroup = user.role; // Assuming user has a `group` field (e.g., "buyer", "saler")

    // Fetch all notifications
    const notifications = await notificationModel.find();
     console.log(notifications);
    // Filter notifications
     notifications.filter((notification) => {
      if (notification.type == "individual") {
            if(notification.receiver == _id){
                result.push(notification);
            }
      } else if (notification.type == "general") {
          if( notification.receiver == userGroup) {
             result.push(notification);
          }
      }
      return null; // Exclude unknown notification types
    });

    res.status(200).json({
      success: true,
      notifications: result,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

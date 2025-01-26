import subscriptionsModel from "../../../DB/model/Subscription .model.js";

export const addSubscribe =async (req,res)   => {
    try {
        const { chef, meal, schedule, notes, time, day,selectedSize } = req.body;
        const cookId = chef;
   
        const customerId = req.user._id ;// Assuming user ID is available from the authentication middleware
         const customerName = req.user.name; // Assuming user name is available from the authentication middleware

        
           let price = meal.price ;

      if (selectedSize && selectedSize.price) {
            price = selectedSize.price;
        }

   
       // Create the new subscription document
        const newSubscription = new subscriptionsModel({
         customerId,
         cookId,
         customerName,
         meal: meal.name,
         price,
          schedule: [{
              schadule: schedule,
              day : day,
              time : [{hour: time.hour, min: time.minute}]
          }],
            note: notes,
       });
        
       // Save the subscription to the database
       const savedSubscription = await newSubscription.save();

        // Return a success response with the created subscription
       res.status(201).json({
           message: 'Subscription created successfully!',
           subscription: savedSubscription,
       });
   } catch (error) {
       console.error('Error creating subscription:', error);
       res.status(500).json({
           message: 'Failed to create subscription.',
            error: error.message,
       });
   }
}
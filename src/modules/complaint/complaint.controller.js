import complaintModel from "../../../DB/model/complaint.model.js";
import userModel from "../../../DB/model/user.model.js";



export const create = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { subject, details } = req.body;

        const existingComplaint = await complaintModel.findOne({
            user: userId,
            subject: subject,
        });

        if (existingComplaint) {
            return res.status(400).json({ message: "You already have a complaint with the same subject." });
        }
        const user = await userModel.findById(userId);
        const { email, userName } = user;

        await complaintModel.create({ userName, email, user: userId, subject, details });

        return res.status(200).json({ message: "Complaint created successfully." });
    } catch (error) {
        next(error);
    }
};


export const getAllComplaints = async (req, res, next) => {
    try {
        // Fetch all complaints from the database
        const complaints = await complaintModel.find();

        // Return the list of complaints as a JSON response
        return res.status(200).json({ complaints });
    } catch (error) {
        next(error); // Pass errors to the error handler middleware
    }
};

export const getComplaintById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const complaints = await complaintModel.findById(id);

        return res.status(200).json({ complaints });
    } catch (error) {
        next(error); // Pass errors to the error handler middleware
    }
};
import CookProfit from "./../../../DB/model/cookprofit.model.js";

// Add a new cook profit entry
exports.addCookProfit = async (req, res) => {
  try {
    const { cookId, orderId, totalProfit } = req.body;

    if (!cookId || !orderId || !totalProfit) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const profitEntry = new CookProfit({ cookId, orderId, totalProfit });
    await profitEntry.save();

    res.status(201).json({ message: "Cook profit entry saved successfully!", profitEntry });
  } catch (error) {
    res.status(500).json({ message: "Error saving cook profit entry", error });
  }
};

// Get profits for a specific cook
exports.getCookProfits = async (req, res) => {
  try {
    const { cookId } = req.params;

    const profits = await CookProfit.find({ cookId }).populate("orderId", "finalPrice timestamp");

    if (!profits.length) {
      return res.status(404).json({ message: "No profits found for this cook" });
    }

    res.status(200).json({ cookId, profits });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cook profits", error });
  }
};

// Get total profits for all cooks
exports.getTotalProfits = async (req, res) => {
  try {
    const profits = await CookProfit.aggregate([
      { $group: { _id: "$cookId", totalProfit: { $sum: "$totalProfit" } } },
      { $lookup: { from: "cooks", localField: "_id", foreignField: "_id", as: "cookDetails" } },
      { $unwind: "$cookDetails" },
      { $project: { cookId: "$_id", totalProfit: 1, cookName: "$cookDetails.name" } },
    ]);

    res.status(200).json({ profits });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total profits", error });
  }
};

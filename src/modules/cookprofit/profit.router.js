import Router from 'express'
const router = Router();
import * as cookProfitController from './profit.controller.js'

// Routes
router.post("/", cookProfitController.addCookProfit); // Add a new cook profit entry
router.get("/:cookId", cookProfitController.getCookProfits); // Get profits for a specific cook
router.get("/", cookProfitController.getTotalProfits); // Get total profits for all cooks

module.exports = router;

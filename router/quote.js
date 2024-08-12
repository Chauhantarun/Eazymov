import express from "express";
import {
  deleteQuote,
  getQuoteById,
  getQuotes,
  newQuote,
  updateQuoteStatus,
} from "../controller/quote.js";
const router = express.Router();

router.post("/newquote", newQuote);
router.get("/allquote", getQuotes);
router.get("/singlequery/:id", getQuoteById);
// router.put("/updatequery/:id", updateQuote);
router.put("/updatestatus/:id", updateQuoteStatus);
router.delete("/deletequery/:id", deleteQuote);

export default router;

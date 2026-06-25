import express from "express";
import { getPayHereHash } from "../controller/paymentController.js";

const router = express.Router();

router.post("/payhere-hash", getPayHereHash);

export default router;

//this file will house endpoints related to authentication
import express from "express";
const router = express.Router();

router.get("/signup", (req, res) => {
  res.send("signup endpoint");
});

export default router;

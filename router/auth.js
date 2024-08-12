import express from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  loginController,
  newUser,
  updateProfile,
} from "../controller/auth.js";
import { isAdmin, isAdmin2, requireSignIn } from "../middleware/auth.js";

const router = express.Router();

router.post("/newuser", newUser);
router.post("/login", loginController);
router.get("/allusers", getAllUsers);
router.put("/updateprofile/:_id", updateProfile);
router.delete("/deleteuser/:_id", deleteUser);
router.get("/singleuser/:_id", getSingleUser);

router.get("/dashboard-admin", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/dashboard-admin2", requireSignIn, isAdmin2, (req, res) => {
  res.send({ ok: true });
});

export default router;

const { Router } = require("express");
const { userRegistration, updateProfile, getAllUsers, deleteUser, getCounts } = require("../controllers/user.controller.js");

const router = Router();

router.route("/register").post(userRegistration);
router.route("/updateprofile/:id").put(updateProfile);
router.route("/allusers").get(getAllUsers);
router.route("/delete/:id").delete(deleteUser);
router.route("/getcounts").get(getCounts);

module.exports = router;

import express, { Router } from "express";

const router: Router = express.Router();

router.use('/users', require("./Users/Users")());
router.use('/task', require("./Task/Task")());
router.use('/notification', require("./Notification/Notification")());

module.exports = router;
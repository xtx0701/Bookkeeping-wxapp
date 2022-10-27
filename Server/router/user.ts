import express from "express";
import { login, getUserBillMessage, clearBudget, adminLogin, getUserMessage, deleteUser, getUserLeaving } from "../router_handler/user";

// 创建路由
const router: any = express.Router();
// 挂载接口
router.post("/login", login);
router.post("/getUserBillMessage", getUserBillMessage);
router.post("/clearBudget", clearBudget);
router.post("/adminLogin", adminLogin);
router.post("/getUserMessage", getUserMessage);
router.post("/deleteUser", deleteUser);
router.get("/getUserLeaving", getUserLeaving);
export default router;
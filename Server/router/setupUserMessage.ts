import express from "express";
import { setupUserBudget, resetUserExpendIncome, userClock, checkUserClock, addTotalNumBill } from "../router_handler/setupUserMessage"
// 创建路由
const router: any = express.Router();
// 挂载接口
router.post("/setupUserBudget", setupUserBudget);
router.get("/resetUserExpendIncome", resetUserExpendIncome);
router.post("/userClock", userClock);
router.post("/checkUserClock", checkUserClock);
router.post("/addTotalNumBill", addTotalNumBill);
export default router;
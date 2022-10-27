import express from "express";
import { initUserBillData, getUserBillData, getUserYearBillData } from "../router_handler/userChart";

// 创建路由
const router: any = express.Router();
// 挂载接口
router.post("/initUserBillData", initUserBillData);
router.post("/getUserBillData", getUserBillData);
router.post("/getUserYearBillData", getUserYearBillData);
export default router;
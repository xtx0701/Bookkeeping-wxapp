import express from "express";
import { setupUserBillData, requestUserBillData, setUserLeaving } from "../router_handler/submitUserBillData"
// 创建路由
const router: any = express.Router();
// 挂载接口
router.post("/setupUserBillData", setupUserBillData);
router.post("/requestUserBillData", requestUserBillData);
router.post("/setUserLeaving", setUserLeaving);
export default router;
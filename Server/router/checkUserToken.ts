import express from "express";
import { checkUserToken } from "../router_handler/checkUserToken"
// 创建路由
const router: any = express.Router();
// 挂载接口
router.post("/checkUserToken", checkUserToken);
export default router;
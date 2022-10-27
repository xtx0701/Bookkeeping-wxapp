import express from "express";
import { setUserClassificationbudget, addUserClassificationbudget, clearUserClassification, changeUserClassificationExpend, getUserClassificationbudget, deteleUserClassification } from "../router_handler/classificationbudget"
// 创建路由
const router: any = express.Router();
// 挂载接口
router.post("/setUserClassificationbudget", setUserClassificationbudget);
router.post("/addUserClassificationbudget", addUserClassificationbudget);
router.post("/getUserClassificationbudget", getUserClassificationbudget);
router.post("/deteleUserClassification", deteleUserClassification);
router.post("/changeUserClassificationExpend", changeUserClassificationExpend);
router.post("/clearUserClassification", clearUserClassification);
export default router;
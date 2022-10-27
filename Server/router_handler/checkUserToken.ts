import config from "../config";
import jwt from "jsonwebtoken";

export const checkUserToken = async (req: any, res: any) => {
    const { tokenStr } = req.body;
    // 检查token是否过期
    jwt.verify(tokenStr.replace("Bearer ", ""), config.jwtSecretKey, function (err: any, _decoded: any): boolean {
        if (err) return res.status(500).json({ msg: "token已过期", err });
        else return res.status(200).json({ msg: "token未过期" });
    });
}
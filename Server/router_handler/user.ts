import db from '../db/index';
import config from "../config";
import jwt from "jsonwebtoken";

export const login = (req: any, res: any) => {
    const userInfo: UserModule.IUserInfo = req.body;
    console.log(req.body);
    db.query("select * from user where openid=?", userInfo.openid, (_err: any, results: any) => {
        const tokenStr = 'Bearer' + '' + jwt.sign(userInfo, config.jwtSecretKey, { expiresIn: '2h' });
        if (results.length > 0) {
            db.query("select * from user_message where openid=?", userInfo.openid, (err, results) => {
                if (err) return res.status(500).json({ message: "登陆失败", err });
                return res.status(200).json({ tokenStr, results: results[0] });
            })
        } else {
            db.query("insert into user set?", userInfo, (err: any, results: any) => {
                if (err) return res.status(500).json({ message: "注册失败", err });
                if (results.affectedRows !== 1) return res.status(500).json("注册失败");
                const registeredDay = new Date();
                db.query("insert into user_message set?", { openid: userInfo.openid, registeredDay }, (err, results) => {
                    if (err) return res.status(500).json({ message: "注册失败", err });
                    if (results.affectedRows !== 1) return { message: "注册失败", err };
                    db.query("select * from user_message where openid=?", userInfo.openid, (err, results) => {
                        if (err) return res.status(500).json({ message: "登陆失败", err });
                        return res.status(200).json({ tokenStr, results: results[0] });
                    })
                })
            })
        }
    })
};

export const getUserBillMessage = (req: any, res: any) => {
    const userInfo: { openid: string } = req.body;
    db.query("select * from user_message where openid=?", userInfo.openid, (err: any, results: any) => {
        if (err) return res.status(500).json({ message: "查找失败", err });
        return res.status(200).json({ results: results[0] });
    })
}

export const clearBudget = (req: any, res: any) => {
    const { openid }: { openid: string } = req.body;
    db.query("update user_message set expend=?,income=?,budget=? where openid=?", ['0', '0', '0', openid], (err: any, results: any) => {
        if (err) return res.status(500).json({ message: "查找失败", err });
        if (results.affectedRows !== 1) return res.status(500).json("注册失败");
        return res.status(200).json({ msg: "成功" });
    })
}

export const adminLogin = (req: any, res: any) => {
    const { username, password }: { username: string, password: string } = req.body;
    db.query("select * from admin where username=? and password=?", [username, password], (err: any, results: any) => {
        if (err) return res.status(500).json({ message: "登陆失败", err });
        if (results.length === 0) return res.status(500).json({ message: "登陆失败", err });
        return res.status(200).json({ msg: "登陆成功", results });
    })
};

export const getUserMessage = (_req: any, res: any) => {
    db.query("select * from user join user_message where user.openid=user_message.openid", (err: any, results: any) => {
        if (err) return res.status(500).json({ message: "登陆失败", err });
        return res.status(200).json({ results });
    })
}

export const deleteUser = (req: any, res: any) => {
    const { openid }: { openid: string } = req.body;
    db.query("delete from user where openid=?", [openid], (err: any, results: any) => {
        if (err) return res.status(500).json({ message: "删除失败", err });
        if (results.affectedRows !== 1) return res.status(500).json("删除失败");
        return res.status(200).json({ msg: "成功" });
    });
}

export const getUserLeaving = (_req: any, res: any) => {
    db.query("select * from user join user_leaving where user.openid=user_leaving.openid", (err: any, results: any) => {
        if (err) return res.status(500).json({ message: "登陆失败", err });
        return res.status(200).json({ results });
    })
}
import db from '../db/index';

export const setupUserBudget = (req: any, res: any) => {
    const { budget, openid }: { budget: number, openid: string } = req.body;
    db.query("update user_message set budget=? where openid=?", [budget, openid], (err: any, results: any) => {
        if (err) return res.status(500).json({ msg: "发生错误", err });
        if (results.affectedRows !== 1) return res.json(500, { msg: "设置失败", err });
        return res.status(200).json({ msg: "设置成功" });
    })
}

export const resetUserExpendIncome = (_req: any, res: any) => {
    db.query("update user_message set expend=?,income=? where openid=?", ['0', '0'], (err: any, results: any) => {
        if (err) return res.status(500).json({ msg: "发生错误", err });
        if (results.affectedRows !== 1) return res.json(500, { msg: "设置失败", err });
        return res.status(200).json({ msg: "设置成功" });
    })
}

export const addTotalNumBill = (req: any, res: any) => {
    const userInfo: { openid: string } = req.body;
    const { openid } = userInfo;
    db.query("select totalNumBill from user_message where openid=?", [openid], (err: any, results: any) => {
        if (err) return res.status(500).json({ msg: "发生错误", err });
        let newNum: number = Number(results[0].totalNumBill);
        newNum += 1
        db.query("update user_message set totalNumBill=? where openid=?", [newNum.toString(), openid], (err: any, results: any) => {
            if (err) return res.status(500).json({ msg: "发生错误", err });
            if (results.affectedRows !== 1) return res.json(500, { msg: "设置失败", err });
            return res.status(200).json({ msg: "设置成功" });
        })
    });
}

export const userClock = (req: any, res: any) => {
    const userInfo: { openid: string } = req.body;
    const { openid } = userInfo;
    const date = new Date(new Date().toLocaleDateString()).getTime();
    db.query("select continuousClockDay from user_message where openid=?", [openid], (err: any, results: any) => {
        if (err) return res.status(500).json({ msg: "发生错误", err });
        let num = (Number(results[0].continuousClockDay));
        num += 1;
        db.query("update user_message set lastClockDay=?,continuousClockDay=?", [date, num.toString()], (err: any, results: any) => {
            if (err) return res.status(500).json({ msg: "发生错误", err });
            if (results.affectedRows !== 1) return res.json(500, { msg: "设置失败", err });
            return res.status(200).json({ msg: "设置成功" });
        })
    })
}

export const checkUserClock = (req: any, res: any) => {
    const userInfo: { openid: string } = req.body;
    const { openid } = userInfo;
    db.query("select lastClockDay from user_message where openid=?", openid, (err: any, results: any) => {
        if (err) return res.status(500).json({ msg: "发生错误", err });
        const date: number = new Date().getTime();
        if ((date - Number(results[0].lastClockDay)) / (1000 * 60 * 60) > 48) {
            db.query("update user_message set continuousClockDay=?", ['0'], (err: any, results: any) => {
                if (err) return res.status(500).json({ msg: "发生错误", err });
                if (results.affectedRows !== 1) return res.status(500).json({ msg: "设置失败", err });
                return res.status(200).json({ msg: "设置成功" });
            })
        } else return res.status(200).json({ msg: "请求成功" });
    })
}

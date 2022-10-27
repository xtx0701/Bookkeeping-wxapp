import db from '../db/index';

export const setupUserBillData = async (req: any, res: any) => {
    const { userBillData, day } = req.body;
    const { openid, year, month }: { openid: string, year: string, month: string } = userBillData;
    db.query("select * from user_bill where openid=? and year=? and month=?", [openid, year, month], (err: any, results: any) => {
        if (err) return res.status(500).json({ message: "提交失败", err });
        if (results.length === 0) {
            const data: UserModule.IMonthData[] = [];
            const dayNum = (new Date(Number(year), Number(month), 0)).getDate();
            let i: number = 0;
            while (i < dayNum) {
                data.push({ expend: '0', income: '0', day: '', dayName: '', data: [{}] });
                i++;
            }
            db.query("insert into user_bill set?", { openid, year, month, data: JSON.stringify(data) }, (err: any, results: any) => {
                if (err) return res.status(500).json({ message: "插入失败", err });
                if (results.affectedRows !== 1) return res.status(500).json({ message: "插入失败", err });
                setupUserBillDataHandler(res, day, userBillData);
            })
        } else {
            setupUserBillDataHandler(res, day, userBillData);
        }
    })
}

const setupUserBillDataHandler = (res: any, day: number, userBillData: UserModule.IUserBillData) => {
    db.query("select * from user_bill where openid=? and year=? and month=?", [userBillData.openid, userBillData.year, userBillData.month], (err: any, results: any) => {
        if (err) return res.status(500).json({ message: "读取失败", err });
        const newResult = (JSON.parse(results[0].data));
        newResult[day - 1].day = day;
        newResult[day - 1].dayName = userBillData.dayName;
        if (JSON.stringify(newResult[day - 1].data[0]) === "{}") newResult[day - 1].data[0] = userBillData.data;
        else newResult[day - 1].data.push(userBillData.data);
        if (userBillData.data.isExpend) {
            results[0].expend = (Number(results[0].expend) + Number(userBillData.data.submitNum)).toString();
            newResult[day - 1].expend = (Number(newResult[day - 1].expend) + Number(userBillData.data.submitNum)).toString();
            db.query("select expend from user_message where openid=?", userBillData.openid, (err: any, results: any) => {
                if (err) return res.status(500).json({ msg: "发生错误", err });
                const newExpendNum = (Number(results[0].expend) + Number(userBillData.data.submitNum)).toString();
                db.query("update user_message set expend=? where openid=?", [newExpendNum, userBillData.openid], (err: any, results: any) => {
                    if (err) return res.status(500).json({ message: "设置失败", err });
                    if (results.affectedRows !== 1) return res.json(500, { msg: "设置失败", err });
                })
            })
        } else {
            results[0].income = (Number(results[0].income) + Number(userBillData.data.submitNum)).toString();
            newResult[day - 1].income = (Number(newResult[day - 1].income) + Number(userBillData.data.submitNum)).toString();
            db.query("select income from user_message where openid=?", userBillData.openid, (err: any, results: any) => {
                if (err) return res.status(500).json({ msg: "发生错误", err });
                const newIncomeNum = (Number(results[0].income) + Number(userBillData.data.submitNum)).toString();
                db.query("update user_message set income=? where openid=?", [newIncomeNum, userBillData.openid], (err: any, results: any) => {
                    if (err) return res.status(500).json({ message: "设置失败", err });
                    if (results.affectedRows !== 1) return res.json(500, { msg: "设置失败", err });
                })
            })
        };
        db.query("update user_bill set data=?,expend=?,income=? where openid=? and year=? and month=?",
            [JSON.stringify(newResult), results[0].expend, results[0].income, userBillData.openid, userBillData.year, userBillData.month],
            (err: any, results: any) => {
                if (err) return res.status(500).json({ message: "修改失败", err });
                if (results.affectedRows !== 1) return res.status(500).json("修改失败");
                return res.status(200).json({ msg: "写入成功" });
            })
    })
}

export const requestUserBillData = (req: any, res: any) => {
    const { year, month, openid }: { year: string, month: string, openid: string } = req.body;
    db.query("select * from user_bill where openid=? and year=? and month=?", [openid, year, month], (err: any, results: any) => {
        if (err) return res.status(500).json({ message: "查询失败", err });
        if (results.length === 0) return res.status(201).json("暂无记录");
        const paeseData: UserModule.IMonthData[] = JSON.parse(results[0].data);
        results[0].data = paeseData.filter(item => JSON.stringify(item.data[0]) !== "{}");
        return res.status(200).json({ results: results[0] });
    })
}

export const setUserLeaving = (req: any, res: any) => {
    const { openid, text, time }: { openid: string, text: string, time: string } = req.body;
    db.query("insert into user_leaving set?", { openid, text, time }, (err: any, results: any) => {
        if (err) return res.status(500).json({ message: "发生错误", err });
        if (results.affectedRows !== 1) return res.status(500).json({ message: "插入失败", err });
        res.status(200).json({ msg: '提交成功' });
    });
}


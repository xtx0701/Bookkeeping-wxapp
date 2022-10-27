import db from '../db/index';
export const initUserBillData = (req: any, res: any) => {
    const userBillData = req.body;
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
                return res.status(200).json({ msg: "写入成功" });
            })
        } else return res.status(200).json({ msg: "已有数据" });
    })
}

export const getUserBillData = (req: any, res: any) => {
    const { year, month, openid }: { year: string, month: string, openid: string } = req.body;
    db.query("select * from user_bill where openid=? and year=? and month=?", [openid, year, month], (err: any, results: any) => {
        if (err) return res.status(500).json({ message: "查询失败", err });
        if (results.length === 0) return res.status(200).json({ msg: "暂无数据" });
        const parseData: UserModule.IMonthData[] = JSON.parse(results[0].data);
        return res.status(200).json({ results: parseData });
    })
}

export const getUserYearBillData = (req: any, res: any) => {
    const { year, openid }: { year: string, openid: string } = req.body;
    db.query("select month,data,expend,income from user_bill where openid=? and year=?", [openid, year], (err: any, results: any) => {
        if (err) return res.status(500).json({ message: "查询失败", err });
        res.status(200).json({ results });
    })
}

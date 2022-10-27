import db from '../db/index';

export const setUserClassificationbudget = (req: any, res: any) => {
    const userInfo = req.body;
    const { openid, year, month, type, typeName }: { openid: string, year: string, month: string, type: string[], typeName: string[] } = userInfo;
    db.query("select * from user_classificationbudget where openid=? and year=? and month=?", [userInfo.openid, year, month], (err: any, results: any) => {
        if (err) return res.status(500).json({ msg: "查询错误", err });
        if (results.length === 0) {
            const classificationbudget: { type: string; typeName: string; budget: string; num: string; isOpen: boolean; }[] = [];
            type.map((item: string, index: number) => {
                classificationbudget.push({ type: item, typeName: typeName[index], budget: '0', num: '0', isOpen: false });
            })
            db.query("insert user_classificationbudget set?", { openid, year, month, classificationbudget: JSON.stringify(classificationbudget) }, (err: any, results: any) => {
                if (err) return res.status(500).json({ msg: "插入错误", err });
                if (results.affectedRows !== 1) return res.status(500).json({ msg: "插入失败", err });
                return res.status(200).json({ msg: "插入成功" });
            })
        } else res.status(200).json({ msg: "已有数据" });

    })
}

export const addUserClassificationbudget = (req: any, res: any) => {
    const userInfo = req.body;
    const { openid, year, month, type, budget } = userInfo;
    db.query("select classificationbudget from user_classificationbudget where openid=? and year=? and month=?", [openid, year, month], (err: any, results: any) => {
        if (err) return res.status(500).json({ msg: "查询错误", err });
        const newResults: { type: string; budget: string; num: string; isOpen: boolean; }[] = JSON.parse(results[0].classificationbudget);
        newResults.forEach((item: any) => {
            if (item.type === type) {
                item.budget = budget;
                item.isOpen = true;
            }
        })
        db.query("update user_classificationbudget set classificationbudget=? where openid=? and year=? and month=?", [JSON.stringify(newResults), openid, year, month], (err: any, results: any) => {
            if (err) return res.status(500).json({ msg: "更新错误", err });
            if (results.affectedRows !== 1) return res.json(500, { msg: "更新错误", err });
            return res.status(200).json({ msg: "更新成功" });
        })
    })
}

export const getUserClassificationbudget = (req: any, res: any) => {
    const userInfo: { openid: string, year: string, month: string } = req.body;
    const { openid, year, month } = userInfo;
    db.query("select classificationbudget from user_classificationbudget where openid=? and year=? and month=?", [openid, year, month], (err: any, results: any) => {
        if (err) return res.status(500).json({ msg: "查询错误", err });
        if (results.length === 0) return res.status(200).json({ msg: '暂无数据' });
        return res.status(200).json({ results: results[0].classificationbudget });
    })
}

export const changeUserClassificationExpend = (req: any, res: any) => {
    const userInfo: { openid: string, year: string, month: string, type: string, num: string } = req.body;
    const { openid, year, month, type, num } = userInfo;
    db.query("select classificationbudget from user_classificationbudget where openid=? and year=? and month=?", [openid, year, month], (err: any, results: any) => {
        if (err) return res.status(500).json({ msg: "查询错误", err });
        const parseResults = JSON.parse(results[0].classificationbudget);
        parseResults.forEach((item: any) => {
            if (item.type === type) item.num = (Number(item.num) + Number(num)).toString();
        });
        db.query("update user_classificationbudget set classificationbudget=? where openid=? and year=? and month=?", [JSON.stringify(parseResults), openid, year, month], (err: any, results: any) => {
            if (err) return res.status(500).json({ msg: "更新错误", err });
            if (results.affectedRows !== 1) return res.json(500, { msg: "更新错误", err });
            return res.status(200).json({ msg: "更新成功" });
        })
    })
}

export const deteleUserClassification = (req: any, res: any) => {
    const userInfo: { openid: string, year: string, month: string, type: string } = req.body;
    const { openid, year, month, type } = userInfo;
    db.query("select classificationbudget from user_classificationbudget where openid=? and year=? and month=?", [openid, year, month], (err: any, results: any) => {
        if (err) return res.status(500).json({ msg: "查询错误", err });
        const parseResults = JSON.parse(results[0].classificationbudget);
        parseResults.forEach((item: any) => {
            if (item.typeName === type) item.isOpen = false;
        })
        db.query("update user_classificationbudget set classificationbudget=? where openid=? and year=? and month=?", [JSON.stringify(parseResults), openid, year, month], (err: any, results: any) => {
            if (err) return res.status(500).json({ msg: "更新错误", err });
            if (results.affectedRows !== 1) return res.json(500, { msg: "更新错误", err });
            return res.status(200).json({ msg: "更新成功" });
        })
    })
}

export const clearUserClassification = (req: any, res: any) => {
    const userInfo: { openid: string, year: string, month: string } = req.body;
    const { openid, year, month } = userInfo;
    db.query("update user_message set budget=? where openid=?", ['0', openid], (err: any, results: any) => {
        if (err) return res.status(500).json({ msg: "更新错误", err });
        if (results.affectedRows !== 1) return res.json(500, { msg: "更新错误", err });
        db.query("select classificationbudget from user_classificationbudget where openid=? and year=? and month=?", [openid, year, month], (err: any, results: any) => {
            if (err) return res.status(500).json({ msg: "查询错误", err });
            const parseResults = JSON.parse(results[0].classificationbudget);
            parseResults.forEach((item: any) => item.isOpen = false);
            db.query("update user_classificationbudget set classificationbudget=? where openid=? and year=? and month=?", [JSON.stringify(parseResults), openid, year, month], (err: any, results: any) => {
                if (err) return res.status(500).json({ msg: "更新错误", err });
                if (results.affectedRows !== 1) return res.json(500, { msg: "更新错误", err });
                return res.status(200).json({ msg: "更新成功" });
            })
        })
    })
}
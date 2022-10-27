const useUserBillDataHandler = (): IUserBillDataHandler => {
    const userBillDataHandler: IUserBillDataHandler = {
        // 提交记账数据
        submitUserBillData: (userBillData: IUserBillData, day: number) => {
            return new Promise((resolve: any, reject: any) => {
                const tokenStr = wx.getStorageSync("tokenStr");
                wx.request({
                    url: "http://localhost:8000/submitUserBillData/setupUserBillData",
                    method: "POST",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: { userBillData: { ...userBillData }, day },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 获取每日数据
        getUserBillDayData: (date: string) => {
            return new Promise((resolve: any, reject: any) => {
                const tokenStr: string = wx.getStorageSync("tokenStr");
                const userInfo: { openid: string } = wx.getStorageSync("userInfo");
                const dateArr = date.split("-");
                wx.request({
                    url: "http://localhost:8000/submitUserBillData/requestUserBillData",
                    method: "POST",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: {
                        openid: userInfo.openid,
                        year: dateArr[0],
                        month: dateArr[1]
                    },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 初始化分类表
        checkUserClassificationbudget: (date: string) => {
            return new Promise((resolve: any, reject: any) => {
                const dateArr: string[] = date.split("-");
                const userInfo = wx.getStorageSync("userInfo");
                const tokenStr = wx.getStorageSync("tokenStr");
                wx.request({
                    url: "http://localhost:8000/classificationbudget/setUserClassificationbudget",
                    method: "POST",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: {
                        openid: userInfo.openid,
                        year: dateArr[0],
                        month: dateArr[1],
                        type: ["food", "shopping", "daily", "traffic"],
                        typeName: ["餐饮", "购物", "日用", "交通"]
                    },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 添加分类预算到分类表
        addUserClassificationbudget: (date: string, type: string, budget: string) => {
            return new Promise((resolve: any, reject: any) => {
                const dateArr: string[] = date.split("-");
                const userInfo = wx.getStorageSync("userInfo");
                const tokenStr = wx.getStorageSync("tokenStr");
                wx.request({
                    url: "http://localhost:8000/classificationbudget/addUserClassificationbudget",
                    method: "POST",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: {
                        openid: userInfo.openid,
                        year: dateArr[0],
                        month: dateArr[1],
                        type,
                        budget
                    },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 获取用户的分类表数据
        getUserClassificationbudget: (date: string) => {
            return new Promise((resolve: any, reject: any) => {
                const dateArr: string[] = date.split("-");
                const userInfo = wx.getStorageSync("userInfo");
                const tokenStr = wx.getStorageSync("tokenStr");
                wx.request({
                    url: "http://localhost:8000/classificationbudget/getUserClassificationbudget",
                    method: "POST",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: {
                        openid: userInfo.openid,
                        year: dateArr[0],
                        month: dateArr[1],
                    },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 改变分类的预算
        changeUserClassificationExpend: (date: string, type: string, num: string) => {
            return new Promise((resolve: any, reject: any) => {
                const dateArr: string[] = date.split("-");
                const userInfo = wx.getStorageSync("userInfo");
                const tokenStr = wx.getStorageSync("tokenStr");
                wx.request({
                    url: "http://localhost:8000/classificationbudget/changeUserClassificationExpend",
                    method: "POST",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: {
                        openid: userInfo.openid,
                        year: dateArr[0],
                        month: dateArr[1],
                        type,
                        num
                    },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 删除分类 
        deteleUserClassification: (date: string, type: string) => {
            return new Promise((resolve: any, reject: any) => {
                const dateArr: string[] = date.split("-");
                const userInfo = wx.getStorageSync("userInfo");
                const tokenStr = wx.getStorageSync("tokenStr");
                wx.request({
                    url: "http://localhost:8000/classificationbudget/deteleUserClassification",
                    method: "POST",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: {
                        openid: userInfo.openid,
                        year: dateArr[0],
                        month: dateArr[1],
                        type
                    },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 清除分类
        clearUserClassification: (date: string) => {
            return new Promise((resolve: any, reject: any) => {
                const dateArr: string[] = date.split("-");
                const userInfo = wx.getStorageSync("userInfo");
                const tokenStr = wx.getStorageSync("tokenStr");
                wx.request({
                    url: "http://localhost:8000/classificationbudget/clearUserClassification",
                    method: "POST",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: {
                        openid: userInfo.openid,
                        year: dateArr[0],
                        month: dateArr[1],
                    },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        }
    };
    return userBillDataHandler;
};

export default useUserBillDataHandler;
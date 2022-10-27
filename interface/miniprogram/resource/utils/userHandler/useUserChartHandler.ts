const useUserChartHandler = () => {
    const userChartHandler = {
        // 初始化记账数据表
        checkUserBillData: (year: string, month: string) => {
            const tokenStr: string = wx.getStorageSync("tokenStr");
            const userInfo: any = wx.getStorageSync("userInfo");
            return new Promise((resolve: any, reject: any) => {
                wx.request({
                    method: "POST",
                    url: "http://localhost:8000/userChart/initUserBillData",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: { openid: userInfo.openid, year, month },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 获取记账表数据
        getUserBillData: (year: string, month: string) => {
            const tokenStr: string = wx.getStorageSync("tokenStr");
            const userInfo: any = wx.getStorageSync("userInfo");
            return new Promise((resolve: any, reject: any) => {
                wx.request({
                    method: "POST",
                    url: "http://localhost:8000/userChart/getUserBillData",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: { openid: userInfo.openid, year, month },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 获取年份数据
        getUserYearBillData: (year: string) => {
            const tokenStr: string = wx.getStorageSync("tokenStr");
            const userInfo: any = wx.getStorageSync("userInfo");
            return new Promise((resolve: any, reject: any) => {
                wx.request({
                    method: "POST",
                    url: "http://localhost:8000/userChart/getUserYearBillData",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: { openid: userInfo.openid, year },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        }
    }

    return userChartHandler;
};

export default useUserChartHandler;
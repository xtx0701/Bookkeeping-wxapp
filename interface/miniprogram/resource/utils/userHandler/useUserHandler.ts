const useUserHandler = (): IUserHandler => {
    const userHandler: IUserHandler = {
        // 检查登陆是否过期
        checkUserToken: (tokenStr: string) => {
            return new Promise((resolve: any, reject: any) => {
                wx.request({
                    url: "http://localhost:8000/checkUserToken/checkUserToken",
                    method: "POST",
                    data: { tokenStr },
                    success: res => resolve(res),
                    fail: err => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 用户登陆
        userLogin: (userInfo: IUserHandlerParameter): Promise<IGetUserInfoResult> => {
            return new Promise((resolve: any, reject: any) => {
                wx.request({
                    method: "POST",
                    url: "http://localhost:8000/user/login",
                    data: { ...userInfo },
                    success: (res: any) =>{
                      resolve(res.data);
                      console.log(res);
                    },
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 获取个人信息
        getUserBillMessage: (openid: string): Promise<IUserBillMessage> => {
            return new Promise((resolve: any, reject: any) => {
                wx.request({
                    method: "POST",
                    url: "http://localhost:8000/user/getUserBillMessage",
                    data: { openid },
                    success: (res: any) => resolve(res.data),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 提交记账后添加记账总数
        addTotalNumBill: (openid: string) => {
            const tokenStr = wx.getStorageSync("tokenStr");
            return new Promise((resolve: any, reject: any) => {
                wx.request({
                    method: "POST",
                    url: "http://localhost:8000/setupUserMessage/addTotalNumBill",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: { openid },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 用户打卡
        userClock: (openid: string) => {
            const tokenStr = wx.getStorageSync("tokenStr");
            return new Promise((resolve: any, reject: any) => {
                wx.request({
                    method: "POST",
                    url: "http://localhost:8000/setupUserMessage/userClock",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: { openid },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 检查是否为连续打卡
        checkUserClock: (openid: string) => {
            const tokenStr = wx.getStorageSync("tokenStr");
            return new Promise((resolve: any, reject: any) => {
                wx.request({
                    method: "POST",
                    url: "http://localhost:8000/setupUserMessage/checkUserClock",
                    header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                    data: { openid },
                    success: (res: any) => resolve(res),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
        // 清除预算
        clearBudget: () => {
            return new Promise((resolve: any, reject: any) => {
                const userInfo = wx.getStorageSync("userInfo");
                wx.request({
                    method: "POST",
                    url: "http://localhost:8000/user/clearBudget",
                    data: { openid: userInfo.openid },
                    success: (res: any) => resolve(res.data),
                    fail: (err: any) => reject(err)
                }) as WechatMiniprogram.RequestTask;
            })
        },
    }
    return userHandler;
}

export default useUserHandler;
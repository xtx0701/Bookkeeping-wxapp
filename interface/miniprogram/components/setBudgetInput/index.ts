import useUserHandler from '../../resource/utils/userHandler/useUserHandler'
Component({
    methods: {
        changeSetupBudgetAge() {
            this.triggerEvent("changeSetupBudgetAgeHandler");
        },
        submitUserBudget: async function (event: any) {
            if (event.detail.value.setBudgetInput === '') {
                wx.showToast({
                    title: '不能为空',
                    icon: 'error'
                })
                this.triggerEvent("changeSetupBudgetAgeHandler");
                return;
            }
            const userHandler = useUserHandler();
            wx.showLoading({ title: "" });
            const tokenStr = wx.getStorageSync("tokenStr");
            const { openid } = wx.getStorageSync("userInfo");
            wx.request({
                method: "POST",
                url: "http://localhost:8000/setupUserMessage/setupUserBudget",
                header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
                data: { openid, budget: event.detail.value.setBudgetInput },
                success: async (_res: any) => {
                    this.triggerEvent("changeSetupBudgetAgeHandler");
                    const userInfo = wx.getStorageSync("userInfo");
                    const { results }: IUserBillMessage = await userHandler.getUserBillMessage(userInfo.openid);
                    let percent = (((Number(results.budget) - Number(results.expend)) / Number(results.budget)) * 100).toFixed(0);
                    if (percent === 'NaN' || Number(percent) < 0) percent = "0";
                    if (percent === 'NaN' || Number(percent) > 100) percent = "100";
                    let leftImageRotate, rightImageRotate;
                    if (Number(percent) === 0) leftImageRotate = rightImageRotate = "180"
                    else if (Number(percent) <= 50 && Number(percent) > 0) {
                        leftImageRotate = "180";
                        rightImageRotate = (180 * ((50 - Number(percent)) / 50)).toString();
                    } else {
                        leftImageRotate = (180 - (180 * ((Number(percent) - 50) / 50))).toString();
                        rightImageRotate = "0";
                    }
                    this.triggerEvent("changUserBudgetAgeHandler", { budget: results.budget, expend: results.expend, percent, leftImageRotate, rightImageRotate });
                    wx.showToast({ title: '设置成功', icon: 'success', duration: 2000 });
                    wx.hideLoading();
                },
                fail: (err: any) => {
                    wx.showToast({ title: '设置失败', icon: 'error', duration: 2000 });
                    throw new Error(err);
                    wx.hideLoading();
                }
            })

        }
    }
})
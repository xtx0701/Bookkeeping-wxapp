import useUserHandler from "../../resource/utils/userHandler/useUserHandler";
import useBillHandler from "../../resource/utils/userHandler/useBillHandler";
import useTopTabbar from "../../resource/utils/components/useTopTabbar";
Page({
  data: <IMinePageData>{
    isLogin: false,//判断是否登陆
    userInfo: {},//用户信息
    userBudget: "0.00",//用户预算
    userExpend: ["0", "00"],//用户支出
    userIncome: ["0", "00"],//用户收入
    userBalance: ["0", "00"],//用户结余
    userRemainder: "0.00",//用户剩余
    userRemainderPercent: "0",//预算剩余百分比
    leftImageRotate: "0",//圆形百分比图左边图形旋转角度
    rightImageRotate: "0",//圆形百分比图右边图形旋转角度
    totalNumBill: 0,//记账总数
    continuousClockDay: 0,//连续打卡日期
    useDayCount: 0,//记账总天数
    isSetupBudget: false,//控制设置预算输入框的显示
    boxHeight: '0',
    isClock: false,//是否已经打卡
  },

  async onShow() {
    // 使图标和文字的样式在跳转时发生变化
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 4 });
    const { boxHeight }: { boxHeight: string } = useTopTabbar();
    this.setData({ boxHeight });
    // 判断是否有token来断定是否自动登陆
    if (wx.getStorageSync("tokenStr") === '') this.setData({ isLogin: false });
    // 获取自定义hook
    const userHandler: IUserHandler = useUserHandler();
    const billHandler: IBillHandler = useBillHandler();
    // 如果有token则自动登陆
    if (wx.getStorageSync("tokenStr")) {
      // 获取个人资料
      const userInfo = wx.getStorageSync("userInfo");
      await userHandler.checkUserClock(userInfo.openid);
      // 获取预算和账单信息
      let userBillData = billHandler.handleUserBillData(wx.getStorageSync("userBillData"));
      const { results }: IUserBillMessage = await userHandler.getUserBillMessage(userInfo.openid);
      // 请求接口获取上次打卡时间并计算打卡时间判断是否为连续打卡
      if ((new Date().getTime() - Number(results.lastClockDay)) / (1000 * 60 * 60) < 24) this.setData({ isClock: true });
      userBillData = billHandler.handleUserBillData(results);
      this.setData({ userInfo, isLogin: true, ...userBillData });
    }
  },
  // 用户登陆
  userLogin: async function (): Promise<void> {
    // 获取自定义hook
    const userHandler: IUserHandler = useUserHandler();
    const billHandler: IBillHandler = useBillHandler();
    wx.showLoading({ title: "登陆中" });
    // 请求接口判断是否已经注册
    try {
      var { nickName, avatarUrl }: { nickName: string, avatarUrl: string }
        = ((await wx.getUserProfile({ desc: "是否授权获取用户信息" }) as WechatMiniprogram.GetUserProfileSuccessCallbackResult).userInfo) as IGetUserProfileSuccessCallbackUserInfoResult;
      var { openid }: { openid: string }
        = ((await wx.cloud.callFunction({ name: "getUserOpenId" }) as ICloud.CallFunctionResult).result) as ICallFunctionUserIdResult;
    } catch (err: (any | unknown)) {
      throw Error(err);
    }
    // 通过接口获取到返回的数据
    const { tokenStr, results } = await userHandler.userLogin({ nickName, avatarUrl, openid });
    // 本地存储用于自动登录时首屏渲染
    wx.setStorageSync("userInfo", { nickName, avatarUrl, openid });
    wx.setStorageSync("userBillData", { ...results });
    wx.setStorageSync("tokenStr", tokenStr);
    // 处理用户预算等数据
    const userBillData = billHandler.handleUserBillData(results);
    this.setData({
      isLogin: true,
      userInfo: { nickName, avatarUrl, ...results } as any,
      ...userBillData
    })
    const userInfo = wx.getStorageSync("userInfo");
    // 请求接口获取上次打卡时间并计算打卡时间判断是否为连续打卡
    const { results: clockResults }: IUserBillMessage = await userHandler.getUserBillMessage(userInfo.openid);
    if ((new Date().getTime() - Number(clockResults.lastClockDay)) / (1000 * 60 * 60) < 24) this.setData({ isClock: true });
    wx.hideLoading();
  },

  changeSetupBudgetAge: function () {
    // 判断是否登陆
    if (!wx.getStorageSync("tokenStr")) wx.showModal({
      content: "请先登录再使用",
      success: (res: any) => {
        if (res.confirm) wx.switchTab({ url: "../mine/index" })
      }
    })
    else {
      // 控制是否弹出输入框
      const { isSetupBudget } = this.data;
      this.setData({ isSetupBudget: !isSetupBudget });
    }
  },
  // 改变用户预算
  changUserBudgetAge: function (event: any) {
    // 赋值渲染
    this.setData({
      userBudget: event.detail.budget.toFixed(2),
      userRemainder: (Number(event.detail.budget) - Number(event.detail.expend)).toFixed(2),
      userRemainderPercent: event.detail.percent,
      leftImageRotate: event.detail.leftImageRotate,
      rightImageRotate: event.detail.rightImageRotate
    });
  },
  // 用户打卡
  userClock: async function (): Promise<void> {
    if (!wx.getStorageSync("tokenStr")) wx.showModal({
      content: "请先登录再使用",
      success: (res: any) => {
        if (res.confirm) wx.switchTab({ url: "../mine/index" })
      }
    })
    else {
      // 请求接口打卡记录数据
      const userInfo = wx.getStorageSync("userInfo");
      const userHandler = useUserHandler();
      await userHandler.userClock(userInfo.openid);
      this.onShow();
    }

  },
  // 跳转留言页方法
  goLeaving: function (): void {
    if (!wx.getStorageSync("tokenStr")) wx.showModal({
      content: "请先登录再使用",
      success: (res: any) => {
        if (res.confirm) wx.switchTab({ url: "../mine/index" })
      }
    })
    else wx.navigateTo({ url: "../leaving/index" })
  }
})
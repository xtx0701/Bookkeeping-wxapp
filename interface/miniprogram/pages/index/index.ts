import useUserHandler from '../../resource/utils/userHandler/useUserHandler';
import useTopTabbar from "../../resource/utils/components/useTopTabbar";
import useUserBillDataHandler from "../../resource/utils/userHandler/useUserBillDataHandler";
import formatTimeHandler from "../../resource/utils/userHandler/formatTimeHandler"
Page({

  data: <IIndexPageData>{
    boxHeight: '0',//盒子高度
    time: ["", ""],//显示选择的时间
    monthExpend: ["0", "00"],//月支出
    monthIncome: ["0", "00"],//月收入
    billDayData: [{}],//账单详细数据
    isHasData: false//判断是否含有数据
  },


  async onLoad() {
    // 引入用户操作方法hook
    const userHandler = useUserHandler();
    if (!wx.getStorageSync("tokenStr")) wx.showModal({
      content: "请先登录再使用",
      success: (res: any) => {
        if (res.confirm) wx.switchTab({ url: "../mine/index" })
      }
    })
    else {
      // 在每次登入程序验证用户的登陆凭证是否过期
      // 如果过期则要重新登录
      // 从本地缓存获得用户的token
      const tokenStr: string = wx.getStorageSync("tokenStr");
      // 获取检测结果
      const checkTokenResult: any = await userHandler.checkUserToken(tokenStr.replace(/^Bearer/, ''));
      // 不通过检测则状态码为500
      if (checkTokenResult.statusCode === 500) {
        // 提示用户需要重新登陆
        wx.showModal({
          content: "登陆已过期,请重新登陆",
          success: (res: any) => {
            // 清除本地信息
            if (res.confirm) {
              wx.switchTab({ url: "../mine/index" });
              wx.removeStorageSync("userInfo");
              wx.removeStorageSync("userBillData");
              wx.removeStorageSync("tokenStr");
            }
          }
        });
      }

    }
    // 判断是否为1号并为用户充值预算
    const dateArr = (formatTimeHandler().time).split("-");
    if (dateArr[2] === '01') await userHandler.clearBudget();

  },


  async onShow() {
    // 用于使图标和文字在跳转时发生变化
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 0 });

    const { boxHeight }: { boxHeight: string } = useTopTabbar();
    this.setData({ boxHeight });

    // 进入主页加载记账信息
    const dateResult: any = formatTimeHandler();
    this.handleBillData(dateResult.time);
  },
  // 选择日期方法
  dataPickerHandler: async function (event: any): Promise<void> {
    if (!wx.getStorageSync("tokenStr")) wx.showModal({
      content: "请先登录再使用",
      success: (res: any) => wx.switchTab({ url: "../mine/index" })
    })
    else {
      // 赋值日期到页面并显示
      const date: string = event.detail.value;
      this.handleBillData(date);
    }

  },
  // 请求月份数据
  handleBillData: async function (date: string): Promise<void> {
    // 获取自定义hook
    const userBillDataHandler: IUserBillDataHandler = useUserBillDataHandler();
    const dateArr = date.split("-");
    this.setData({ time: [dateArr[0], dateArr[1]], isHasData: false });
    // 请求接口获取数据
    const results = (await userBillDataHandler.getUserBillDayData(date)).data.results;
    // 判断数据是否为零并进行四舍五入处理
    if (results.expend !== '0' || results.income !== '0') {
      const monthExpend: string[] = (Number(results.expend).toFixed(2)).split(".");
      const monthIncome: string[] = (Number(results.income).toFixed(2)).split(".");
      const billDayData: any = results.data;
      this.setData({ monthExpend, monthIncome, billDayData, isHasData: true });
    }
  }
})
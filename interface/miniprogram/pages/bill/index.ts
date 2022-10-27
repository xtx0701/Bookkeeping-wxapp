import useUserHandler from "../../resource/utils/userHandler/useUserHandler";
import useBillHandler from "../../resource/utils/userHandler/useBillHandler";
import useTopTabbar from "../../resource/utils/components/useTopTabbar";
import formatTimeHandler from "../../resource/utils/userHandler/formatTimeHandler";
import useUserBillDataHandler from "../../resource/utils/userHandler//useUserBillDataHandler";
Page({

  data: <IBillPageData>{
    boxHeight: '0',
    userBudget: "0.00",//用户预算
    userRemainder: "0.00",//用户剩余
    userExpend: ["0", "00"],//用户支出
    userRemainderPercent: "0",//预算剩余百分比
    leftImageRotate: "0",//圆形百分比图左边图形旋转角度
    rightImageRotate: "0",//圆形百分比图右边图形旋转角度
    item_list: ["编辑总预算", "清除总预算"],//按钮展示数据
    isSetupBudget: false,//判断是否弹出设置预算输入框
    isAddClassification: false,//判断是否弹出设置添加分类选项框
    addClassificationName: '',//选择的分类
    classificationData: [],//分类数据
    isHasClassificationData: false//判断是否有分类数据
  },
  onLoad() {
    // 获取盒子高度
    const { boxHeight }: { boxHeight: string } = useTopTabbar();
    this.setData({ boxHeight });
  },

  async onShow() {
    // 用于使图标和文字在跳转时发生变化
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 3 });
    // 使用自定义hook
    const userHandler: IUserHandler = useUserHandler();
    const billHandler: IBillHandler = useBillHandler();
    const userBillDataHandler: IUserBillDataHandler = useUserBillDataHandler();
    const date: any = formatTimeHandler();
    // 判断是否在本地已有token
    if (wx.getStorageSync("tokenStr")) {
      const userInfo = wx.getStorageSync("userInfo");
      // 预生成用户预算的饼状图
      const { results }: IUserBillMessage = await userHandler.getUserBillMessage(userInfo.openid);
      const { userBudget, userRemainder, userExpend, userRemainderPercent, leftImageRotate, rightImageRotate } = billHandler.handleUserBillData(results);
      this.setData({ userBudget, userRemainder, userExpend, userRemainderPercent, leftImageRotate, rightImageRotate });
    }
    // 获取用户的分类数据
    const results: any = await userBillDataHandler.getUserClassificationbudget(date.time);
    const parseResult: { type: string, typeName: string, budget: string, num: string, isOpen: boolean }[] = JSON.parse(results.data.results);
    const classificationData: any = this.userClassificationDataHandler(parseResult);
    // 如果数据组长度为0，则不显示数据
    if (classificationData.length !== 0) this.setData({ isHasClassificationData: true });
    this.setData({ classificationData });
  },

  compileUserBudget: async function (): Promise<void> {
    // 判断是否已登录
    if (!wx.getStorageSync("tokenStr")) wx.showModal({
      content: "请先登录再使用",
      success: (res: any) => {
        if (res.confirm) wx.switchTab({ url: "../mine/index" })
      }
    })
    else {
      // 清除分类的方法
      const userBillDataHandler: IUserBillDataHandler = useUserBillDataHandler();
      const date: any = formatTimeHandler();
      // 弹出选择框
      wx.showActionSheet({
        itemList: this.data.item_list,
        success: (res: any) => {
          // 点击取消
          if (res.tapIndex === 0) this.setData({ isSetupBudget: true });
          if (res.tapIndex === 1) {
            wx.showModal({
              title: "确定清除吗",
              success: async (res: any) => {
                // 点击确定
                if (res.confirm) {
                  // 请求清除接口
                  await userBillDataHandler.clearUserClassification(date.time);
                  // 获取清楚后的预算数据
                  const results: any = await userBillDataHandler.getUserClassificationbudget(date.time);
                  // 赋值渲染页面
                  const parseResult: { type: string, typeName: string, budget: string, num: string, isOpen: boolean }[] = JSON.parse(results.data.results);
                  const classificationData: any = this.userClassificationDataHandler(parseResult);
                  if (classificationData.length !== 0) this.setData({ isHasClassificationData: true });
                  this.setData({ classificationData });
                }
              }
            })
          }
        },
        fail: (err: any) => console.log(err)
      })
    }
  },

  // 添加分类
  addUserClassificationbudget: async function (): Promise<any> {
    // 判断是否已登陆
    if (!wx.getStorageSync("tokenStr")) wx.showModal({
      content: "请先登录再使用",
      success: (res: any) => {
        if (res.confirm) wx.switchTab({ url: "../mine/index" })
      }
    })
    else {
      // 弹出分类选择框
      wx.showActionSheet({
        itemList: ["餐饮", "购物", "日用", "交通"],
        success: (res: any) => {
          const typeArr = ["food", "shopping", "daily", "traffic"];
          this.setData({ addClassificationName: typeArr[res.tapIndex], isAddClassification: true });
        }
      })
    }

  },
  // 控制添加预算分类弹框弹出
  changAddClassificationAge: function (): void {
    const { isAddClassification } = this.data;
    this.setData({ isAddClassification: !isAddClassification });
  },
  // 添加预算方法
  changeUserClassificationAge: function (event: any): void {
    // 获取预算数据
    const parseResult: parseResult[] = JSON.parse(event.detail.results.data.results);
    const classificationData: any = this.userClassificationDataHandler(parseResult);
    // 赋值渲染
    this.setData({ classificationData });
    wx.showToast({ title: "添加成功", icon: "success" });
  },
  // 控制设置预算的弹框弹出
  changeSetupBudgetAge: function () {
    const { isSetupBudget } = this.data;
    this.setData({ isSetupBudget: !isSetupBudget });
  },
  // 改变用户预算
  changUserBudgetAge: function (event: any) {
    // 运算步骤在组件输入框中
    // 赋值渲染
    this.setData({
      userBudget: event.detail.budget.toFixed(2),
      userRemainder: (Number(event.detail.budget) - Number(event.detail.expend)).toFixed(2),
      userRemainderPercent: event.detail.percent,
      leftImageRotate: event.detail.leftImageRotate,
      rightImageRotate: event.detail.rightImageRotate
    });
  },
  // 删除预算分类
  deleteUserClassification: async function (event: any): Promise<void> {
    wx.showModal({
      title: "确定删除吗",
      success: async (res: any) => {
        // 点击确定
        if (res.confirm) {
          // 获取自定义hook
          const userBillDataHandler: IUserBillDataHandler = useUserBillDataHandler();
          const date: any = formatTimeHandler();
          // 请求接口获取数据
          await userBillDataHandler.deteleUserClassification(date.time, event.currentTarget.dataset.type);
          const results: any = await userBillDataHandler.getUserClassificationbudget(date.time);
          const parseResult: { type: string, typeName: string, budget: string, num: string, isOpen: boolean }[] = JSON.parse(results.data.results);
          const classificationData: any = this.userClassificationDataHandler(parseResult);
          // 如果数据长度为0则页面不显示数据
          if (classificationData.length !== 0) this.setData({ isHasClassificationData: true });
          else this.setData({ isHasClassificationData: false });
          this.setData({ classificationData });
          // 弹框提示
          wx.showToast({ title: "删除成功", icon: "success" });
        }
      }
    })

  },
  // 用户饼状图计算通用方法
  userClassificationDataHandler: function (parseResult: parseResult[]): parseResult[] {
    // 获取参数传入数据
    const filterResult = parseResult.filter(item => item.isOpen);
    const classificationData = [] as any;
    // 循环分类预算数据
    filterResult.map((item: any) => {
      const remainder = (Number(item.budget) - Number(item.num)).toFixed(2);
      // 计算剩余预算百分比
      let remainderPercent = ((Number(remainder) / Number(item.budget)) * 100).toFixed(0);
      // 超过100则显示100 小于0则显示0
      if (remainderPercent === 'NaN' || Number(remainderPercent) < 0) remainderPercent = "0";
      if (remainderPercent === 'NaN' || Number(remainderPercent) > 100) remainderPercent = "100";
      let leftImageRotate, rightImageRotate;
      // 计算饼状图旋转角度
      if (Number(remainderPercent) === 0) leftImageRotate = rightImageRotate = "180"
      else if (Number(remainderPercent) <= 50 && Number(remainderPercent) > 0) {
        leftImageRotate = "180";
        rightImageRotate = (180 * ((50 - Number(remainderPercent)) / 50)).toString();
      } else {
        leftImageRotate = (180 - (180 * ((Number(remainderPercent) - 50) / 50))).toString();
        rightImageRotate = "0";
      }
      // 加入到对象属性中并返回
      classificationData.push({
        typeName: item.typeName,
        budget: Number(item.budget).toFixed(2).toString(),
        expend: Number(item.num).toFixed(2).toString(),
        remainder,
        remainderPercent,
        leftImageRotate,
        rightImageRotate
      })
    })
    return classificationData;
  }
})
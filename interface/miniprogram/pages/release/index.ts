import useTopTabbar from "../../resource/utils/components/useTopTabbar";
import stringOperationHandler from '../../resource/utils/userHandler/stringOperationHandler';
import formatTimeHandler from '../../resource/utils/userHandler/formatTimeHandler';
import useUserBillDataHandler from '../../resource/utils/userHandler/useUserBillDataHandler';
import useUserHandler from "../../resource/utils/userHandler/useUserHandler";
Page({

  data: <IReleasePageData>{
    boxHeight: '0',
    isExpend: true,
    choseSetupClassification: {},
    expendClassification: [
      { name: '餐饮', image: '../../resource/image/static/release_food.png', isChose: false, type: 'food' },
      { name: '购物', image: '../../resource/image/static/release_shopping.png', isChose: false, type: 'shopping' },
      { name: '日用', image: '../../resource/image/static/release_daily.png', isChose: false, type: 'daily' },
      { name: '交通', image: '../../resource/image/static/release_traffic.png', isChose: false, type: 'traffic' },
    ],//支出类别
    incomeClassification: [
      { name: '工资', image: '../../resource/image/static/release_wage.png', isChose: false, type: 'wage' },
      { name: '兼职', image: '../../resource/image/static/release_parttime.png', isChose: false, type: 'parttime' },
      { name: '理财', image: '../../resource/image/static/release_financial.png', isChose: false, type: 'financial' },
      { name: '礼金', image: '../../resource/image/static/release_cashgift.png', isChose: false, type: 'cashgift' },
    ],//收入类别
    isSubmit: false,//是否开启算盘
    submitNum: '0',//提交数目
    isAdd: true,//判断加减法
    submitText: '',//备注,
    isCompute: false,//判断是否正在计算
    numArr: ['7', '8', '9', '4', '5', '6', '1', '2', '3'],//键盘按钮数据
    datePickerData: '今天'//选择日期展示
  },


  onLoad() {
    // 获取盒子高度
    const { boxHeight }: { boxHeight: string } = useTopTabbar();
    this.setData({ boxHeight });
  },
  // 切换收入支出界面
  changeSetupAge: function (): void {
    const { isExpend, expendClassification, incomeClassification } = this.data;
    // 改变isExpend更改展示状态
    if (isExpend) expendClassification.forEach((item: ISetupClassification) => item.isChose = false);
    else incomeClassification.forEach((item: ISetupClassification) => item.isChose = false);
    this.setData({ isExpend: !isExpend, expendClassification, incomeClassification });
  },
  // 关闭输入
  closeSubmitInput: function (): void {
    this.setData({ isSubmit: false });
    const { isExpend }: { isExpend: boolean } = this.data;
    let resultClassification = [];
    if (isExpend) resultClassification = this.data.expendClassification;
    else resultClassification = this.data.incomeClassification;
    resultClassification.forEach((item: ISetupClassification) => item.isChose = false);
    if (isExpend) this.setData({ expendClassification: resultClassification });
    else this.setData({ incomeClassification: resultClassification });
  },
  // 选择分类
  choseClassification: function (event: any): void {
    // 获取当前分类的类别数据
    const { index, type, name }: { index: number, type: string, name: string } = event.currentTarget.dataset;
    const { isExpend }: { isExpend: boolean } = this.data;
    let resultClassification = [];
    // 如果是支出则切换收入界面并更改全局数据
    if (isExpend) resultClassification = this.data.expendClassification;
    else resultClassification = this.data.incomeClassification;
    // 点击按钮后会改变颜色
    resultClassification.forEach((item: ISetupClassification) => item.isChose = false);
    resultClassification[index].isChose = true;
    // 将选择的分类提交到全局数据
    if (isExpend) this.setData({ expendClassification: resultClassification });
    else this.setData({ incomeClassification: resultClassification });
    this.setData({ choseSetupClassification: { type, name }, isSubmit: true });
  },
  // 获取用户备注
  getSubmitInputText: function (event: any): void {
    this.setData({ submitText: event.detail.value });
  },
  // 数字键盘按键
  changeSubmitNum: function (event: any): void {
    let { submitNum, isCompute }: { submitNum: string, isCompute: boolean } = this.data;
    // 若数字开头为零则直接赋值
    if (submitNum === '0') submitNum = event.currentTarget.dataset.value;
    else {
      // 判断是否带有运算符号
      if (/(\+|\-)+/.test(submitNum)) {
        // 若运算符号后的数字不带有小数点且长度小于八位，则添加数字
        if ((/^.{0,7}$/.test((submitNum.match(/(?<=(\+|\-))[1-9]*/) as any | null)[0])) && (/^[^\.]*$/.test((submitNum.match(/(?<=(\+|\-)).*/) as any | null)[0]))
          || ((/(\.)+/.test((submitNum.match(/(?<=(\+|\-)).*/) as any)[0]))
            && (/^.{0,1}$/.test(((submitNum.match(/(?<=(\+|\-))([1-9]|\.)*/) as any)[0].match(/(?<=(\.)).*/))[0])))) {
          submitNum += event.currentTarget.dataset.value;
          isCompute = true;
        }
      } else if ((/^(?<!(\.))([1-9]{0,7})$/.test(submitNum))
        // 若没小数点并且小于八位则直接添加数字
        || ((/\.+/.test(submitNum)) && (/^.{0,10}$/.test(submitNum)) && (/^.{0,1}$/.test((submitNum.match(/(?<=(\.)).*/) as any)[0]))))
        submitNum += event.currentTarget.dataset.value;
    }
    this.setData({ submitNum, isCompute });
  },
  // 添加小数点
  addDecimalPoint: function (): void {
    let { submitNum }: { submitNum: string } = this.data;
    // 判断是否超过八位或者小数点后超过两位
    if (/^(.(?!(\.|\+|\-)))+$/.test(submitNum) || /^(.(?!\.))+$/.test((submitNum.match(/(?<=(\+|\-))(.+)/) as any | null)[0]))
      submitNum += '.';
    this.setData({ submitNum });
  },
  // 删除键
  deleteSubmitNum: function (): void {
    let { submitNum, isCompute }: { submitNum: string, isCompute: boolean } = this.data;
    if (submitNum.length > 0) {
      // 判断数据是否为零，不为零则删除
      if ((/(?<=(\+|\-))[1-9]?$/.test(submitNum))) isCompute = false;
      submitNum = submitNum.substring(0, submitNum.length - 1);
      this.setData({ submitNum, isCompute });
    }
  },
  // 添加运算符号
  addOperationSymbol: function (event: any): void {
    const { symbol }: { symbol: string } = event.currentTarget.dataset;
    let { submitNum, isCompute }: { submitNum: string, isCompute: boolean } = this.data;
    // 无符号直接添加
    if (!(/(\+|\-)+/.test(submitNum))) submitNum += symbol;
    // 是等式情况向先运算在添加
    if (!(isCompute) && (/(\+|\-)+/.test(submitNum))) submitNum = submitNum.replace(/(\+|\-)+/, symbol);
    // 预算后改变全局中的数据
    if (isCompute) {
      const operationResult: { submitNum: string, computeSymbol: string } = stringOperationHandler(submitNum);
      submitNum = operationResult.submitNum;
      submitNum += operationResult.computeSymbol;
      isCompute = !isCompute;
    }
    this.setData({ submitNum, isCompute });
  },
  //提交数据
  finshButtonHandler: async function (): Promise<void> {
    wx.showLoading({ title: "提交中" });
    // 获取自定义hook
    const userBillDataHandler = useUserBillDataHandler();
    const userHandler = useUserHandler();
    // 获取全局中data的数据
    let { submitNum, isCompute, submitText, datePickerData, choseSetupClassification, isExpend }
      : { submitNum: string, isCompute: boolean, submitText: string, datePickerData: string, choseSetupClassification: { type: string, name: string }, isExpend: boolean } = this.data;
    if (isCompute) submitNum = (stringOperationHandler(submitNum)).submitNum;
    else if (/[\+|\-]+/.test(submitNum)) submitNum = submitNum.substring(0, submitNum.length - 1);
    // 获取用户ID
    const openid: string = (wx.getStorageSync("userInfo")).openid;
    if (datePickerData === '今天') datePickerData = (formatTimeHandler()).time;
    // 获取选择的时间
    const dateDataArr = datePickerData.split('-');
    const day = ((dateDataArr[2].match(/[^0]+/g) as any)[0]);
    // 创建数据对象
    const billData: IUserBillData = {
      openid,
      year: dateDataArr[0],
      month: dateDataArr[1],
      dayName: (formatTimeHandler()).dayName,
      data: {
        submitNum,
        ...choseSetupClassification,
        text: submitText,
        isExpend
      }
    }
    // 初始化表格
    await userBillDataHandler.submitUserBillData(billData, day);
    await userBillDataHandler.checkUserClassificationbudget(datePickerData);
    // 写入数据
    await userBillDataHandler.changeUserClassificationExpend(datePickerData, choseSetupClassification.type, submitNum);
    await userHandler.addTotalNumBill(openid);
    wx.hideLoading();
    wx.showToast({ title: "记录成功", icon: "success" });
    wx.switchTab({ url: "../index/index" })
  },

  dataPickerHandler: function (event: any): void {
    this.setData({ datePickerData: event.detail.value });
  }
})
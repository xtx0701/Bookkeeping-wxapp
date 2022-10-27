import useTopTabbar from "../../resource/utils/components/useTopTabbar";
import formatTimeHandler from '../../resource/utils/userHandler/formatTimeHandler';
import useUserChartHandler from "../../resource/utils/userHandler/useUserChartHandler";
Page({

  data: {
    boxHeight: '0',
    isExpend: true,//分类是否为支出
    timeClass: 0,//0为周 1为月 2为年
    weekBillNum: 0,//每周支出
    dayBillNum: '0',//平均支出
    showBillData: [],//描点
    showBillLine: [],//斜线
    billRanking: [],//排行榜数据
    isHaveData: true//判断是否含有数据
  },

  onLoad() {
    // 获取盒子高度
    const { boxHeight }: { boxHeight: string } = useTopTabbar();
    this.setData({ boxHeight });
  },

  async onShow() {
    // 用于使图标和文字在跳转时发生变化
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 1 });
    // 请求每周数据
    this.getUserWeekData();
  },

  // 计算夹角角度
  computeDeg: function (straight: number, oblique: number): number {
    // 求出直角边和斜边的比例
    const sinOfAngleX = straight / oblique;
    const angle = Math.round((Math.asin(sinOfAngleX) * 180) / Math.PI);
    return angle;
  },

  sortCompare: function (prop: string): (a: any, b: any) => number {
    // 对排行榜数据进行排序
    return function (a: any, b: any): number {
      const valueA = a[prop];
      const valueB = b[prop];
      return valueB - valueA;
    }
  },

  changeIsExpendAge: function (): void {
    // 检测是否已登录
    if (!wx.getStorageSync("tokenStr")) wx.showModal({
      content: "请先登录再使用",
      success: (res: any) => {
        if (res.confirm) wx.switchTab({ url: "../mine/index" })
      }
    })
    else {
      // 登陆后进行数据获取
      const { isExpend } = this.data;
      this.setData({ isExpend: !isExpend });
      //  周 月 年
      if (this.data.timeClass === 0) this.changeWeekAge();
      if (this.data.timeClass === 1) this.changeMonthAge();
      if (this.data.timeClass === 2) this.changeYearAge();
    }

  },
  //获取每周数据
  changeWeekAge: function (): void {
    this.setData({ timeClass: 0 });
    this.getUserWeekData();
  },
  //获取月份数据
  changeMonthAge: function (): void {
    this.setData({ timeClass: 1 });
    this.getUserMonthData();
  },
  //获取每年数据
  changeYearAge: function (): void {
    this.setData({ timeClass: 2 });
    this.getUserYearDay();
  },
  // 控制点击后限制支出或收入数据
  changeIsShow: function (event: any): void {
    const { showBillData }: { showBillData: any } = this.data;
    // 更改点击节点的isShow属性
    showBillData.forEach((item: any, index: number) => {
      if (index === event.currentTarget.dataset.index) item.isShow = true;
      else item.isShow = false;
    })
    this.setData({ showBillData });
  },

  // 获取每周数据
  getUserWeekData: async function (): Promise<void> {
    const userChartHandler = useUserChartHandler();
    const date: Date = new Date();
    // 获得日期串
    const dateStrArr = (formatTimeHandler().time).split("-");
    // 获取本月共有多少天
    const dayMaxNum = (new Date(Number(dateStrArr[0]), Number(dateStrArr[1]), 0)).getDate();
    // 获取上个月共有多少天
    const lastMonthDayMaxNum = new Date(Number(dateStrArr[0]), Number(dateStrArr[1]) - 1, 0).getDate()
    // 获取今天是多少号
    const day: number = date.getDate();
    // 获取今天是周几
    const dayNum: number = date.getDay();

    // 周记录
    // 获取本周是第几周
    // const weekNum: number = getYearWeek(date);
    const dayArr: number[] = [];
    dayArr.push(day);
    //动态规划求全部日期
    let leftNum = dayNum;
    let rightNum = (6 - dayNum);
    let leftDay = day, rightDay = day;
    while (leftNum > 0 || rightNum > 0) {
      leftDay--;
      rightDay++;
      if (rightDay > dayMaxNum) rightDay = 1;
      if (leftDay < 1) leftDay = lastMonthDayMaxNum;
      if (rightNum > 0) dayArr.push(rightDay);
      if (leftNum > 0) dayArr.unshift(leftDay);
      leftNum--;
      rightNum--;
    }
    const copyDayArr: number[] = [];
    for (let i of dayArr) { copyDayArr.push(i) };
    // 判断是否为跨月的标记符
    const markIndex = dayArr.indexOf(1);
    const todayIndex = dayArr.indexOf(day);
    // 获取一周详细数据后的数组
    let concatArr: any[] = [];
    if (markIndex !== -1) {
      // 根据标识符判断是前一个月还是后一个月
      let monthNum = '';
      if (dayArr.indexOf(1) > todayIndex) monthNum = (Number(dateStrArr[1]) + 1).toString();
      else monthNum = (Number(dateStrArr[1]) - 1).toString();
      monthNum = Number(monthNum) < 10 ? '0' + monthNum : monthNum;
      // 初始化表格
      await userChartHandler.checkUserBillData(dateStrArr[0], monthNum);
      await userChartHandler.checkUserBillData(dateStrArr[0], dateStrArr[1]);
      // 获取两个月的数据
      const firstMonthData = (await userChartHandler.getUserBillData(dateStrArr[0], dateStrArr[1]) as any).data.results;
      const secondMonthData = (await userChartHandler.getUserBillData(dateStrArr[0], monthNum) as any).data.results;
      // 将不同月份的日期分开
      const rightDayArr = dayArr.splice(dayArr.indexOf(1));
      const leftDayArr = dayArr;
      // 分配日期
      const firstMonthKey = dayArr.indexOf(1) > todayIndex ? leftDayArr : rightDayArr;
      const secondMonthKey = dayArr.indexOf(1) > todayIndex ? rightDayArr : leftDayArr;
      // 跨月请求数据
      for (let i of firstMonthKey) { concatArr.push(firstMonthData[i - 1]); }
      if (dayArr.indexOf(1) > todayIndex) {
        for (let i of secondMonthKey) { concatArr.push(secondMonthData[i - 1]); }
      } else {
        for (let i of secondMonthKey.reverse()) { concatArr.unshift(secondMonthData[i - 1]) }
      }
    } else {
      // 不跨月请求数据
      await userChartHandler.checkUserBillData(dateStrArr[0], dateStrArr[1]);
      const firstMonthData = (await userChartHandler.getUserBillData(dateStrArr[0], dateStrArr[1]) as any).data.results;
      for (let i of dayArr) { concatArr.push(firstMonthData[i - 1]) };
    }
    this.drawImage(concatArr);
  },
  // 获取每月数据
  getUserMonthData: async function (): Promise<void> {
    const dateStrArr = (formatTimeHandler().time).split("-");
    const userChartHandler = useUserChartHandler();
    const monthData = (await userChartHandler.getUserBillData(dateStrArr[0], dateStrArr[1]) as any).data.results;
    this.drawImage(monthData);
  },
  // 获取每年数据
  getUserYearDay: async function (): Promise<void> {
    const dateStrArr = (formatTimeHandler().time).split("-");
    const userChartHandler = useUserChartHandler();
    for (let i = 1; i <= 12; i++) {
      const key = i < 10 ? '0' + i.toString() : i.toString();
      await userChartHandler.checkUserBillData(dateStrArr[0], key);
    }
    const yearData: any = (await userChartHandler.getUserYearBillData(dateStrArr[0]) as any).data.results;
    this.drawImage(yearData);
  },
  // 画图通用方法
  drawImage: function (dataResult: any): void {
    // 每日数据
    let weekBillNum = 0;
    // 判断当前查看的是支出还是收入
    const type = this.data.isExpend ? 'expend' : 'income';
    for (let i in dataResult) { weekBillNum += Number(dataResult[i][type]); };
    const dayBillNum = (weekBillNum / dataResult.length).toFixed(2);
    // 若为0则不显示数据
    if (weekBillNum === 0) this.setData({ isHaveData: false });
    else this.setData({ isHaveData: true });
    if (Number.isNaN(dayBillNum)) this.setData({ dayBillNum: '0' });
    else this.setData({ dayBillNum });
    // 获取描点数据
    let showBillData: any = [];
    for (let i in dataResult) {
      const result: any = {};
      // 请求月数据只在特定日期显示日期
      if (this.data.timeClass === 1) {
        if (i === '0' || i === '6' || i === '12' || i === '18' || i === '24') result.dayNum = Number(i) + 1;
      }
      else result.dayNum = Number(i) + 1;//日期
      // 描点的高度
      let height: number = parseInt((Number(dataResult[i][type] / weekBillNum) * 300).toFixed(2));
      if (Object.is(height, NaN) || height === 0) { height = -8; };
      result.height = height;
      // 控制数据显示标识符
      result.isShow = false;
      // 支出收入数据
      result.num = dataResult[i][type]
      showBillData.push(result);
    }
    // 获取斜线数据
    const showBillLine: any = []
    for (let i = 0; i < showBillData.length - 1; i++) {
      let lineResult: any = {};
      lineResult.bottom = showBillData[i].height + 8;
      lineResult.left = 0.5 * (750 * 0.9 / showBillData.length) + i * (750 * 0.9 / showBillData.length);
      // 两点高度差
      let heightDifference: any = showBillData[i].height > showBillData[i + 1].height ? showBillData[i].height - showBillData[i + 1].height : showBillData[i + 1].height - showBillData[i].height;
      // 斜边长度
      let hypotenuseLength = Math.sqrt(Math.pow((750 * 0.9 / showBillData.length), 2) + Math.pow(heightDifference, 2));
      lineResult.height = hypotenuseLength;
      // 计算角度
      const deg = this.computeDeg(heightDifference, hypotenuseLength);
      // 根据前后数据差判断指向
      lineResult.deg = showBillData[i].height > showBillData[i + 1].height ? 91 + deg : 90 - deg;
      if (this.data.timeClass === 1) lineResult.deg = showBillData[i].height > showBillData[i + 1].height ? 92 + deg : 89 - deg;
      // 若没支出收入数据则为90度直线
      if (showBillData[i].height === showBillData[i + 1].height) {
        lineResult.height = (750 * 0.9 / showBillData.length);
        lineResult.deg = 90;
      }
      showBillLine.push(lineResult);
    };
    // 排行榜数据
    const billRanking: any = [];
    const map: Map<string, [string, number]> = new Map();
    // 遍历年份的每日数据
    if (this.data.timeClass === 2) {
      for (let i of dataResult) {
        for (let j of JSON.parse(i.data)) {
          for (let k of j.data) {
            // 数据为空则跳出
            if (JSON.stringify(k) === "{}") continue;
            // 判断分类为支出还是收入来选择数据
            if (k.isExpend !== this.data.isExpend) continue;
            if (map.has(k.type)) map.set(k.type, [k.name, ((map.get(k.type) as any)[1] + Number(k.submitNum))])
            else map.set(k.type, [k.name, Number(k.submitNum)]);
          }
        }
      }
      // 遍历周 月的每日数据
    } else {
      for (let i of dataResult) {
        for (let k of i.data) {
          // 数据为空则跳出
          if (JSON.stringify(k) === "{}") continue;
          // 判断分类为支出还是收入来选择数据
          if (k.isExpend !== this.data.isExpend) continue;
          if (map.has(k.type)) map.set(k.type, [k.name, ((map.get(k.type) as any)[1] + Number(k.submitNum))])
          else map.set(k.type, [k.name, Number(k.submitNum)]);
        }
      }
    }
    // 分类计算
    for (let i of map.keys()) {
      const mapResult: [string, number] | undefined | any = map.get(i);
      const result: any = {};
      result.name = mapResult[0];//名称
      result.type = i;//类别
      result.num = mapResult[1];//数值
      result.width = (mapResult[1] / weekBillNum) * (750 * 0.8 * 0.9);//进度条长度
      result.percent = ((mapResult[1] / weekBillNum) * 100).toFixed(2);//百分比
      billRanking.push(result);
    }
    billRanking.sort(this.sortCompare("num"));
    this.setData({ weekBillNum, showBillData, showBillLine, billRanking });
  }

})
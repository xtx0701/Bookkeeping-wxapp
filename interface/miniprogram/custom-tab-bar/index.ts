Component({
  data: {
    selected: 0,
    "color": "#8a8a8a",
    "selectedColor": "#000000",
    list: [{
      "iconPath": "../resource/image/static/index.png",
      "selectedIconPath": "../resource/image/static/index_selected.png",
      "pagePath": "/pages/index/index",
      "text": "明细"
    },
    {
      "iconPath": "../resource/image/static/chart.png",
      "selectedIconPath": "../resource/image/static/chart_selected.png",
      "pagePath": "/pages/chart/index",
      "text": "图表"
    },
    {
      "iconPath": "",
      "selectedIconPath": "",
      "pagePath": "/pages/release/index",
      "text": ""
    },
    {
      "iconPath": "../resource/image/static/bill.png",
      "selectedIconPath": "../resource/image/static/bill_selected.png",
      "pagePath": "/pages/bill/index",
      "text": "分类"
    },
    {
      "iconPath": "../resource/image/static/mine.png",
      "selectedIconPath": "../resource/image/static/mine_selected.png",
      "pagePath": "/pages/mine/index",
      "text": "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e: any) {
      // 页面跳转方法
      // 获取时间对象的属性
      const data = e.currentTarget.dataset;
      // 获取时间对象属性里面的跳转地址
      const url = data.path;
      // 跳转到tabbar页面(导航栏页面)
      wx.switchTab({ url });
      // 设置参数用于调整tabbar按钮颜色
      this.setData({ selected: data.index });
    }
  }
})
Component({
  methods: {
    userRelease: (): void => {
      if (!wx.getStorageSync("tokenStr")) wx.showModal({
        content: "请先登录再使用",
        success: (res: any) => {
          if (res.confirm) wx.switchTab({ url: "../mine/index" })
        }
      })
      else wx.navigateTo({ url: "/pages/release/index" });
    }
  }
})
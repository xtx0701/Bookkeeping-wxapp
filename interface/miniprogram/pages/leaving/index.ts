import useTopTabbar from "../../resource/utils/components/useTopTabbar";
import formatTimeHandler from '../../resource/utils/userHandler/formatTimeHandler';
Page({
  data: {
    boxHeight: '0',
    text: ''//用户留言信息
  },


  onLoad() {
    // 获取盒子高度
    const { boxHeight }: { boxHeight: string } = useTopTabbar();
    this.setData({ boxHeight });
  },

  onShow() {

  },
  // 获取用户的输入值
  catchUserText: function (event: any): void {
    this.setData({ text: event.detail.value });
  },
  // 提交用户留言
  submitUserText: function (): void {
    const { text }: { text: string } = this.data;
    // 获取用户id和token
    const userInfo = wx.getStorageSync("userInfo");
    const tokenStr = wx.getStorageSync("tokenStr");
    // 请求用户留言接口
    wx.request({
      method: "POST",
      url: "http://localhost:8000/submitUserBillData/setUserLeaving",
      header: { Authorization: tokenStr.replace(/^Bearer/, 'Bearer ') },
      data: {
        openid: userInfo.openid,
        text,
        time: formatTimeHandler().time
      },
      success: (res: any) => {
        // 成功后弹出提示框
        wx.showToast({
          title: "提交成功",
          icon: "success",
        })
        // 跳转首页
        setTimeout(() => {
          wx.switchTab({ url: "../index/index" })
        }, 1500)
      },
      fail: (err: any) => { throw Error(err) }
    })
  }
})
import useTopTabbar from "../../resource/utils/components/useTopTabbar"
Component({
  data: <ITopTabbarAge>{
    boxHeight: '',
    topTabbarTextMarginTop: '',
    imageMarginLeft: '',
    imageMarginTop: '',
    imageBoxHeight: ''
  },
  lifetimes: {
    attached() {
      const {
        boxHeight,
        topTabbarTextMarginTop,
        imageMarginLeft,
        imageMarginTop,
        imageBoxHeight
      }: ITopTabbarAge = useTopTabbar();
      this.setData({
        boxHeight,
        topTabbarTextMarginTop,
        imageMarginLeft,
        imageMarginTop,
        imageBoxHeight
      });
    }
  },
  properties: {
    text: String
  },
  methods: {
    goBackHome() {
      wx.switchTab({ url: "../../pages/index/index" });
    }
  }
})
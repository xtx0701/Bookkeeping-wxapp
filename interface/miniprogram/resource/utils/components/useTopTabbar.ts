// 获取顶部胶囊按钮数据,用于传输给自定义导航栏组件
const getTopTabbarHandler = () => {
  const menuButtonInfo: any = wx.getMenuButtonBoundingClientRect();
  const { top, height }: { top: number, height: number } = menuButtonInfo;
  const boxHeight: string = (top + height + 5).toString();
  const topTabbarTextMarginTop: string = (top + 5).toString();
  const imageMarginLeft: string = (10).toString();
  const imageMarginTop: string = top.toString();
  const imageBoxHeight = height.toString();
  return {
    boxHeight,
    topTabbarTextMarginTop,
    imageMarginLeft,
    imageMarginTop,
    imageBoxHeight,
  };
}

export default getTopTabbarHandler;
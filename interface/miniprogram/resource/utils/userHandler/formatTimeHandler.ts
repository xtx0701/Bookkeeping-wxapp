// 获取当前时间
const formatTime = () => {
  const date: Date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNum = date.getDay();

  const dayArr: string[] = ['日', '一', '二', '三', '四', '五', '六'];

  return { time: [year, month, day].map(formatNumber).join('-'), dayName: dayArr[dayNum], day }


}

// 让个位数的时间前面加0
const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

export default formatTime;

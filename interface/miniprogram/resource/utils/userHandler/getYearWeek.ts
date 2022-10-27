const getYearWeek = (endDate: Date) => {
    //本年的第一天
    var beginDate = new Date(endDate.getFullYear(), 0, 1);
    //星期从0-6,0代表星期天，6代表星期六
    var endWeek = endDate.getDay();
    if (endWeek == 0) endWeek = 7;
    var beginWeek = beginDate.getDay();
    if (beginWeek == 0) beginWeek = 7;
    //计算两个日期的天数差
    var millisDiff = endDate.getTime() - beginDate.getTime();
    var dayDiff = Math.floor((millisDiff + (beginWeek - endWeek) * (24 * 60 * 60 * 1000)) / 86400000);
    return Math.ceil(dayDiff / 7) + 1;
}

export default getYearWeek;
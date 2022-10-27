const userBillHandler = (): IBillHandler => {
    // 用户资料页数据处理方法
    const billHandler: IBillHandler = {
        handleUserBillData: (userInfo: IBillHandlerDataParameter): IHandleUserBillDataResult => {
            // 预算
            const userBudget = userInfo.budget.toFixed(2);
            // 支出
            const userExpend = userInfo.expend.toFixed(2);
            // 收入
            const userIncome = userInfo.income.toFixed(2);
            // 剩余百分比
            const userBalance = (Number(userIncome) - Number(userExpend)).toFixed(2);
            let userRemainder = (Number(userBudget) - Number(userExpend)).toFixed(2);
            let userRemainderPercent = ((Number(userRemainder) / Number(userBudget)) * 100).toFixed(0);
            // 大于100显示100 小于0显示0
            if (userRemainderPercent === 'NaN' || Number(userRemainderPercent) < 0) userRemainderPercent = "0";
            if (userRemainderPercent === 'NaN' || Number(userRemainderPercent) > 100) userRemainderPercent = "100";
            let leftImageRotate, rightImageRotate;
            // 计算角度
            if (Number(userRemainderPercent) === 0) leftImageRotate = rightImageRotate = "180"
            else if (Number(userRemainderPercent) <= 50 && Number(userRemainderPercent) > 0) {
                leftImageRotate = "180";
                rightImageRotate = (180 * ((50 - Number(userRemainderPercent)) / 50)).toString();
            } else {
                leftImageRotate = (180 - (180 * ((Number(userRemainderPercent) - 50) / 50))).toString();
                rightImageRotate = "0";
            }
            // 计算已使用时间
            const useDayCount = Math.ceil(((new Date().getTime()) - (new Date(userInfo.registeredDay).getTime())) / (1000 * 60 * 60 * 24));
            return {
                userBudget,
                userExpend: userExpend.split("."),
                userIncome: userIncome.split("."),
                userBalance: userBalance.split("."),
                userRemainder,
                userRemainderPercent,
                leftImageRotate,
                rightImageRotate,
                totalNumBill: userInfo.totalNumBill,
                continuousClockDay: userInfo.continuousClockDay,
                useDayCount
            }
        }
    }

    return billHandler;
}

export default userBillHandler;
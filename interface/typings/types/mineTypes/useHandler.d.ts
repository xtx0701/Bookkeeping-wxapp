interface IUserHandler {
    userLogin: (userInfo: IUserHandlerParameter) => Promise<IGetUserInfoResult>,
    getUserBillMessage: (openid: string) => Promise<IUserBillMessage>,
    checkUserToken: (tokenStr: string) => Promise<boolean>,
    userClock: (openid: string) => Promise<any>;
    checkUserClock: (openid: string) => Promise<any>;
    addTotalNumBill: (openid: string) => Promise<any>;
    clearBudget: () => Promise<any>;
}

interface IBillHandler {
    handleUserBillData: (userInfo: IBillHandlerDataParameter) => IHandleUserBillDataResult
}

interface IUserBillDataHandler {
    submitUserBillData: (userBillData: IUserBillData, day: number) => Promise<any>,
    getUserBillDayData: (date: string) => Promise<any>;
    checkUserClassificationbudget: (date: string) => Promise<any>;
    addUserClassificationbudget: (date: string, type: string, budget: string) => Promise<any>;
    getUserClassificationbudget: (date: string) => Promise<any>;
    deteleUserClassification: (date: string, type: string) => Promise<any>;
    changeUserClassificationExpend: (date: string, type: string, num: string) => Promise<any>;
    clearUserClassification: (date: string) => Promise<any>;
}

interface IUserHandlerParameter {
    nickName: string, avatarUrl: string, openid: string
}

interface IUserBillMessage {
    results: {
        openid: string,
        budget: number,
        expend: number,
        income: number,
        totalNumBill: number,
        lastClockDay: number,
        registeredDay: string,
        continuousClockDay: number
    }
}

interface IGetUserInfoResult extends IUserBillMessage {
    tokenStr: string
}

interface IBillHandlerDataParameter {
    openid: string,
    budget: number,
    expend: number,
    totalNumBill: number,
    lastClockDay: number,
    registeredDay: string,
    income: number,
    continuousClockDay: number
}

interface IHandleUserBillDataResult {
    userBudget: string,
    userExpend: string[],
    userIncome: string[],
    userBalance: string[],
    userRemainder: string,
    userRemainderPercent: string,
    leftImageRotate: string,
    rightImageRotate: string,
    totalNumBill: number,
    continuousClockDay: number,
    useDayCount: number
}

interface IUserBillData {
    openid: string,
    year: string,
    month: string,
    dayName: string,
    data: { type: string, text: string, submitNum: string, isExpend: boolean, day?: string }
}
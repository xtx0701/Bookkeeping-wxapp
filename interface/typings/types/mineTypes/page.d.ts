// 首页
interface IIndexPageData {
    boxHeight: string,
    time: string[],
    monthExpend: string[],
    monthIncome: string[],
    billDayData: [{
        expend?: string,
        income?: string,
        day?: string,
        data?: {
            dayName: string,
            isExpend: boolean,
            name: string,
            submitNum: string,
            text: string,
            type: string,
        }
    }]
}

// 个人主页
interface IMinePageData {
    isLogin: boolean,
    userInfo: IUserInfo,
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
    useDayCount: number,
    isSetupBudget: boolean,
    boxHeight: string,
    isClock: boolean
}


interface ICallFunctionUserIdResult {
    openid: string
}

interface IGetUserProfileSuccessCallbackUserInfoResult {
    nickName: string,
    avatarUrl: string
}

interface IUserInfo extends ICallFunctionUserIdResult, IGetUserProfileSuccessCallbackUserInfoResult {
    openid: string,
    budget: number,
    expend: number,
    totalNumBill: number,
    lastClockDay: number,
    registeredDay: number,
    income: number,
}

// 发布主页
interface IReleasePageData {
    boxHeight: string,
    isExpend: boolean,
    choseSetupClassification: { type: string, name: string },
    incomeClassification: ISetupClassification[],
    expendClassification: ISetupClassification[],
    isSubmit: boolean,
    submitNum: string,
    isAdd: boolean,
    submitText: string,
    isCompute: boolean,
    numArr: string[],
    datePickerData: string
}

interface ISetupClassification {
    name: string,
    image: string,
    isChose: boolean,
    type: string
}

// 分类页
interface IBillPageData {
    boxHeight: string,
    userBudget: string,
    userRemainder: string,
    userExpend: string[],
    userRemainderPercent: string,
    leftImageRotate: string,
    rightImageRotate: string,
    item_list: string[],
    isSetupBudget: boolean,
    isAddClassification: boolean,
    addClassificationName: string,
    classificationData: parseResult[],
    isHasClassificationData: boolean
}


interface parseResult {
    type: string,
    typeName: string,
    budget: string,
    num: string,
    isOpen: boolean
}



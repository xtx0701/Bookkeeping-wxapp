declare module UserModule {
    interface IUserInfo {
        nickName: string,
        avatarUrl: string,
        openid: string
    }
    interface IMonthData {
        expend: string,
        income: string,
        day: string,
        dayName?: string,
        data: [{ type?: string, text?: string, submitNum?: string, isExpend?: boolean, dayName?: string }]
    }
    interface IUserBillData {
        openid: string,
        year: string,
        month: string,
        dayName: string,
        day: number
        data: {
            submitNum: string,
            type: string,
            name: string,
            text: string,
            isExpend: boolean
        }
    }
}
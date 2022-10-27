import formatTimeHandler from "../../resource/utils/userHandler/formatTimeHandler";
import useUserBillDataHandler from "../../resource/utils/userHandler//useUserBillDataHandler";
Component({
  properties: {
    typeName: String
  },
  methods: {
    changAddClassificationAge() {
      this.triggerEvent("changAddClassificationAgeHandler");
    },
    async changeUserClassificationAge(event: any) {
      if (event.detail.value.setBudgetInput === '') {
        wx.showToast({
          title: '不能为空',
          icon: 'error'
        })
        this.triggerEvent("changAddClassificationAgeHandler");
        return;
      }
      const date: any = formatTimeHandler();
      const userBillDataHandler: any = useUserBillDataHandler();
      await userBillDataHandler.checkUserClassificationbudget(date.time);
      await userBillDataHandler.addUserClassificationbudget(date.time, this.properties.typeName, event.detail.value.setBudgetInput);
      this.triggerEvent("changAddClassificationAgeHandler");
      const results = await userBillDataHandler.getUserClassificationbudget(date.time);
      this.triggerEvent("changeUserClassificationAgeHandler", { results });
    }
  }
})
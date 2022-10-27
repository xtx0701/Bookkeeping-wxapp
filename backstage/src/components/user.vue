<script setup lang="ts" >
import { ref, onMounted, reactive, toRef, computed } from "vue";
import axios from "axios";

let user = reactive<any>({ message: {} });
const hasUser = computed(() => {
  return user.message.length === 0;
});
// 进入页面获取用户个人数据
onMounted(() => {
  getUserMessage();
});
// 请求接口获取数据
const getUserMessage = async () => {
  const results: any = await axios.post(
    "http://localhost:8000/user/getUserMessage"
  );
  user.message = results.data.results;
};
// 删除用户信息
const deleteUser = async (openid: string) => {
  const res = confirm("确定删除吗");
  // 弹框点击确定后通过接口删除
  if (res) {
    await axios.post("http://localhost:8000/user/deleteUser", {
      openid,
    });
    getUserMessage();
  }
};
</script>


<template>
  <div class="userBox">
    <div class="tabbar">
      <div v-if="hasUser" class="err">暂无信息</div>
      <span style="margin-left: 2rem">
        已授权用户人数:{{ user.message.length }}
      </span>
    </div>
    <div v-for="item in user.message" :key="item.openid">
      <div>
        <img :src="item.avatarUrl" alt="logo" />
      </div>
      <div>{{ item.nickName }}</div>
      <div>总记账数:{{ item.totalNumBill }}</div>
      <div>
        <div @click="deleteUser(item.openid)">删除</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabbar {
  font-size: 2rem;
}

.userBox {
  width: 100%;
  height: 100%;
  border-radius: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.userBox > div {
  background-color: white;
  width: 90%;
  height: 5rem;
  display: flex;
}

.userBox > div:nth-child(1) {
  display: flex;
  align-items: center;
  background-color: #f2f7ff;
  font-weight: bolder;
  font-size: 3rem;
}

.userBox > div:nth-child(n + 2) {
  margin-top: 2rem;
}

.userBox > div > div > img {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
}

.userBox > div > div:nth-child(n + 1) {
  width: 5%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 1 */
.userBox > div > div:nth-child(3) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7%;
  height: 100%;
}

.userBox > div > div:nth-child(4) {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  height: 100%;
}

.userBox > div > div:nth-child(4) > div {
  width: 7rem;
  height: 3rem;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 3rem;
  border-radius: 1rem;
  color: white;
}

.err {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
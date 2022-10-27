<script setup lang="ts">
</script>

<template>
  <div class="indexPageBox">
    <div class="indexPage">
      <div class="left">
        <div>
          <div><img src="../assets/image/logo.png" alt="" /></div>
          <div>记账小程序</div>
        </div>
        <div>
          <div>
            <router-link to="/indexPage/user"> 用户管理 </router-link>
          </div>
          <div>
            <router-link to="/indexPage/userMessage"> 用户留言 </router-link>
          </div>
        </div>
      </div>
      <div class="right">
        <div>
          <div>
            <div>
              <img src="../assets/image/loginPageBackgroundImage.jpeg" alt="" />
            </div>
            <div>管理员</div>
          </div>
        </div>

        <div><router-view></router-view></div>
      </div>
    </div>
  </div>
</template>


<style scoped>
a {
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bolder;
  color: #7a88fe;
}

a:active {
  color: #7a88fe;
}

.router-link-active {
  width: 100%;
  height: 100%;
  background-color: #7a88fe;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.indexPageBox {
  width: 100vw;
  height: 100vh;
  background-color: #a4b4fb;
  position: relative;
  overflow: scroll;
  min-width: 120rem;
  min-height: 100vh;
}

.indexPage {
  position: absolute;
  width: 92vw;
  height: 91vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 120rem;
}

.left {
  background-color: white;
  height: 100%;
  width: 30rem;
  border-radius: 2rem 0 0 2rem;
  display: flex;
  flex-direction: column;
  min-width: 30rem;
}

.left > div:nth-child(1) {
  border-radius: 2rem;
  height: 13rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.left > div:nth-child(1) > div:nth-child(1) {
  background-color: #7a88fe;
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.left > div:nth-child(1) > div:nth-child(1) > img {
  width: 80%;
  height: 80%;
}

.left > div:nth-child(1) > div:nth-child(2) {
  font-size: 2rem;
  margin-left: 1rem;
  font-weight: bolder;
}

.left > div:nth-child(2) {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 0 2rem;
}

.left > div:nth-child(2) > div {
  /* background-color: #7a88fe; */
  margin-top: 2rem;
  width: 25rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2rem;
  font-size: 1.7rem;
}

.right {
  background-color: #f2f7ff;
  width: 100rem;
  height: 100%;
  flex: 1;
  border-radius: 0 2rem 2rem 0;
  display: flex;
  flex-direction: column;
  min-width: 100rem;
}

.right > div:nth-child(1) {
  width: 100%;
  height: 10rem;
  border-radius: 2rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.right > div:nth-child(1) > div {
  width: 17rem;
  height: 6rem;
  margin-right: 4rem;
}

.right > div:nth-child(1) > div > div:nth-child(1) > img {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
}

.right > div:nth-child(1) > div > div:nth-child(2) {
  font-size: 1.5rem;
  font-weight: bolder;
  padding-left: 1rem;
}

.right > div:nth-child(1) > div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.right > div:nth-child(2) {
  flex: 1;
  border-radius: 2rem;
}
</style>

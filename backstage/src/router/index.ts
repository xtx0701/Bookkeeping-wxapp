import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/loginPage", name: "loginPage", component: () => import("../components/loginPage.vue")
    },
    {
      path: "/indexPage", name: "indexPage", component: () => import("../components/indexPage.vue"), meta: { needUserInfo: true }, children: [
        { path: "user", name: "user", component: () => import("../components/user.vue") },
        { path: "userMessage", name: "userMessage", component: () => import("../components/userMessage.vue") }
      ],
      beforeEnter: ((to, from, next) => {
        if (to.meta.needUserInfo && from.fullPath === "/loginPage") {
          if (localStorage.getItem("userInfo")) next();
          else next({ path: "/" });
        } else next();
      })
    },
    { path: "/", redirect: "/loginPage" },
    { path: "/:notFound(.*)", redirect: "/" }
  ]
})



export default router

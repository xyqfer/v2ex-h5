<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-title>我</f7-nav-title>
    </f7-navbar>

    <f7-toolbar tabbar labels>
      <f7-link
        tab-link=""
        href="/"
        icon-ios="f7:chat"
        icon-md="material:chat_bubble"
        :animate="false"
        text="最新">
      </f7-link>
      <f7-link
        tab-link=""
        href="/nodes/"
        icon-ios="f7:keyboard"
        icon-md="material:apps"
        :animate="false"
        text="节点">
      </f7-link>
      <f7-link
        href="/discovery/"
        tab-link=""
        icon-ios="f7:compass"
        icon-md="material:explore"
        :animate="false"
        text="发现">
      </f7-link>
      <f7-link
        tab-link=""
        href="/me/"
        tab-link-active
        icon-ios="f7:person_fill"
        icon-md="material:person"
        :animate="false"
        text="我">
      </f7-link>
    </f7-toolbar>

    <f7-list
      media-list
      class="member-list">
      <f7-list-item
        @click="showLoginPage"
        link="#">
        <img slot="media"
             src="@/assets/img/member_0.png" />
        <div slot="title">
          w(ﾟДﾟ)w
        </div>
        <div slot="text">
          失联人员
        </div>
      </f7-list-item>
    </f7-list>

    <f7-list>
      <f7-list-item
        link="#"
        title="设置">
        <div slot="media">
          <f7-icon
            ios="f7:settings_fill"
            md="material:settings"></f7-icon>
        </div>
      </f7-list-item>
    </f7-list>

    <f7-login-screen
      class="demo-login-screen"
      :opened="loginScreenOpened"
      @loginscreen:closed="loginScreenOpened = false">
      <f7-page login-screen>
        <f7-login-screen-title>V2EX</f7-login-screen-title>
        <f7-list form>
          <f7-list-item>
            <f7-label>用户名</f7-label>
            <f7-input
              type="text"
              placeholder="用户名或电子邮箱地址"
              @input="username.value = $event.target.value">
            </f7-input>
          </f7-list-item>
          <f7-list-item>
            <f7-label>密码</f7-label>
            <f7-input
              type="password"
              placeholder=""
              @input="password.value = $event.target.value">
            </f7-input>
          </f7-list-item>
          <f7-list-item>
            <f7-label>验证码</f7-label>
            <f7-input
              type="text"
              placeholder="请输入图中的验证码"
              @input="captcha.value = $event.target.value">
            </f7-input>
            <img
              v-if="initLoginData.captcha"
              :src="initLoginData.captcha"
              class="captcha-img"
              alt="验证码">
          </f7-list-item>
        </f7-list>
        <f7-list>
          <f7-list-button @click="login">登录</f7-list-button>
          <f7-block-footer>
            <f7-link
              link="#"
              @click="loginScreenOpened = false">
              关闭
            </f7-link>
          </f7-block-footer>
        </f7-list>
      </f7-page>
    </f7-login-screen>

  </f7-page>
</template>

<script>
  import {
    f7Page,
    f7Navbar,
    f7NavTitle,
    f7Link,
    f7Toolbar,
    f7List,
    f7ListItem,
    f7Icon,
    f7LoginScreen,
    f7Input,
    f7Button,
    f7LoginScreenTitle,
    f7BlockFooter,
    f7Label,
    f7ListButton,
  } from 'framework7-vue';
  import api from '@/api';

  export default {
    components: {
      f7Page,
      f7Navbar,
      f7NavTitle,
      f7Link,
      f7Toolbar,
      f7List,
      f7ListItem,
      f7Icon,
      f7LoginScreen,
      f7Input,
      f7Button,
      f7LoginScreenTitle,
      f7BlockFooter,
      f7Label,
      f7ListButton,
    },

    data() {
      return {
        initLoginData: {},
        loginScreenOpened: false,
        username: {
          name: '',
          value: '',
        },
        password: {
          name: '',
          value: '',
        },
        captcha: {
          name: '',
          value: '',
        },
      };
    },

    methods: {
      showLoginPage() {
        this.$f7.preloader.show();
        this.$http.get(`${api.initLogin}`)
          .then((result) => {
            if (result.success) {
              this.initLoginData = result.data;
              this.username.name = result.data[0];
              this.password.name = result.data[1];
              this.captcha.name = result.data[2];

              this.$nextTick(() => {
                this.loginScreenOpened = true;
              });
            }
          }).catch((err) => {
            console.log(err);
          }).finally(() => {
          this.$f7.preloader.hide();
        });
      },

      login() {
        this.$f7.preloader.show();
        this.$http.post({
          url: `${api.login}`,
          data: {
            once: this.initLoginData.once,
            cookie: this.initLoginData.cookie,
            key0: this.username.name,
            value0: this.username.value,
            key1: this.password.name,
            value1: this.password.value,
            key2: this.captcha.name,
            value2: this.captcha.value,
          },
        })
          .then((result) => {
            if (result.success) {
              this.loginScreenOpened = false;
            }
          }).catch((err) => {
          console.log(err);
        }).finally(() => {
          this.$f7.preloader.hide();
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  .captcha-img {
    margin-top: 10px;
  }
</style>

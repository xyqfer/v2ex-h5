<template>
  <f7-page>
    <f7-navbar
      title="设置"
      back-link="返回">
    </f7-navbar>

    <f7-block-title class="group-title">

    </f7-block-title>

    <f7-list>
      <f7-list-item
        link="/color/"
        title="颜色">
      </f7-list-item>
    </f7-list>

    <f7-block-title>主题</f7-block-title>
    <f7-list>
      <f7-list-item
        v-for="item in themeList"
        radio
        :checked="item.value === theme"
        :value="item.value"
        :title="item.title"
        :key="item.value"
        @change="onRadioChange"
        name="theme">
      </f7-list-item>
    </f7-list>

    <f7-list inset>
      <f7-list-button
        title="退出登录"
        color="red"
        @click="onLogoutClick">
      </f7-list-button>
    </f7-list>

  </f7-page>
</template>

<script>
  import {
    f7Page,
    f7Navbar,
    f7NavTitle,
    f7Link,
    f7BlockTitle,
    f7Chip,
    f7Block,
    f7Preloader,
    f7List,
    f7ListItem,
    f7ListButton,
  } from 'framework7-vue';
  import api from '@/api';

  export default {
    components: {
      f7Page,
      f7Navbar,
      f7NavTitle,
      f7Link,
      f7BlockTitle,
      f7Chip,
      f7Block,
      f7Preloader,
      f7List,
      f7ListItem,
      f7ListButton,
    },

    created() {
      let storageTheme = localStorage.getItem(this.lsKey);

      if (storageTheme) {
        this.theme = storageTheme;
      }
    },

    data() {
      return {
        lsKey: 'theme',
        theme: 'auto',
        themeList: [{
          title: 'Auto',
          value: 'auto',
        }, {
          title: 'iOS',
          value: 'ios',
        }, {
          title: 'Material Design',
          value: 'md',
        }],
        userInfoKey: 'userInfo',
      };
    },

    methods: {
      onRadioChange(e) {
        localStorage.setItem(this.lsKey, e.target.value);
        location.reload(true);
      },

      onLogoutClick() {
        this.$f7.preloader.show();
        this.$http.post({
          url: api.logout
        })
          .then(() => {
            this.$lf.setItem(this.userInfoKey, {
              isLogin: false,
            })
              .then(() => {
                this.$f7router.back('/me/', {
                  ignoreCache: true,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.$f7.preloader.hide();
          });
      },
    }
  };
</script>

<style lang="scss">

</style>

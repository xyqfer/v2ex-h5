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
    <f7-block-footer class="text-align-right">
      需要 <a href="javascript:location.reload(true);" class="external">刷新页面</a>
    </f7-block-footer>

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
    f7BlockFooter,
  } from 'framework7-vue';

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
      f7BlockFooter,
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
      };
    },

    methods: {
      onRadioChange(e) {
        localStorage.setItem(this.lsKey, e.target.value);
      },
    }
  };
</script>

<style lang="scss">

</style>

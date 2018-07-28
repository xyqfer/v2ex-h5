<template>
  <f7-page
    @page:init="onPageInit">
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
    },

    data() {
      return {
      };
    },

    methods: {
      onPageInit() {

      },
    }
  };
</script>

<style lang="scss">

</style>

<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-title>发现</f7-nav-title>
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
        tab-link-active
        icon-ios="f7:compass_fill"
        icon-md="material:explore"
        :animate="false"
        text="发现">
      </f7-link>
      <f7-link
        tab-link=""
        href="/me/"
        icon-ios="f7:person"
        icon-md="material:person"
        :animate="false"
        text="我">
      </f7-link>
    </f7-toolbar>

    <f7-list>
      <f7-list-item
        link="#"
        title="热门">
        <div slot="media">
          <f7-icon
            ios="f7:graph_round_fill"
            md="material:camera"></f7-icon>
        </div>
      </f7-list-item>
    </f7-list>

    <f7-list>
      <f7-list-item
        link="#"
        title="小工具">
        <div slot="media">
          <f7-icon
            ios="f7:stopwatch_fill"
            md="material:build"></f7-icon>
        </div>
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
    f7Toolbar,
    f7List,
    f7ListItem,
    f7Icon,
  } from 'framework7-vue';

  export default {
    components: {
      f7Page,
      f7Navbar,
      f7NavTitle,
      f7Link,
      f7BlockTitle,
      f7Toolbar,
      f7List,
      f7ListItem,
      f7Icon,
    },

    data() {
      return {

      };
    },

    methods: {

    },
  };
</script>

<style scoped lang="scss">

</style>

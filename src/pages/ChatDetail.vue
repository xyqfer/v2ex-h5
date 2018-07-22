<template>
  <f7-page
    @page:init="onPageInit">
    <f7-navbar title="聊天信息" back-link="返回"></f7-navbar>

    <f7-list v-if="chatInfo.node">
      <f7-list-item
        :link="`${chatInfo.node.url}?title=${chatInfo.node.name}`"
        title="所在节点"
        :after="chatInfo.node.name">
      </f7-list-item>
      <f7-list-item
        :link="`https://www.v2ex.com/t/${chatInfo.id}`"
        title="查看原帖"
        target="_blank"
        :after="`/t/${chatInfo.id}`"
        :external="true">
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
    f7List,
    f7ListItem,
  } from 'framework7-vue';

  export default {
    components: {
      f7Page,
      f7Navbar,
      f7NavTitle,
      f7Link,
      f7List,
      f7ListItem,
    },

    data() {
      return {
        chatInfo: {},
      };
    },

    methods: {
      onPageInit() {
        this.chatInfo = JSON.parse(decodeURIComponent(this.$f7route.params.chatInfo));
      },
    }
  };
</script>

<style lang="scss">
</style>

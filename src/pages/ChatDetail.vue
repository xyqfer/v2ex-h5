<template>
  <f7-page>
    <f7-navbar title="聊天信息" back-link="返回"></f7-navbar>

    <f7-list v-if="chatInfo.node.url">
      <f7-list-item
        :link="`${chatInfo.node.url}?title=${chatInfo.node.name}`"
        title="所在节点"
        :after="chatInfo.node.name">
      </f7-list-item>
      <f7-list-item
        :link="`https://www.v2ex.com/t/${id}`"
        title="查看原帖"
        target="_blank"
        :after="`/t/${id}`"
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

    created() {
      let { id } = this.$f7route.params;
      this.id = id;

      this.$lf.getItem(`/t/${id}/topic`)
        .then((data) => {
          this.chatInfo.node = data.node;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    data() {
      return {
        id: 0,
        chatInfo: {
          node: {},
        },
      };
    },
  };
</script>

<style lang="scss">
</style>

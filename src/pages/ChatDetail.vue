<template>
  <f7-page
    class="chat-detail-page">
    <f7-navbar
      title="聊天信息"
      back-link="返回">
    </f7-navbar>

    <f7-list v-if="chatInfo">
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

    <template
      v-if="chatInfo && chatInfo.tag.length > 0">
      <f7-block-title
        class="group-title">
        标签
      </f7-block-title>
      <f7-block
        strong
        class="node-container">
        <f7-chip
          v-for="node in chatInfo.tag"
          outline
          :text="node.name"
          @click="onChipClick(node.url, node.name)"
          class="node-chip">
        </f7-chip>
      </f7-block>
    </template>

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
    f7BlockTitle,
    f7Chip,
    f7Block,
  } from 'framework7-vue';

  export default {
    components: {
      f7Page,
      f7Navbar,
      f7NavTitle,
      f7Link,
      f7List,
      f7ListItem,
      f7BlockTitle,
      f7Chip,
      f7Block,
    },

    created() {
      let { id } = this.$f7route.params;
      this.id = id;

      this.$lf.getItem(`/t/${id}/topic`)
        .then((data) => {
          this.chatInfo = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    data() {
      return {
        id: 0,
        chatInfo: null,
      };
    },

    methods: {
      onChipClick(url, title) {
        this.$f7router.navigate(`${url}/?title=${title}`);
      },
    }
  };
</script>

<style lang="scss">
  .chat-detail-page {
    .page-content {
      .node-chip {
        margin-right: 6px;
      }

      .group-title {
        margin-top: 20px;
      }

      .node-container {
        margin-bottom: 26px;
      }
    }
  }
</style>

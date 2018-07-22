<template>
  <f7-page
    @page:init="onPageInit">
    <f7-navbar title="所有节点" back-link="返回"></f7-navbar>

    <template v-for="item in nodesData">
      <f7-block-title class="group-title">
        {{item.groupName}}
      </f7-block-title>
      <f7-block strong class="node-container">
        <f7-chip
          v-for="node in item.nodes"
          outline
          :text="node.name"
          @click="onChipClick(node.url, node.name)"
          class="node-chip"></f7-chip>
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
    f7BlockTitle,
    f7Chip,
    f7Block,
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
    },

    data() {
      return {
        nodesData: [],
      };
    },

    methods: {
      onPageInit() {
        this.getData();
      },

      onChipClick(url, title) {
        this.$f7router.navigate(`${url}/?title=${title}`);
      },

      getData() {
        return this.$http.get(api.allNodes)
          .then((result) => {
            if (result.success) {
              this.nodesData = result.data;
            }
          }).catch((err) => {
            console.log(err);
          });
      },
    }
  };
</script>

<style scoped lang="scss">
  .node-chip {
    margin-right: 6px;
  }

  .group-title {
    margin-top: 20px;
  }

  .node-container {
    margin-bottom: 26px;
  }
</style>

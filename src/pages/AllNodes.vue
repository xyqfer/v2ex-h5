<template>
  <f7-page
    class="nodes-page"
    @page:init="onPageInit">
    <f7-navbar
      title="所有节点"
      back-link="返回">
    </f7-navbar>

    <f7-block
      class="text-align-center"
      v-if="!isInit">
      <f7-preloader></f7-preloader>
    </f7-block>

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
    f7Preloader,
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
    },

    data() {
      return {
        nodesData: [],
        isInit: false,
      };
    },

    methods: {
      onPageInit() {
        this.getData().then(() => {
          this.isInit = true;
        });
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

<style lang="scss">

</style>

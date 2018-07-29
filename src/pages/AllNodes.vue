<template>
  <f7-page
    class="nodes-page"
    @page:init="onPageInit">
    <f7-navbar
      title="所有节点"
      back-link="返回">
      <f7-nav-right>
        <f7-link
          class="searchbar-enable"
          data-searchbar=".searchbar-node"
          icon-ios="f7:search_strong"
          icon-md="material:search"
        >
        </f7-link>
      </f7-nav-right>
      <f7-searchbar
        class="searchbar-node"
        expandable
        placeholder="节点"
        disable-button-text="取消"
        search-container=".search-list"
        search-in=".item-title"
        @searchbar:enable="showContent = false"
        @searchbar:disable="onSearchbarDisable"
        @input="onSearchChange"
      ></f7-searchbar>
    </f7-navbar>

    <f7-block
      class="text-align-center"
      v-if="!isInit">
      <f7-preloader></f7-preloader>
    </f7-block>

    <f7-list class="search-list searchbar-found">
      <f7-list-item
        v-for="node in searchResult"
        :title="node.name"
        link="#"
        @click="onChipClick(node.url, node.name)"
      >
      </f7-list-item>
    </f7-list>

    <div
      v-for="item in nodesData"
      v-show="showContent"
    >
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
    </div>

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
    f7Searchbar,
    f7NavRight,
    f7List,
    f7ListItem,
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
      f7Searchbar,
      f7NavRight,
      f7List,
      f7ListItem,
    },

    data() {
      return {
        nodesData: [],
        isInit: false,
        showContent: true,
        searchResult: [],
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

      onSearchChange(e) {
        let query = e.target.value;
        let searchResult = [];

        this.nodesData.forEach((data) => {
          data.nodes.forEach((item) => {
            if (item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
              searchResult.push(item);
            }
          })
        });

        this.searchResult = searchResult;
      },

      onSearchbarDisable() {
        this.showContent = true;
        this.searchResult = [];
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

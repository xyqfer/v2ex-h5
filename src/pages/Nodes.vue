<template>
  <f7-page
    @page:init="onPageInit"
    :ptr="true"
    ref="nodesPage"
    @ptr:refresh="onRefresh">
    <f7-navbar>
      <f7-nav-title>节点</f7-nav-title>
      <f7-nav-right>
        <f7-link
          href="/all-nodes/"
          icon-ios="f7:world"
          icon-md="material:language">
        </f7-link>
      </f7-nav-right>
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
        tab-link-active
        tab-link=""
        href="/nodes/"
        icon-ios="f7:keyboard_fill"
        icon-md="material:apps"
        :animate="false"
        text="节点">
      </f7-link>
      <f7-link
        href="/discovery/"
        tab-link=""
        icon-ios="f7:compass"
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
    f7NavRight,
    f7Toolbar,
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
      f7NavRight,
      f7Toolbar,
    },

    data() {
      return {
        nodesData: [],
        lfKey: 'nodesData',
      };
    },

    created() {
      this.$lf.getItem(this.lfKey)
        .then((data) => {
          if (data) {
            this.nodesData = data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    methods: {
      onPageInit() {
        this.$nextTick(() => {
          this.$f7.ptr.get(this.$refs.nodesPage.$el.querySelector('.ptr-content')).refresh();
        });
      },

      onRefresh(e, done) {
        this.getData()
          .then(() => {
            done();
          });
      },

      onChipClick(url, title) {
        this.$f7router.navigate(`${url}/?title=${title}`);
      },

      getData() {
        return this.$http.get(api.nodes)
          .then((result) => {
            if (result.success) {
              this.nodesData = result.data;
              this.$lf.setItem(this.lfKey, result.data)
                .catch((err) => {
                  console.log(err);
                });
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

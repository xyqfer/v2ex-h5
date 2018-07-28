<template>
  <f7-page
    :ptr="true"
    @page:init="onPageInit"
    @ptr:refresh="onRefresh"
    ref="homePage">
    <f7-navbar>
      <f7-nav-title>V2EX × 🌀</f7-nav-title>
      <f7-nav-right>
        <f7-link
          popover-open=".popover-menu"
          icon-ios="f7:bars"
          icon-md="material:create">
        </f7-link>
      </f7-nav-right>
    </f7-navbar>

    <f7-toolbar tabbar labels>
      <f7-link
        tab-link-active
        tab-link=""
        href="/"
        icon-ios="f7:chat_fill"
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
        tab-link=""
        href="/discovery/"
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

    <f7-fab
      position="right-bottom"
      slot="fixed">
      <f7-icon
        ios="f7:layers_fill"
        md="material:layers"></f7-icon>
      <f7-icon
        ios="f7:close"
        md="material:close"></f7-icon>
      <f7-fab-buttons position="top">
        <f7-fab-button
          v-for="(value, key) in tabConfig"
          @click="onFabClick(key)">
          {{value}}
        </f7-fab-button>
      </f7-fab-buttons>
    </f7-fab>

    <f7-list
      media-list
      class="topic-list">
      <f7-list-item
        v-for="item in listData"
        :link="'/t/' + item.id"
        :key="item.id"
        :class="item.top ? 'top' : ''">
        <img slot="media"
          :src="item.avatar" />
        <div slot="title">
          {{item.title}}
        </div>
        <div slot="text">
          {{item.node}}
          <template v-if="item.time">
            • {{item.time}}
          </template>
        </div>
        <span slot="after">
          <f7-chip :text="item.reply + ''" class="chip-container"></f7-chip>
        </span>
      </f7-list-item>
    </f7-list>

    <f7-popover
      class="popover-menu">
      <f7-list>
        <f7-list-item
          link="/search/"
          popover-close
          title="搜索">
        </f7-list-item>
      </f7-list>
    </f7-popover>
  </f7-page>
</template>

<script>
  import {
    f7Page,
    f7Navbar,
    f7NavTitle,
    f7NavRight,
    f7List,
    f7ListItem,
    f7Link,
    f7Icon,
    f7Chip,
    f7Fab,
    f7FabButtons,
    f7FabButton,
    f7Toolbar,
    f7Popover,
  } from 'framework7-vue';
  import api from '@/api';

  export default {
    components: {
      f7Page,
      f7Navbar,
      f7NavTitle,
      f7NavRight,
      f7List,
      f7ListItem,
      f7Link,
      f7Icon,
      f7Chip,
      f7Fab,
      f7FabButtons,
      f7FabButton,
      f7Toolbar,
      f7Popover,
    },

    data() {
      return {
        listData: [],
        lfKey: 'homeData',
        tabConfig: {
          all: '全部',
          hot: '最热',
          city: '城市',
          play: '好玩',
          creative: '创意',
          tech: '技术',
        },
      };
    },

    created() {
      this.$lf.getItem(this.lfKey)
        .then((data) => {
          if (data) {
            this.listData = data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    methods: {
      onPageInit() {
        this.$nextTick(() => {
          this.$f7.ptr.get(this.$refs.homePage.$el.querySelector('.ptr-content')).refresh();
        });
      },

      onRefresh(e, done) {
        this.getData()
          .then(() => {
            done();
          });
      },

      onFabClick(tabType) {
        this.$f7router.navigate(`/tab/${tabType}?title=${this.tabConfig[tabType]}`);
      },

      getData() {
        return this.$http.get(api.new)
          .then((result) => {
            if (result.success) {
              this.listData = result.data;
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

<style lang="scss">

</style>

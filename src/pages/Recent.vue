<template>
  <f7-page
    @page:init="onPageInit"
    @infinite="onInfinite"
    :infinite-preloader="showPreloader"
    :infinite="true">
    <f7-navbar
      back-link="返回"
      title="最近主题"
      :subtitle="topicCount">
      <f7-nav-right>
        <f7-link
          popover-open=".recent-menu"
          icon-ios="f7:bars"
          icon-md="material:menu">
        </f7-link>
      </f7-nav-right>
    </f7-navbar>

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
      ref="nodeMenu"
      class="recent-menu">
      <f7-list>
        <f7-list-item
          :link="false"
          title="乱序模式"
        >
          <f7-toggle 
            color="blue"
            @toggle:change="onToggleChange"
          ></f7-toggle>
        </f7-list-item>
      </f7-list>
    </f7-popover>
  </f7-page>
</template>

<script>
  import {
    f7Page,
    f7Navbar,
    f7List,
    f7ListItem,
    f7Link,
    f7Icon,
    f7Chip,
    f7Block,
    f7NavRight,
    f7Popover,
    f7Toggle,
  } from 'framework7-vue';
  import api from '@/api';

  export default {
    components: {
      f7Page,
      f7Navbar,
      f7List,
      f7ListItem,
      f7Link,
      f7Icon,
      f7Chip,
      f7Block,
      f7NavRight,
      f7Popover,
      f7Toggle,
    },

    data() {
      return {
        listData: [],
        p: 1,
        total: 1,
        topicCount: '',
        allowInfinite: true,
        showPreloader: true,
        isRandom: false,
      };
    },

    methods: {
      onPageInit() {
        this.getData();
      },

      onInfinite() {
        if (!this.allowInfinite) return;

        this.allowInfinite = false;
        this.getData().then(() => {
          this.showPreloader = this.allowInfinite = !(this.p > this.total);
        });
      },

      onToggleChange(isRandom) {
        this.isRandom = isRandom;
        this.listData = [];
        this.p = isRandom ? this.getRandomPage() : 1;
        
        if (!this.allowInfinite) return;

        this.allowInfinite = false;
        this.getData().then(() => {
          this.allowInfinite = true;
        });
      },

      getRandomPage() {
        return Math.floor(1 + Math.random() * this.total);
      },

      getData() {
        return this.$http.get(`${api.recent}?p=${this.p}`)
          .then((result) => {
            if (result.success) {
              if (this.p >= result.data.total) {
                this.showPreloader = false;
                this.allowInfinite = false;
              }

              this.listData = this.listData.concat(result.data.list);
              this.p = this.isRandom ? this.getRandomPage() : this.p + 1;
              this.total = result.data.total;
              this.topicCount = `${result.data.count} 主题`;
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

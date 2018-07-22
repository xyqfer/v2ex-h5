<template>
  <f7-page
    @page:init="onPageInit"
    @infinite="onInfinite"
    :infinite-preloader="showPreloader"
    :infinite="true">
    <f7-navbar back-link="返回" title="创建的主题"></f7-navbar>

    <f7-list media-list class="topic-list">
      <f7-list-item
        v-for="item in listData"
        :link="'/t/' + item.id"
        :key="item.id">
        <div slot="title">
          {{item.title}}
        </div>
        <div slot="text">
          <template v-if="item.time">
            {{item.time}}
          </template>
        </div>
        <span slot="after">
          <f7-chip :text="item.reply + ''" class="chip-container"></f7-chip>
        </span>
      </f7-list-item>
    </f7-list>
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
  } from 'framework7-vue';
  import api from '@/api';

  export default {
    created() {
      this.name = this.$f7route.params.name;
    },

    components: {
      f7Page,
      f7Navbar,
      f7List,
      f7ListItem,
      f7Link,
      f7Icon,
      f7Chip,
      f7Block,
    },

    data() {
      return {
        listData: [],
        p: 1,
        total: 1,
        allowInfinite: true,
        showPreloader: true,
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

      getData() {
        return this.$http.get(`${api.member}/${this.name}/topic?p=${this.p}`)
          .then((result) => {
            if (result.success) {
              if (this.p >= result.data.total) {
                this.showPreloader = false;
                this.allowInfinite = false;
              }

              this.listData = this.listData.concat(result.data.topic);
              this.p = this.p + 1;
              this.total = result.data.total;
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

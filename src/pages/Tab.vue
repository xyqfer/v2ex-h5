<template>
  <f7-page @page:init="onPageInit">
    <f7-navbar
      back-link="返回"
      :title="title">
    </f7-navbar>

    <f7-block
      class="text-align-center"
      v-if="!isInit">
      <f7-preloader></f7-preloader>
    </f7-block>

    <f7-list media-list class="topic-list">
      <f7-list-item
        v-for="item in listData"
        :link="'/t/' + item.id"
        :key="item.id">
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
    f7Preloader,
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
      f7Preloader,
    },

    data() {
      return {
        listData: [],
        name: '',
        title: '',
        isInit: false,
      };
    },

    created() {
      this.name = this.$f7route.params.name;
      this.title = this.$f7route.query.title;
    },

    methods: {
      onPageInit() {
        this.getData().then(() => {
          this.isInit = true;
        });
      },

      getData() {
        const name = this.name;

        return this.$http.get(`${api.tab}/${name}?p=${this.p}`)
          .then((result) => {
            if (result.success) {
              this.listData = result.data;
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

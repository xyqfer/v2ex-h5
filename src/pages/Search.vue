<template>
  <f7-page
    class="search-page"
    @infinite="onInfinite"
    :infinite-preloader="showPreloader"
    :infinite="true">
    <f7-navbar
      back-link="返回"
      title="搜索">
      <f7-subnavbar
        :inner="false">
        <f7-searchbar
          :custom-search="true"
          placeholder="节点、帖子"
          disable-button-text="取消"
          @keyup.enter.native="search"
        ></f7-searchbar>
      </f7-subnavbar>
    </f7-navbar>

    <f7-block
      class="text-align-center"
      v-if="isSearching">
      <f7-preloader></f7-preloader>
    </f7-block>

    <div class="search-card-container">
      <f7-card
        v-for="card in result"
        :key="card.url">
        <f7-card-header>
          <f7-link
            :href="card.url"
            :text="card.title">
          </f7-link>
        </f7-card-header>
        <f7-card-content>
          {{card.desc}}
        </f7-card-content>
      </f7-card>
    </div>

  </f7-page>
</template>
<script>
  import {
    f7Navbar,
    f7Page,
    f7Searchbar,
    f7Subnavbar,
    f7Card,
    f7CardHeader,
    f7CardContent,
    f7Link,
    f7Preloader,
    f7Block,
  } from 'framework7-vue';
  import api from '@/api';

  export default {
    components: {
      f7Navbar,
      f7Page,
      f7Searchbar,
      f7Subnavbar,
      f7Card,
      f7CardHeader,
      f7CardContent,
      f7Link,
      f7Preloader,
      f7Block,
    },

    data() {
      return {
        query: '',
        result: [],
        isSearching: false,
        p: 1,
        showPreloader: false,
      };
    },

    methods: {
      search(e) {
        this.query = e.target.value;
      },

      getSearchData() {
        this.isSearching = true;
        return this.$http.get(`${api.search}q=${this.query}&p=${this.p}`)
          .then((result) => {
            if (result.success) {
              this.result = this.result.concat(result.data);
              this.p = this.p + 1;
            }
          }).catch((err) => {
            console.log(err);
          }).finally(() => {
            this.isSearching = false;
          });
      },

      onInfinite() {
        if (!this.isSearching) {
          this.showPreloader = true;
          this.getSearchData().then(() => {
            this.showPreloader = false;
          });
        }
      },
    },

    watch: {
      query() {
        this.p = 1;
        this.result = [];
        this.showPreloader = false;
        this.$nextTick(() => {
          this.getSearchData();
        });
      }
    }
  }
</script>

<style lang="scss">
  .search-page {
    .search-card-container {
      .card-header {
        min-height: initial;

        a.link {
          line-height: initial;
          height: initial;
          margin-top: 0;
          bottom: 0;
          padding-bottom: 10px;
        }
      }
    }
  }
</style>

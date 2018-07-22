<template>
  <f7-app :params="f7Params">
    <f7-statusbar></f7-statusbar>
    <f7-view
      url="/"
      :main="true"
      :push-state="true"
      :push-state-root="root"
      :stack-pages="true"
      class="ios-edges">
    </f7-view>
  </f7-app>
</template>
<script>
  import {
    f7App,
    f7Panel,
    f7View,
    f7Statusbar,
  } from 'framework7-vue';
  import routes from './routes';

  export default {
    components: {
      f7App,
      f7Panel,
      f7View,
      f7Statusbar,
    },

    created() {
      this.root = process.env.VUE_APP_BASE_URL;
    },
    data() {
      let theme = 'auto';

      return {
        f7Params: {
          theme,
          routes,
          id: 'm.v2ex',
        },
        root: '/',
      };
    },
  };
</script>

<style lang="scss">
  @import "~@/assets/css/framework7.css";
  @import "~@/assets/css/app.css";

  body {
    body {
      font-family: PingFang-SC-Regular, "Helvetica Neue", miui, Helvetica, sans-serif;
    }
  }

  pre {
    white-space: normal;
  }

  .ios,
  .md {
    .topic-list {
      margin: 0;

      .item-media {
        img {
          width: 40px;
          border-radius: 4px;
        }
      }

      a.item-link {
        .item-title-row {
          padding-right: 0;
          background-image: none;

          .item-title {
            white-space: initial;
          }
        }
      }

      .item-inner {
        .item-after {
          font-size: 14px;
        }
      }

      .chip-container {
        height: 20px;
      }
    }
  }
</style>

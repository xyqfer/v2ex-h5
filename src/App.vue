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
  import api from '@/api';

  export default {
    components: {
      f7App,
      f7Panel,
      f7View,
      f7Statusbar,
    },

    created() {
      this.root = process.env.VUE_APP_BASE_URL;

      this.$lf.getItem(this.userInfoKey)
        .then((data) => {
          if (data && data.isLogin) {
            this.$http.get(`${api.checkLogin}`)
              .then((result) => {
                if (result.success && !result.data.isLogin) {
                  this.$lf.setItem(this.userInfoKey, {
                    isLogin: false,
                    name: null,
                  })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    mounted() {
      this.$lf.getItem('layout')
        .then((layout) => {
          if (layout) {
            this.$f7.root.removeClass('theme-dark theme-light').addClass(`theme-${layout}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      this.$lf.getItem('color')
        .then((color) => {
          if (color) {
            const currentColorClass = this.$f7.root[0].className.match(/color-theme-([a-z]*)/);

            if (currentColorClass) {
              this.$f7.root.removeClass(currentColorClass[0]);
            }
            this.$f7.root.addClass(`color-theme-${color}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    data() {
      let storageTheme = localStorage.getItem('theme');
      let theme = storageTheme || 'auto';

      return {
        f7Params: {
          theme,
          routes,
          id: 'm.v2ex',
        },
        root: '/',
        userInfoKey: 'userInfo',
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
    .block-title {
      text-transform: initial;
    }

    .topic-list {
      margin: 0;
      
      .media-item.top {
        background-color: #f3f2f7;
      }

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

    .theme-dark {
      .topic-list {
        .media-item.top {
          background-color: #333;
        }
      }
    }
  }
</style>

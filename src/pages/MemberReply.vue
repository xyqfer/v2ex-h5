<template>
  <f7-page
      @page:init="onPageInit"
      @infinite="onInfinite"
      :infinite-preloader="showPreloader"
      :infinite="true">
    <f7-navbar title="创建的回复" back-link="返回"></f7-navbar>

    <f7-block class="text-align-center" v-if="!isInit">
      <f7-preloader></f7-preloader>
    </f7-block>

    <f7-messages ref="messages" :scroll-messages="false" class="v2ex-message-list">
      <f7-message
          v-for="(message, index) in messagesData"
          :key="index"
          :type="message.type"
          :name="message.name"
          :first="isFirstMessage(message, index)"
          :last="isLastMessage(message, index)"
          :tail="isTailMessage(message, index)"
          @click="onMessageClick">
        <div slot="text" v-if="message.text" v-html="message.text"></div>
        <div slot="text-footer">
          <template v-if="message.meta.time">
            {{message.meta.time}}
          </template>
          <template v-if="message.meta.node">
            {{message.meta.node}}
          </template>
        </div>
      </f7-message>
    </f7-messages>

    <f7-photo-browser
        :photos="photos"
        theme="dark"
        type="popup"
        ref="photoBrowser"
        back-link-text="关闭"
        navbar-of-text="/"
        :toolbar="false"
        :key="photoBrowserKey">
    </f7-photo-browser>
  </f7-page>
</template>

<script>
  import {
    f7Navbar,
    f7Page,
    f7Messages,
    f7MessagesTitle,
    f7Message,
    f7Messagebar,
    f7Link,
    f7Preloader,
    f7Block,
    f7Icon,
    f7PhotoBrowser,
  } from 'framework7-vue';
  import api from '@/api';

  export default {
    components: {
      f7Navbar,
      f7Page,
      f7Messages,
      f7MessagesTitle,
      f7Message,
      f7Messagebar,
      f7Link,
      f7Preloader,
      f7Block,
      f7Icon,
      f7PhotoBrowser,
    },
    created() {
      this.name = this.$f7route.params.name;
    },
    mounted() {
      this.$f7ready(() => {
        this.messages = this.$refs.messages.f7Messages;
      });
    },
    data() {
      return {
        messagesData: [],
        id: 0,
        p: 1,
        total: 1,
        isInit: false,
        photos: [],
        photoBrowserKey: 0,
        allowInfinite: true,
        showPreloader: true,
      };
    },
    methods: {
      onPageInit() {
        this.getData().then(() => {
          this.isInit = true;
        });
      },

      onInfinite() {
        if (!this.allowInfinite) return;

        this.allowInfinite = false;
        this.getData().then(() => {
          this.showPreloader = this.allowInfinite = !(this.p > this.total);
        });
      },

      getData() {
        return this.$http.get(`${api.member}/${this.name}/reply?p=${this.p}`)
          .then((result) => {
            if (result.success) {
              let messagesData = [];
              let name = this.name;

              result.data.reply.forEach((item) => {
                let received = item.received;
                let sent = item.sent;

                messagesData.push({
                  name: received.author,
                  type: 'received',
                  text: received.content,
                  meta: {
                    node: received.node.name,
                  }
                });

                messagesData.push({
                  name,
                  type: 'sent',
                  text: sent.content,
                  meta: {
                    time: sent.time,
                  }
                });
              });

              if (this.p >= result.data.total) {
                this.showPreloader = false;
                this.allowInfinite = false;
              }

              this.messagesData = this.messagesData.concat(messagesData);
              this.p = this.p + 1;
              this.total = result.data.total;
            }
          });
      },

      onMessageClick(e) {
        if (e.target.nodeName.toLowerCase() === 'img') {
          let url = e.target.getAttribute('src');

          if (url) {
            this.photos = [url];
            this.photoBrowserKey = +new Date();

            this.$nextTick(() => {
              this.$refs.photoBrowser.open(0);
            });
          }
        }
      },

      isFirstMessage(message, index) {
        const self = this;
        const previousMessage = self.messagesData[index - 1];
        if (message.isTitle) return false;
        if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
        return false;
      },

      isLastMessage(message, index) {
        const self = this;
        const nextMessage = self.messagesData[index + 1];
        if (message.isTitle) return false;
        if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
        return false;
      },

      isTailMessage(message, index) {
        const self = this;
        const nextMessage = self.messagesData[index + 1];
        if (message.isTitle) return false;
        if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
        return false;
      },
    },
  };
</script>

<style lang="scss">
  .v2ex-message-list {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    .embedded_image {
      max-width: 100%;
    }

    .markdown_body {
      img {
        width: 100%;
      }
    }

    iframe {
      width: 100%;
    }
  }
</style>

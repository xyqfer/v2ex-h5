<template>
  <f7-page
      @page:init="onPageInit"
      @infinite="onInfinite"
      :infinite-preloader="showPreloader"
      :infinite="true">
    <f7-navbar title="群聊" back-link="返回">
      <f7-nav-right>
        <f7-link
            @click="onNavRightClick"
            icon-ios="f7:more"
            icon-md="material:menu">
        </f7-link>
      </f7-nav-right>
    </f7-navbar>

    <f7-block class="text-align-center" v-if="!isInit">
      <f7-preloader></f7-preloader>
    </f7-block>

    <f7-messages ref="messages" :scroll-messages="false" class="v2ex-message-list">
      <f7-message
          v-for="(message, index) in messagesData"
          :key="index"
          :type="message.type"
          :image="message.image"
          :name="message.name"
          :avatar="message.avatar"
          :first="isFirstMessage(message, index)"
          :last="isLastMessage(message, index)"
          :tail="isTailMessage(message, index)"
          @click:avatar="onClickMember(message.name)"
          @click:bubble="message.meta.floor ? onClickBubble(index, $event) : ''"
          @click="onMessageClick">
        <div slot="text" v-if="message.text" v-html="message.text"></div>
        <div slot="text-header" v-if="message.meta.floor">
          {{message.meta.floor}}楼
        </div>
        <div slot="text-header" v-if="message.meta.addition">
          {{message.meta.addition.title}}
        </div>
        <div slot="text-footer">
          <template v-if="message.meta.time">
            {{message.meta.time}}
          </template>
          <template v-if="message.meta.status">
            {{message.meta.status}}
          </template>
          <template v-if="message.meta.addition">
            {{message.meta.addition.time}}
          </template>
          <template v-if="message.meta.thank">
            •&nbsp;<span>{{message.meta.thank}}</span>
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

    <f7-popover ref="popover">
      <f7-list>
        <f7-list-item
            link=""
            @click="onShowChatClick"
            popover-close
            title="查看对话">
        </f7-list-item>
      </f7-list>
    </f7-popover>
  </f7-page>
</template>

<script>
  import {
    f7Navbar,
    f7Page,
    f7NavRight,
    f7Messages,
    f7MessagesTitle,
    f7Message,
    f7Messagebar,
    f7Link,
    f7Preloader,
    f7Block,
    f7Icon,
    f7PhotoBrowser,
    f7Popover,
    f7List,
    f7ListItem,
  } from 'framework7-vue';
  import api from '@/api';

  export default {
    components: {
      f7Navbar,
      f7NavRight,
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
      f7Popover,
      f7List,
      f7ListItem,
    },
    created() {
      this.id = this.$f7route.params.id;
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
        node: {},
        dialogData: [],
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

      onNavRightClick() {
        if (this.node.url) {
          const chatInfo = JSON.stringify({
            node: this.node,
            id: this.id,
          });

          this.$f7router.navigate(`/chatDetail/${encodeURIComponent(chatInfo)}`);
        }
      },

      onClickBubble(index, e) {
        let bubbleData = Object.assign({}, this.messagesData[index]);
        let at = bubbleData.meta.at;

        if (at.length > 0) {
          let fromData = this.messagesData.slice(0, index).filter((item) => {
            return at.includes(item.name);
          });

          if (fromData.length > 0) {
            bubbleData.type = 'sent';
            this.dialogData = fromData.concat(bubbleData);

            this.$nextTick(() => {
              this.$refs.popover.open(e.target);
            });
          }
        }
      },

      onShowChatClick() {
        this.$f7router.navigate(`/dialog/${encodeURIComponent(JSON.stringify(this.dialogData))}`);
      },

      getData() {
        const id = this.id;

        return this.$http.get(`${api.t}/${id}?p=${this.p}`)
          .then((result) => {
            if (result.success) {
              let messagesData = [];

              if (this.p === 1) {
                let topicData = result.data.topic;

                messagesData.push({
                  type: 'received',
                  name: topicData.author,
                  text: topicData.title,
                  avatar: topicData.avatar,
                  meta: {
                    time: topicData.time,
                  }
                });

                if (topicData.content !== '') {
                  messagesData.push({
                    type: 'received',
                    name: topicData.author,
                    text: topicData.content,
                    avatar: topicData.avatar,
                    meta: {
                      status: topicData.status,
                    }
                  });
                }

                if (topicData.additions) {
                  topicData.additions.forEach((item) => {
                    messagesData.push({
                      type: 'received',
                      name: topicData.author,
                      text: item.content,
                      avatar: topicData.avatar,
                      meta: {
                        addition: {
                          time: item.time,
                          title: item.title,
                        }
                      }
                    });
                  });
                }

                this.node = topicData.node;
              }

              result.data.reply.forEach((item) => {
                messagesData.push({
                  name: item.author,
                  type: 'received',
                  text: item.content,
                  avatar: item.avatar,
                  meta: {
                    floor: item.floor,
                    time: item.time,
                    thank: item.thank,
                    at: item.at,
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

      onClickMember(name) {
        this.$f7router.navigate(`/member/${name}/`);
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
    /*background-image: url(https://images.unsplash.com/photo-1530038948867-2efb2d4f3597?ixlib=rb-0.3.5&s=d44aaba93b7520000c295eb12c1156b5&auto=format&fit=crop&w=668&q=80);*/
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

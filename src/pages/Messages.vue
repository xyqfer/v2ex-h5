<template>
  <f7-page
    @page:init="onPageInit"
    @infinite="onInfinite"
    :infinite-preloader="showPreloader"
    :infinite="true"
    class="messages-page">
    <f7-navbar
      title="群聊"
      back-link="返回"
      :subtitle="count">
      <f7-nav-right>
        <f7-link
          @click="onNavRightClick"
          icon-ios="f7:more_fill"
          icon-md="material:menu">
        </f7-link>
      </f7-nav-right>
    </f7-navbar>

    <f7-block
      class="text-align-center"
      v-if="!isInit">
      <f7-preloader></f7-preloader>
    </f7-block>

    <f7-messages
      ref="messages"
      :scroll-messages="false"
      class="v2ex-message-list">
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
        @click:bubble="onMessageClick(index, message.meta.floor, $event)">
        <div
          slot="text"
          v-if="message.text"
          v-html="message.text">
        </div>
        <div slot="text-header">
          <template v-if="message.meta.floor">
            {{message.meta.floor}}楼
            <template v-if="author === message.name">
              •&nbsp;楼主
            </template>
          </template>
          <template v-if="message.meta.addition">
            {{message.meta.addition.title}}
          </template>
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
            •&nbsp;{{message.meta.thank}}
          </template>
          <template v-if="message.meta.click">
            •&nbsp;{{message.meta.click}}
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

    <f7-popover
      ref="popover">
      <f7-list>
        <f7-list-item
          v-if="isShowChat"
          link=""
          @click="onShowChatClick"
          popover-close
          title="查看对话">
        </f7-list-item>
        <f7-list-item
          v-if="isShowPopup"
          link=""
          @click="showPopup"
          popover-close
          title="新页面查看">
        </f7-list-item>
      </f7-list>
    </f7-popover>

    <f7-popup
      class="demo-popup"
      :opened="popupOpened"
      @popup:closed="popupOpened = false">
      <f7-page>
        <f7-navbar
          title="内容">
          <f7-nav-right>
            <f7-link popup-close>关闭</f7-link>
          </f7-nav-right>
        </f7-navbar>
        <f7-block
          class="popup-block-content"
          v-html="popupContent">
        </f7-block>
      </f7-page>
    </f7-popup>
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
    f7Popup,
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
      f7Popup,
    },
    created() {
      let { id } = this.$f7route.params;
      let lfKey = `/t/${id}/topic`;

      this.id = id;
      this.lfKey = lfKey;
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
        lfKey: '',
        p: 1,
        total: 1,
        isInit: false,
        photos: [],
        node: {},
        dialogData: [],
        photoBrowserKey: 0,
        allowInfinite: true,
        showPreloader: true,
        count: '',
        author: '',
        popupOpened: false,
        popupContent: '',
        isShowChat: true,
        isShowPopup: true,
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
          this.$f7router.navigate(`/chatDetail/${this.id}`);
        }
      },

      showPopover(index, e) {
        if (index !== 0) {
          // 查看对话
          if (this.messagesData[index].meta.at) {
            let bubbleData = {...this.messagesData[index]};
            let at = [...bubbleData.meta.at];
            let atLength = at.length;

            if (atLength > 0) {
              let count = 0;
              let fromData = [];
              let subMessages = this.messagesData.slice(0, index);

              for (let i = index - 1; i >=0; i--) {
                let item = subMessages[i];
                let atIndex = at.indexOf(item.name);

                if (atIndex !== -1 && !fromData[atIndex]) {
                  fromData[atIndex] = item;

                  if (++count >= atLength) {
                    break;
                  }
                }
              }

              if (count === atLength) {
                bubbleData.type = 'sent';
                this.dialogData = fromData.concat(bubbleData);
                this.isShowChat = true;
              } else {
                this.isShowChat = false;
              }
            } else {
              this.isShowChat = false;
            }
          } else {
            this.isShowChat = false;
          }

          // 新页面查看
          this.popupContent = this.messagesData[index].text;
          this.isShowPopup = true;

          this.$nextTick(() => {
            this.$refs.popover.open(e.target);
          });
        }
      },

      showPopup() {
        this.popupOpened = true;
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
              let topicData = result.data.topic;

              this.count = topicData.count;
              this.$lf.setItem(this.lfKey, topicData)
                .catch((err) => {
                  console.log(err);
                });

              if (this.p === 1) {
                this.author = topicData.author;

                messagesData.push({
                  type: 'received',
                  name: topicData.author,
                  text: topicData.title,
                  avatar: topicData.avatar,
                  meta: {
                    time: topicData.time,
                    click: topicData.click,
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

      onMessageClick(index, floor, e) {
        let nodeName = e.target.nodeName.toLowerCase();

        if (nodeName === 'img') {
          let url = e.target.getAttribute('src');

          if (url) {
            this.photos = [url];
            this.photoBrowserKey = +new Date();

            this.$nextTick(() => {
              this.$refs.photoBrowser.open(0);
            });
          }
        } else if (nodeName !== 'a') {
          this.showPopover(index, e);
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
  .ios,
  .md {
    .view {
      .messages-page {
        background: initial;
        background-image: url(~@/assets/img/background_1.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;

        .messages-content {
          background: initial;

          .v2ex-message-list {
            background: initial;

            .message-received {
              .message-bubble {
                background-color: #fff;
              }
            }

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
        }
      }
    }
  }

  .ios {
    .theme-dark {
      .view {
        .messages-page {
          .messages-content {
            .message-received {
              .message-bubble {
                background-color: #333;
              }
            }
          }
        }
      }
    }
  }

  .md {
    .theme-dark {
      .view {
        .messages-page {
          .messages-content {
            .message-received {
              .message-bubble {
                background-color: #fff;
              }
            }
          }
        }
      }
    }
  }

  .popup {
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

    .popup-block-content {
      word-break: break-all;
    }
  }
</style>

<template>
  <f7-page
      @page:init="onPageInit">
    <f7-navbar title="对话详情" back-link="返回"></f7-navbar>

    <f7-messages ref="dialog" :scroll-messages="false" class="v2ex-message-list">
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
    f7PhotoBrowser,
  } from 'framework7-vue';

  export default {
    components: {
      f7Navbar,
      f7Page,
      f7Messages,
      f7MessagesTitle,
      f7Message,
      f7Messagebar,
      f7Link,
      f7PhotoBrowser,
    },

    mounted() {
      this.$f7ready(() => {
        this.messages = this.$refs.dialog.f7Messages;
      });
    },

    data() {
      return {
        messagesData: [],
        photos: [],
        photoBrowserKey: 0,
      };
    },

    methods: {
      onPageInit() {
        this.messagesData = JSON.parse(decodeURIComponent(this.$f7route.params.chatData));
      },

      onClickMember(name) {
        this.$f7router.navigate(`/member/${name}/`);
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
    }
  };
</script>

<style lang="scss">
</style>

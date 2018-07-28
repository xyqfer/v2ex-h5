<template>
  <f7-page
    @page:init="onPageInit">
    <f7-navbar
      title="详细资料"
      back-link="返回">
    </f7-navbar>

    <f7-block
      class="text-align-center"
      v-if="!isInit">
      <f7-preloader></f7-preloader>
    </f7-block>

    <f7-list media-list class="member-list" v-if="memberData.name">
      <f7-list-item>
        <img
          slot="media"
          @click="$refs.photoBrowser.open()"
          :src="memberData.avatar" />
        <div slot="title">
          {{memberData.name}}
        </div>
        <div slot="text">
          {{memberData.info}}
        </div>
      </f7-list-item>
    </f7-list>

    <f7-list v-if="memberData.rank">
      <f7-list-item
        link=""
        title="今日活跃度排名"
        :after="memberData.rank">
      </f7-list-item>
    </f7-list>

    <f7-list class="creation-list" v-if="memberData.reply && memberData.topic">
      <f7-list-item
        :link="memberData.topic.has"
        title="创建的主题"
        :after="memberData.topic.reason">
      </f7-list-item>
      <f7-list-item
        :link="memberData.reply.has"
        title="创建的回复"
        :after="memberData.reply.reason">
      </f7-list-item>
    </f7-list>

    <f7-photo-browser
      v-if="memberData.avatar"
      :photos="[memberData.avatar]"
      theme="dark"
      ref="photoBrowser"
      type="popup"
      back-link-text="关闭"
      navbar-of-text="/"
      :toolbar="false">
    </f7-photo-browser>

  </f7-page>
</template>

<script>
  import {
    f7Page,
    f7Navbar,
    f7NavTitle,
    f7Link,
    f7BlockTitle,
    f7List,
    f7ListItem,
    f7Preloader,
    f7Block,
    f7PhotoBrowser,
  } from 'framework7-vue';
  import api from '@/api';

  export default {
    components: {
      f7Page,
      f7Navbar,
      f7NavTitle,
      f7Link,
      f7BlockTitle,
      f7List,
      f7ListItem,
      f7Preloader,
      f7Block,
      f7PhotoBrowser,
    },

    created() {
      let name = this.$f7route.params.name;
      let lfKey = `/member/${this.name}`;

      this.name = name;
      this.lfKey = lfKey;
    },

    data() {
      return {
        memberData: {},
        name: '',
        isInit: false,
        lfKey: '',
      };
    },

    methods: {
      onPageInit() {
        this.getData().then(() => {
          this.isInit = true;
        });
      },

      getData() {
        return this.$http.get(`${api.member}/${this.name}`)
          .then((result) => {
            if (result.success) {
              this.memberData = result.data;
              this.$lf.setItem(this.lfKey, result.data)
                .catch((err) => {
                  console.log(err);
                });
            }
          }).catch((err) => {
            console.log(err);
          });
      },
    }
  };
</script>

<style lang="scss">
  .ios,
  .md {
    .member-list {
      .item-media {
        img {
          width: 75px;
          border-radius: 6px;
        }
      }
    }

    .creation-list {
      .item-after {
        max-width: 65%;
        white-space: normal;
      }
    }
  }
</style>

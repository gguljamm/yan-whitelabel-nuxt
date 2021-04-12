<template>
  <div class="gnbWrapper"
    v-if="arrClass.indexOf('onlyBtn') < 0"
    :class="arrClass.concat($store.state.channelInfo.header || arrClass.indexOf('popup') >= 0 ? [] : ['hide'])"
  >
    <div>
      <div class="fixWidth">
        <button class="btnBack" @click="arrClass && arrClass.indexOf('popBack') !== -1 ? $emit('close') : clickBack()"></button>
        <div
          class="title"
        >{{ title }}</div>
        <button class="btnHome" @click="clickHome()"></button>
      </div>
    </div>
  </div>
  <div v-else class="onlyBtnBack">
    <div class="fixWidth">
      <button @click="clickBack()"></button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arrClass: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      titleWidth: 0,
    };
  },
  methods: {
    clickBack() {
      if (this.$store.state.history.arrHistory.length > 0) {
        this.$store.commit('history/popHistory');
        this.$router.back();
      } else if (this.$route.params.popup) {
        this.$router.push({
          path: this.$route.path.replace(`/${this.$route.params.popup}`, ''),
          query: this.$route.query,
        });
      } else {
        this.$router.push(this.$route.path.indexOf('leisure') >= 0 ? '/leisure' : '/');
      }
    },
    clickHome() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      if (this.$route.path.indexOf('leisure') >= 0 || this.$route.params.type === 'leisure') {
        this.$router.push('/leisure');
      } else {
        this.$router.push('/');
      }
    },
  },
  mounted() {
    this.titleWidth = (window.innerWidth > 768 ? 768 : window.innerWidth) - 88;
  },
};
</script>

<style lang="scss">
.gnbWrapper{
  width: 100%;
  height: $header * 1px;
  &.hide{
    display: none;
  }
  &.invisible:not(.fade) {
    > div {
      background-color: rgba(255, 255, 255, 0);
      > div {
        position: relative;
        > button{
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
          background-color: rgba(255, 255, 255, .8);
          top: (($header - 28) / 2) * 1px;
          height: 28px;
          width: 28px;
          border-radius: 14px;
          position: absolute;
          background-position: center;
          &.btnBack{
            left: 14px;
          }
          &.btnHome{
            right: 19px;
          }
        }
      }
    }
    height: 0;
  }
  &.invisible.fade{
    > div{
      background-color: rgba(255, 255, 255, 1);
    }
    height: 0;
  }
  &.home, &.search{
    .btnHome{
      display: none;
    }
  }

  &.popup{
    > div > div .btnBack{
      background-image: url(~assets/img/icon-close.svg);
    }
    > div > div .btnHome{
      display: none;
    }
  }
  &.popBack{
    > div{
      > div{
        font-weight: bold;
      }
    }
  }
  > div{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: $header * 1px;
    background-color: rgba(255, 255, 255, 1);
    z-index: 10;
    transition: background-color .3s ease;
    > div{
      height: $header * 1px;
      position: relative;
      .btnBack{
        height: $header * 1px;
        width: 40px;
        background-position: right center;
        background-size: 24px;
        background-repeat: no-repeat;
        background-image: url(~assets/img/icon-chevron-left.svg);
        float: left;
      }
      .title {
        line-height: $header * 1px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: absolute;
        text-align: center;
        left: 40px;
        top: 0;
        bottom: 0;
        right: 45px;
        pointer-events: none;
      }
      .btnHome{
        float: right;
        height: $header * 1px;
        width: 45px;
        background-position: left center;
        background-size: 24px;
        background-repeat: no-repeat;
        background-image: url(~assets/img/icon-home-black.svg);
      }
    }
  }
}
.onlyBtnBack{
  position: fixed;
  top: 0;
  left: 0;
  height: 0;
  z-index: 10;
  width: 100%;
  > div{
    height: 0;
    overflow: visible;
    > button{
      height: $header * 1px;
      width: 44px;
      background-size: 24px;
      background: url(~assets/img/icon-close.svg) center center no-repeat;
    }
  }

}
</style>

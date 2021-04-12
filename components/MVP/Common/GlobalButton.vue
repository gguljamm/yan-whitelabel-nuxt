<template>
  <div class="globalBtnWrap">
    <div :class="{
      transparent,
      shadow,
      selected: subText,
    }">
      <div class="fixWidth">
        <div v-if="subText">
          <div class="text">{{ subText.text }}</div>
          <div class="price" v-html="subText.price"></div>
        </div>
        <button
          @click="$emit('submit')"
          :class="{
            disabled,
          }"
        >{{ text }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '검색',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    subText: {},
    noShadow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      shadow: false,
    };
  },
  methods: {
    scroll() {
      this.shadow = document.documentElement.scrollTop + window.innerHeight < window.document.body.clientHeight;
    },
  },
  mounted() {
    if (!this.noShadow) {
      this.scroll();
      window.addEventListener('scroll', this.scroll);
    }
  },
  beforeDestroy() {
    if (!this.noShadow) {
      window.removeEventListener('scroll', this.scroll);
    }
  },
};
</script>

<style lang="scss">
.globalBtnWrap{
  height: 86px;
  > div{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 86px;
    z-index: 5;
    transition: box-shadow .3s ease;
    background-color: #FFF;
    &.transparent{
      background-color: transparent;
    }
    &.shadow{
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    }
    &.selected > div > button{
      width: 50%;
    }
    > div{
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      padding: 20px 24px;
      background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff);
      transition: box-shadow .3s ease;
      > div{
        width: 50%;
        flex-shrink: 0;
        color: #000;
        .text{
          font-size: 13px;
          color: #939499;
        }
        .price{
          margin-top: 2px;
          font-size: 18px;
          line-height: 23px;
        }
      }
      > button{
        width: 100%;
        height: 46px;
        background-color: #ff3478;
        box-shadow: 0 2px 8px 0 rgba(255, 52, 120, 0.5);
        font-size: 17px;
        font-weight: bold;
        color: #FFF;
        border-radius: 4px;
        transition: background-color .2s ease;
        &.disabled{
          background-color: #cccdd1 !important;
          box-shadow: none !important;
          color: #FFF !important;
        }
      }
    }
  }
}
.korail .globalBtnWrap > div > div > button{
  background-color: #cde0ee;
  color: #073b62;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}
</style>

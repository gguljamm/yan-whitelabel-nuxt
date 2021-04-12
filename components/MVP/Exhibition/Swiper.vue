<template>
  <div class="exhibitionSwiperWrapper">
    <div
      v-swiper="swiperOption"
      class="swiper swiperOptionWrapper"
      :class="type"
    >
      <ul class="swiper-wrapper">
        <li
          v-for="(obj, objIndex) in arrGroup"
          :key="objIndex"
          class="swiper-slide"
          :class="{
            mobile: $device.isMobile,
          }"
        >
          <div
            :style="{ backgroundImage: `url(${obj.thumbnailImage})` }"
            @click="submit(obj)"
            class="list"
          >
            <div class="info">
              <div
                v-for="(key, objIndex) in arrKeys"
                :key="objIndex"
                :class="key"
                v-show="obj[key]"
                v-html="obj[key]"
              ></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="$device.isDesktop" :class="`swiperBtnLeft ${swiperOption.navigation.prevEl.replace('.', '')}`" slot="button-prev"></div>
    <div v-if="$device.isDesktop" :class="`swiperBtnRight ${swiperOption.navigation.nextEl.replace('.', '')}`" slot="button-next"></div>
  </div>
</template>

<script>
export default {
  props: {
    swiperOption: {
      type: Object,
      default: () => {},
    },
    arrGroup: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: () => '',
    },
  },
  computed: {
    arrKeys() {
      let arrKey = [];
      // thumbnailCategory
      switch (this.type) {
        case 'hotPick':
          arrKey = ['thumbnailExplanation', 'thumbnailTitle'];
          break;
        case 'banner':
          arrKey = ['thumbnailCategory', 'thumbnailTitle', 'thumbnailExplanation'];
          break;
        default:
          arrKey = ['thumbnailCategory', 'thumbnailTitle', 'thumbnailExplanation'];
          break;
      }
      return arrKey;
    },
  },
  methods: {
    submit(obj) {
      const path = this.type === 'banner' ? (`${obj.productType === 'PLACE' ? '/place' : '/leisure'}/result/${obj.productId}`) : (`/exhibition/${obj.productType === 'PLACE' ? '?productType=place' : '?productType=leisure'}&exhibitionId=${obj.id}`);
      this.$emit('submit', path);
    },
    replaceNewLineChar(strInfo) {
      return strInfo ? strInfo.replace(/(\r\n|\r|\n)/g, '<br>') : '';
    },
  },
};
</script>

<style lang="scss">
  .exhibitionSwiperWrapper{
    .swiperOptionWrapper{
      .swiper-slide{
        height: 175px;
        .list{
          position: relative;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          &:before {
            content: '';
            background-color: #000;
            opacity: .3;
            position: absolute;
            z-index: 0;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
        }

      }

      &.hotPick {
        .swiper-slide{
        }
      }

      &.banner {
        .swiper-slide{
          &.mobile{
            width: calc(100% - 48px);
          }
        }
      }
    }
  }

  .exhibitionSwiperWrapper {
    position: relative;
    .swiperBtnLeft, .swiperBtnRight {
      width: 40px;
      height: 40px;
      background-color: #FFF;
      border-radius: 20px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
      border: solid 1px #ebecf1;
      z-index: 10;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 20px;
      transition: opacity .3s ease;

      &.swiper-button-disabled {
        opacity: 0;
        pointer-events: none;
        cursor: auto;
      }
    }

    .swiperBtnRight {
      right: -20px;
      background-image: url(~assets/img/icon-chevron-right.svg);
    }

    .swiperBtnLeft {
      left: -20px;
      background-image: url(~assets/img/icon-chevron-left.svg);
    }
  }

</style>

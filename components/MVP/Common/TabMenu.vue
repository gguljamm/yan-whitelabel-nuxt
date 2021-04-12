<template>
  <div
    class="tabMenuWrapper"
    :class="isFixed ? 'fixed' : ''"
  >
    <div class="menu">
      <div class="fixWidth">
        <div v-swiper="options">
          <div class="swiper-wrapper">
            <div class="swiper-slide"
              v-for="(menu, index) in arrMenu"
              :key="index"
            >
              <button
                @click="$emit('setSelectedTab', index)"
                :class="selectedTabIndex === index ? 'active' : ''"
              >
                <div class="name">{{ menu }}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arrMenu: {
      type: Array,
      default: () => [],
    },
    selectedTabIndex: {
      type: Number,
      default: 0,
    },
    isFixed: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      options: {
        freeMode: true,
        slidesPerView: 'auto',
        spaceBetween: 18,
      },
    };
  },
};
</script>

<style lang="scss">
.noHeader .tabMenuWrapper.fixed .menu{
  top: 0;
}
  .tabMenuWrapper{
    white-space: nowrap;
    overflow-x: auto;
    font-size: 0;
    z-index: 2;
    background-color: #fff;
    .menu{
      background-color: #fff;
      border-bottom: 1px solid #f5f5f5;
      height: $detailTabMenu * 1px;
    }
    &.fixed {
      height: 0;
      .menu{
        z-index: 2;
        left: 0;
        right: 0;
        position: fixed;
        top: $header * 1px;
        background-color: #fff;
      }
    }
    .swiper-container{
      &:before{
        content: '';
        width: 24px;
        height: 43px;
        background-image: linear-gradient(to left, rgba(255, 255, 255, 0), #FFF);
        position: absolute;
        left: 0;
        top: 0;
        z-index: 5;
        pointer-events: none;
      }
      &:after{
        content: '';
        width: 24px;
        height: 43px;
        background-image: linear-gradient(to right, rgba(255, 255, 255, 0), #FFF);
        position: absolute;
        right: 0;
        top: 0;
        z-index: 5;
        pointer-events: none;
      }
    }
    .swiper-wrapper{
      .swiper-slide{
        width: auto;
        min-width: 57px;
        &:first-of-type{
          padding-left: $sidePadding * 1px;
        }
        &:last-of-type{
          padding-right: $sidePadding * 1px;
        }
      }
    }
    button{
      width: 100%;
      font-size: 13px;
      color: #939499;
      line-height: 18px;
      .name {
        position: relative;
        height: 44px;
        line-height: 44px;
        padding: 0 6px;
      }
      &.active{
        color: #000;
        font-weight: bold;
        position: relative;
        .name {
          &::after{
            content: '';
            display: block;
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            height: 2px;
            background-color: #3d3d3d;
          }
        }
      }
    }
  }
</style>

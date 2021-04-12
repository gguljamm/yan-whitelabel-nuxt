<template>
  <div class="popupSortWrapper" @click="close">
    <transition name="rise">
      <div class="popupSort fixWidth" v-show="init" @click.stop>
        <div class="sortHeader">
          <button @click="close"></button>
          정렬
        </div>
        <ul class="sortList">
          <li
            v-for="x in sortCondition"
            :key="x.key"
            :class="{ selected: sort === x.key }"
            @click="sort !== x.key ? submit(x.key) : close()"
          >{{ x.name }}</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    sort: {
      type: String,
      default: 'RECOMMENDATION',
    },
  },
  data() {
    return {
      init: false,
      sortCondition: [
        { key: 'RECOMMENDATION', name: '추천 순' },
        { key: 'REVIEW', name: '후기 많은 순' },
        // { key: 'RECOMMENDATION', name: '평점 높은 순' },
        { key: 'PRICEASC', name: '숙박 예약가 낮은 순' },
        { key: 'PRICEDESC', name: '숙박 예약가 높은 순' },
        { key: 'DISCOUNTRATE', name: '할인율 높은 순' },
      ],
    };
  },
  methods: {
    close() {
      this.$store.commit('history/popHistory');
      this.$router.back();
    },
    submit(key) {
      this.$emit('changeSort', key);
    },
  },
  mounted() {
    window.document.body.style.overflow = 'hidden';
    this.init = true;
  },
  beforeDestroy() {
    window.document.body.style.removeProperty('overflow');
  },
};
</script>

<style lang="scss">
.popupSortWrapper{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .3);
  z-index: 100;
  .popupSort{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #FFF;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.15);
    .sortHeader{
      padding: 20px $sidePadding * 1px 10px;
      height: 54px;
      line-height: 24px;
      font-size: 13px;
      font-weight: bold;
      text-align: center;
      position: relative;
      > button{
        width: 24px;
        background: url(~assets/img/icon-close.svg) center center no-repeat;
        background-size: 24px;
        position: absolute;
        top: 20px;
        bottom: 10px;
        left: $sidePadding * 1px;
      }
    }
    .sortList{
      padding: 0 $sidePadding * 1px 20px;
      > li{
        height: 50px;
        border-bottom: 1px solid #ebecf1;
        line-height: 49px;
        font-size: 16px;
        position: relative;
        cursor: pointer;
        &:last-of-type{
          border: none;
        }
        &.selected{
          font-weight: bold;
          &:after{
            position: absolute;
            content: '';
            background: url(~assets/img/icon-check.svg) center center no-repeat;
            background-size: 24px 24px;
            top: 13px;
            right: 0;
            width: 24px;
            height: 24px;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="regionSelect">
    <div class="topInfo">
      <div class="regionName">
        <div class="fixWidth">
          <p>{{ categoryMap[$route.query.category] }}<br>지역을 선택하세요</p>
          <TabMenu
            :arrMenu="arrRecommend.map((item) => item.region)"
            :selectedTabIndex="selectedRecommend"
            @setSelectedTab="changeSelected"
          ></TabMenu>
        </div>
      </div>
    </div>
    <div class="fixWidth bottomInfo">
      <div class="regionList">
        <ul v-if="arrRecommend[selectedRecommend]">
          <li
            v-for="(x, index) in arrRecommend[selectedRecommend].subList"
            :key="index"
            @click="$emit('submit', x)"
          >{{ x.text }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import TabMenu from '@/components/MVP/Common/TabMenu.vue';

export default {
  components: {
    TabMenu,
  },
  props: {
    arrRecommend: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedRecommend: 0,
      swiperOptions: {
        slidesPerView: 'auto',
        freeMode: true,
        spaceBetween: 20,
      },
      categoryMap: {
        hotel: '호텔',
        motel: '중저가 숙소',
        guesthouse: '게스트하우스',
        pension: '펜션/풀빌라',
        resort: '리조트/콘도',
        camping: '글램핑/카라반',
        premiumhotel: '프리미엄호텔',
      },
    };
  },
  methods: {
    changeSelected(index) {
      this.selectedRecommend = index;
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.noHeader .regionSelect .topInfo{
  height: 110px;
  .regionName{
    top: 0;
  }
}
  .regionSelect{
    .topInfo{
      width: 100%;
      height: 110px;
      background-color: #FFF;
      .regionName{
        position: fixed;
        top: $header * 1px;
        left: 0;
        width: 100%;
        z-index: 5;
        background-color: #FFF;
        .fixWidth{
          p{
            padding: 10px ($sidePadding * 1px);
            font-size: 16px;
            font-weight: bold;
            line-height: 22px;
            margin-bottom: 2px;
          }
        }
      }
    }
    .bottomInfo{
      background-color: #FFF;
      min-height: calc(100vh - 110px - #{$header * 1px} - 80px);
      .regionList{
        padding: 0 ($sidePadding * 1px);
        > ul{
          > li{
            font-size: 16px;
            line-height: 22px;
            border-bottom: 1px solid #ebecf1;
            cursor: pointer;
            position: relative;
            padding: 20px 0 20px 26px;
            &:before{
              content: '';
              position: absolute;
              left: 0;
              top: 22px;
              background: url(~assets/img/icon-area-black.svg) center center no-repeat;
              background-size: 18px;
              height: 18px;
              width: 18px;
            }
          }
        }
      }
    }
  }
</style>

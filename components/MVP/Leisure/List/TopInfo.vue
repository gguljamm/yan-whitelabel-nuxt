<template>
  <div class="searchWrap">
    <div class="search fixWidth">
      <div class="btnWrap">
        <button
          @click="isKeywordSearch ? submitSearch() : ''"
          class="inputButton"
          :class="{
            categorySearch: !isKeywordSearch,
          }"
        >{{ params.keyword }}</button>
        <button @click="submitSearch" class="searchBtn"></button>
      </div>
    </div>
    <div v-if="!isKeywordSearch" class="mvpTab fixWidth" v-show="objLeisure.status === 'loaded'">
      <div v-if="!(objLeisure.page === 0 && objLeisure.status === 'loading')" class="btnWrap">
        <div class="regionBtn" @click="$emit('openPop', 'region')">
          <div class="icon icon-location-pin"></div>
          <span class="name">{{ areaName ? areaName : '전체 지역' }}</span>
        </div>
        <div class="categoryBtn" @click="$emit('openPop', 'category')">
          <div class="icon"
            :class="categoryParentId"
          ></div>
          <span class="name">{{ categoryTitle ? categoryTitle : '전체 카테고리' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isKeywordSearch: {
      type: Boolean,
    },
    params: {
      type: Object,
      default: () => {},
    },
    arrRegion: {
      type: Array,
      default: () => [],
    },
    arrCategory: {
      type: Array,
      default: () => [],
    },
    objLeisure: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    areaName() {
      let areaName = '';
      const arrAllArea = this.arrRegion.concat(this.arrRegion.reduce((acc, it) => acc.concat(it.children), []));
      if (this.params.area && arrAllArea && arrAllArea.length > 0) {
        const foundName = arrAllArea.find((obj) => obj.id === parseInt(this.params.area, 10));
        areaName = foundName ? foundName.name : '전체 지역';
      }
      return areaName;
    },
    categoryTitle() {
      let category = '';
      const arrAllCategory = this.arrCategory.concat(this.arrCategory.reduce((acc, it) => acc.concat(it.children), []));
      if (this.params.category && arrAllCategory && arrAllCategory.length > 0) {
        const foundCategory = arrAllCategory.find((obj) => obj.id === parseInt(this.params.category, 10));
        category = foundCategory ? foundCategory.name : '전체 카테고리';
      }
      return category;
    },
    categoryParentId() {
      const id = parseInt(this.params.category, 10);
      if (id) {
        if (this.arrCategory.map((v) => v.id).indexOf(id) >= 0) {
          return `leisure-icon-${id}`;
        }
        const parent = this.arrCategory.find((v) => v.children.map((v2) => v2.id).indexOf(id) >= 0);
        if (parent) {
          return `leisure-icon-${parent.id}`;
        }
      }
      return 'icon-ticket';
    },
  },
  methods: {
    submitSearch() {
      this.$emit('submitGlobalSearch');
    },
  },
};
</script>

<style lang="scss" scoped>
.noHeader .searchWrap{
  top: 0;
  height: $header * 1px;
  background-color: #FFF;
  .search .btnWrap{
    margin-top: (($header - 34) / 2) * 1px;
    transform: none;
    right: $sidePadding * 1px;
    left: $sidePadding * 1px;
    padding-right: 30px;
    .pageTitle{
      display: none;
    }
    .searchBtn{
      position: absolute;
      right: 0;
      left: unset;
    }
  }
  .mvpTab{
    padding-right: ($sidePadding) * 1px;
  }
}
.searchWrap {
  position: fixed;
  width: 100%;
  top: $header * 1px;
  left: 0;
  z-index: 11;
  background-color: #FFF;
  border-bottom: 1px solid #ebecf1;
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.05);

  .search {
    position: relative;

    .btnWrap {
      position: absolute;
      left: 46px;
      right: 53px;
      margin-top: $header * -1px;
      transform: translateY(($header - 34) / 2 * 1px);
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;

      .inputButton {
        width: calc(100% - 30px);
        height: 34px;
        border-radius: 4px;
        border: 1px solid #ebecf1;
        background-color: #f8f9fb;
        text-align: left;
        padding-left: 14px;
        font-size: 13px;
        &.categorySearch{
          opacity: 0;
          pointer-events: none;
        }
      }

      .pageTitle {
        width: 100%;
        height: 34px;
        line-height: 34px;
        text-align: left;
        padding-left: 14px;
        font-size: 13px;
      }

      .searchBtn {
        margin-left: 8px;
        width: 22px;
        height: 22px;
        background: url(~assets/img/icon-search-black.svg) center center no-repeat;
        background-size: 22px;
      }
    }
  }

  .mvpTab {
    padding: 10px $sidePadding * 1px;

    .btnWrap {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;

      > div {
        width: 50%;
        padding: 10px 12px;
        height: 38px;
        border-radius: 4px;
        border: 1px solid #ebecf1;
        cursor: pointer;
        font-size: 13px;
        color: #000;
      }
      .regionBtn, .categoryBtn{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        .icon{
          width: 18px;
          height: 18px;
          background-size: 18px;
          margin-right: 4px;
          background-position: center center;
          &.icon-ticket{
            background-size: 20px;
          }
        }
        .name{
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }

      .categoryBtn {
        word-break: keep-all;
        margin-left: 7px;
      }
    }
  }
}
</style>

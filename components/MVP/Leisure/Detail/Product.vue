<template>
  <div class="leisureDetailProductWrapper">
    <div class="titleWrap">
      <div
        class="mainImg"
        :style="{
            backgroundImage: objLeisure.leisure.images && objLeisure.leisure.images.length > 0 ? `url(${objLeisure.leisure.images[0].bpUrl})` : '',
          }"
      ></div>
      <div class="info">
        <div class="category">{{ leisureTypeName }}</div>
        <div class="name">{{ objLeisure.leisure.name }}</div>
      </div>
    </div>
    <OptionGroup
      :arrOptionGroups="arrOptionGroups"
      :objSelectedOptions="objSelectedOptions"
      :arrOption="arrOption"
      @changeOption="changeOption"
    ></OptionGroup>
  </div>
</template>

<script>
import OptionGroup from './OptionGroup.vue';

export default {
  components: {
    OptionGroup,
  },
  props: {
    objLeisure: {
      type: Object,
      default: () => {},
    },
    arrOptionGroups: {
      type: Array,
      default: () => [],
    },
    arrOption: {
      type: Array,
      default: () => [],
    },
    objSelectedOptions: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    changeOption(objOption) {
      this.$emit('changeOption', objOption);
    },
  },
  computed: {
    leisureTypeName() {
      return this.objLeisure.leisure && this.objLeisure.leisure.type && this.objLeisure.leisure.type.length > 0 ? this.objLeisure.leisure.type[0].name : [];
    },
  },
};
</script>

<style lang="scss">
  .leisureDetailProductWrapper{
    $padding: $sidePadding * 1px;
    $paddingTop: ($header + $detailTabMenu) * 1px;
    padding: 0 $padding 80px $padding;
    min-height: calc(100vh - #{$paddingTop});
    .titleWrap {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #ebecf1;
      margin-bottom: 10px;
      .mainImg {
        flex-shrink: 0;
        width: 46px;
        height: 46px;
        border-radius: 23px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        background-color: #ebecf1;
      }

      .info {
        margin-left: 14px;

        .category {
          color: #939499;
          font-size: 13px;
          font-weight: bold;
          line-height: 18px;
          margin-bottom: 2px;
        }

        .name {
          width: 100%;
          font-weight: bold;
          font-size: 16px;
          line-height: 22px;
        }
      }
    }
  }
</style>

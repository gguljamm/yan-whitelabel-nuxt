<template>
  <div class="optionGroupsWrapper">
    <div
      v-for="(objOptionGroup, index) in arrOptionGroups"
      :key="index"
      class="optionGroup"
    >
      <div class="optionTitle">{{ objOptionGroup.name }}</div>
      <div class="optionListWrapper">
        <Option
          v-for="(objOption, index) in arrOption.filter((obj) => objOptionGroup.dealOptionIds.indexOf(obj.id) !== -1)"
          :key="index"
          :objOption="objOption"
          :status="objOption.status"
          :selectedValue="objSelectedOptions[objOption.id]"
          @changeOption="changeOption"
        ></Option>
      </div>
    </div>
  </div>
</template>

<script>
import Option from '@/components/MVP/Leisure/Detail/Option.vue';

export default {
  components: {
    Option,
  },
  props: {
    arrOption: {
      type: Array,
      default: () => [],
    },
    arrOptionGroups: {
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
};
</script>

<style lang="scss">
.optionGroupsWrapper{
  .optionGroup{
    margin-top: 10px;
    &:first-of-type{
      margin-top: 0;
    }
    .optionTitle {
      font-weight: bold;
      font-size: 13px;
      line-height: 20px;
      padding: 10px 0;
    }
    .optionListWrapper{
      margin-top: 10px;
    }
  }
}
</style>

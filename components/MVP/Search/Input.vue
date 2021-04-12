<template>
  <div class="scSearchInputWrap fixWidth">
    <div class="fixWrap">
      <div class="inputWrap fixWidth">
        <input
          type="text"
          class="searchInput"
          :placeholder="placeholder ? placeholder : ''"
          v-on:input="changeKeyword"
          @keyup.enter="enter"
          ref="inputRef"
          :value="inputStr"
          autocomplete="off"
        >
        <transition name="fade" mode="out-in">
          <div v-if="inputStr" class="xBtn" @click="clear"></div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      inputStr: '',
    };
  },
  methods: {
    enter(e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      this.$emit('enter');
    },
    clear() {
      this.inputStr = '';
      this.$emit('receiveData', '');
    },
    changeKeyword(e) {
      this.inputStr = e.target.value;
      this.$emit('receiveData', e.target.value);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.inputRef.focus();
    });
  },
};
</script>

<style lang="scss">
.noHeader .scSearchInputWrap .fixWrap{
  top: 0;
}
.scSearchInputWrap{
  width: 100%;
  height: 58px;
  position: relative;
  .fixWrap{
    width: 100%;
    height: 58px;
    position: fixed;
    top: $header * 1px;
    left: 0;
    background-color: #fff;
    border-bottom: 1px solid #ebecf1;
  }
  .inputWrap{
    width: 100%;
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 0 ($sidePadding * 1px);
    line-height: 1.38;
    .searchInput{
      width: calc(100% - 42px);
      height: 100%;
      border-radius: 4px;
      border: none;
      background-color: #ffffff;
      text-align: left;
      font-size: 16px;
      font-weight: bold;
      z-index: 10;
      color: #000;
      padding: 10px 0;
      &::placeholder{
        color: #939499;
        /*padding-left: 24px;*/
      }
    }
    .xBtn{
      width: 42px;
      height: 42px;
      background: url(~assets/img/delete.svg) center right no-repeat;
      background-size: 14px;
      cursor: pointer;
    }
  }
}
</style>

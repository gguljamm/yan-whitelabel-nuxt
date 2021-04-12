<template>
  <div class="reSearch">
    <div class="fixWidth">
      <div>
        <button @click="close()"></button>
        검색 변경
<!--        <button @click="home()"></button>-->
      </div>
      <div>
        <div
          :class="{
            category: $route.query.type === 'category'
          }"
        >
          <button @click="clickBtn('keyword')"
          >{{ params.keyword }}</button>
        </div>
        <div>
          <button
            @click="clickBtn('date')"
          >{{ $format.formatDate(params.checkin, 'md') }} - {{ $format.formatDate(params.checkout, 'md') }}</button>
          <button
            @click="clickBtn('guest')"
          >성인 {{ params.adults }}명{{ params.children > 0 ? `, 아동 ${ params.children }명` : '' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit('close');
    },
    home() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(`/${this.$store.state.history.enterFlag}`);
    },
    clickBtn(flag) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: flag === 'keyword' ? '/place' : `/place/${flag}`,
        query: flag === 'keyword' ? {
          category: this.$route.query.category,
          checkin: this.params.checkin,
          checkout: this.params.checkout,
          adults: this.params.adults === 2 ? undefined : this.params.adults,
          children: this.params.children === 0 ? undefined : this.params.children,
          type: this.$route.query.type || 'search',
        } : this.$route.query,
      });
    },
  },
};
</script>

<style lang="scss">
.noHeader .reSearch{
  margin-top: 0;
}
  .reSearch{
    z-index: 2;
    left: 0;
    right: 0;
    top: 0;
    position: absolute;
    margin-top: $header * -1px;
    background-color: #FFF;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    > div {
      > div:nth-of-type(1) {
        height: $header * 1px;
        text-align: center;
        line-height: $header * 1px;
        position: relative;
        font-size: 13px;
        > button:nth-of-type(1) {
          position: absolute;
          top: 0;
          left: 0;
          width: 44px;
          height: $header * 1px;
          background: url(~assets/img/icon-close.svg) no-repeat center center;
          background-size: 24px;
        }
        > button:nth-of-type(2) {
          position: absolute;
          top: 0;
          right: 0;
          width: 44px;
          height: $header * 1px;
          background: url(~assets/img/icon-home-black.svg) no-repeat center center;
          background-size: 24px;
        }
      }
      > div:nth-of-type(2) {
        padding: 0 20px 24px;
        > div{
          &:nth-of-type(1) {
            border: 1px solid #ebecf1;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            position: relative;
            &:before{
              content: '';
              background: url(~assets/img/icon-search-black.svg) no-repeat center center;
              background-size: 18px;
              top: 12px;
              left: 12px;
              width: 18px;
              height: 18px;
              position: absolute;
            }
            &.category:before{
              background: url(~assets/img/icon-list-black.svg) no-repeat center center;
              background-size: 18px;
            }
            button{
              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
              border: 0;
              width: 100%;
              height: 42px;
              padding-left: 36px;
              font-size: 13px;
              text-align: left;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              padding-right: 12px;
            }
          }
          &:nth-of-type(2) {
            height: 41px;
            border: 1px solid #ebecf1;
            border-top: 0;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            > button{
              position: relative;
              float: left;
              width: 50%;
              height: 42px;
              text-align: left;
              padding-left: 36px;
              font-size: 13px;
              &:nth-of-type(1) {
                border-right: 1px solid #ebecf1;
                border-bottom-left-radius: 4px;
                &:before{
                  background: url(~assets/img/icon-calendar.svg) no-repeat center center;
                  background-size: 18px;
                }
              }
              &:nth-of-type(2) {
                border-bottom-right-radius: 4px;
                &:before{
                  background: url(~assets/img/icon-user-black.svg) no-repeat center center;
                  background-size: 18px;
                }
              }
              &:before{
                content: '';
                top: 12px;
                left: 12px;
                width: 18px;
                height: 18px;
                position: absolute;
              }
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="guestWrapper">
    <div class="fixWidth">
      <div>
        <div>
          <div>{{ keyword }}</div>
          <div>
            <span>{{ $format.formatDate(checkin, 'md') }}</span>
            <span v-show="checkout"> - {{ $format.formatDate(checkout, 'md') }}</span>
          </div>
        </div>
        <div>
          <div>
            <div>
              <div>성인</div>
              <div>만 18세 이상</div>
            </div>
            <div>
              <button @click="changeNum('adults', false)" :class="adults === 1 ? 'disable' : ''"></button>
              <div>{{ adults }}</div>
              <button @click="changeNum('adults', true)" :class="adults === 30 ? 'disable' : ''"></button>
            </div>
          </div>
          <div>
            <div>
              <div>아동</div>
              <div>만 17세 이하</div>
            </div>
            <div>
              <button @click="changeNum('children', false)" :class="children === 0 ? 'disable' : ''"></button>
              <div>{{ children }}</div>
              <button @click="changeNum('children', true)" :class="children === 10 ? 'disable' : ''"></button>
            </div>
          </div>
        </div>
        <global-button
          @submit="submit"
          :text="'검색'"
        ></global-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const adults = this.$route.query.adults ? parseInt(this.$route.query.adults, 10) : 2;
    const children = this.$route.query.children ? parseInt(this.$route.query.children, 10) : 0;
    return {
      keyword: this.$route.query.keyword || '',
      checkin: this.$route.query.checkin || '',
      checkout: this.$route.query.checkout || '',
      adults,
      children,
    };
  },
  methods: {
    changeNum(flag, num) {
      if (flag === 'adults') {
        if (num && this[flag] < 30) {
          this.adults += 1;
        } else if (!num && this[flag] > 1) {
          this.adults -= 1;
        }
      } else if (flag === 'children') {
        if (num && this[flag] < 10) {
          this.children += 1;
        } else if (!num && this[flag] > 0) {
          this.children -= 1;
        }
      }
    },
    submit() {
      this.$emit('submit', this.adults, this.children);
    },
  },
};
</script>

<style lang="scss">
  .guestWrapper {
    font-size: 16px;
    > div {
      background-color: #FFF;
      > div:first-of-type {
        min-height: calc(100vh - #{$header * 1px});
        padding: 20px $sidePadding * 1px;
        > div:first-of-type{
          line-height: 26px;
          font-weight: bold;
        }
        > div:nth-of-type(2) {
          margin-top: 26px;
          > div{
            padding: 16px 0;
            &:after{
              content: '';
              display: block;
              clear: both;
            }
            > div{
              float: left;
            }
            > div:nth-of-type(1) {
              > div:nth-of-type(1) {
                line-height: 22px;
              }
              > div:nth-of-type(2) {
                line-height: 20px;
                font-size: 13px;
                color: #868686;
              }
            }
            > div:nth-of-type(2) {
              float: right;
              padding: 4px 0;
              > button{
                float: left;
                width: 28px;
                height: 28px;
                background-color: #fff;
                border-radius: 14px;
                position: relative;
                transition: opacity .3s ease;
                border: 1px solid #000;
                &.disable{
                  opacity: .1;
                }
                &:before{
                  width: 12px;
                  height: 2px;
                  background-color: #000000;
                  content: '';
                  display: block;
                  margin: 0 auto;
                }
                &:nth-of-type(2){
                  &:after{
                    content: '';
                    position: absolute;
                    width: 12px;
                    height: 2px;
                    background-color: #000000;
                    display: block;
                    transform: rotate(90deg);
                    top: 50%;
                    left: 50%;
                    margin-left: -6px;
                    margin-top: -1px;
                  }
                }
              }
              > div{
                text-align: center;
                float: left;
                width: 48px;
                line-height: 28px;
                font-size: 16px;
                font-weight: bold;
              }
              &:after{
                content: '';
                display: block;
                clear: both;
              }
            }
          }
        }
      }
    }
  }
</style>

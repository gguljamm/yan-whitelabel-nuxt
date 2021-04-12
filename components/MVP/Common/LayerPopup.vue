<template>
  <transition name="fade">
    <div v-if="$store.state.layerPopup" class="layerPopupWrapper" @click="$store.commit('setLayerPopup', null)">
      <div v-if="$store.state.layerPopup === 'etbs'" @click.stop>
        <div class="img">
          <h3>야놀자 국내 숙박 리뉴얼 오픈</h3><br>
          <div>항상 야놀자를 이용해주시는 고객님들께 깊은 감사의 말씀을 드립니다.</div>
          <div>야놀자의 국내 숙박 서비스가 1월 20일부터 새롭게 변경되었습니다.</div>
          <div>리뉴얼 오픈으로 주문 확인 페이지가 변경되었으니,<br>아래 내용을 참고하시어 서비스 이용에 착오없으시기 바랍니다.</div><br>
          <div>■ 주문 일자 기준 예약 확인 사이트 안내</div>
          <div class="btn"><div>2021.01.19 까지 주문 확인</div><button @click="changePage()">바로가기</button></div>
          <div class="btn"><div>2021.01.20 이후 주문 확인</div><button @click="changeRoute()">바로가기</button></div>
        </div>
        <div class="last">
          <button @click="$store.commit('setLayerPopup', null)">확인</button>
        </div>
      </div>
      <div v-else-if="$store.state.layerPopup === 'check'" @click.stop>
        <div class="img">
          <h3 class="pink">야놀자 서비스 점검 안내</h3><br>
          <div>다음과 같이 야놀자 서비스 점검이 예정되어 있습니다.</div>
          <div>다음 기간 동안 조회 및 예약 등 서비스 이용이 중단되니<br>양해 부탁드립니다.</div><br>
          <div>감사합니다.</div><br>
          <div>일시 : 2021. 02. 16(화) 오전 03:00 ~ 오전 07:00</div><br>
          <div class="sub">* 점검 시간은 상황에 따라 사전 공지 없이 다소 연장될 수 있습니다.</div>
        </div>
        <div class="bottom">
          <label><input type="checkbox" v-model="checked">오늘 하루 열지 않음</label>
          <button @click="close">닫기</button>
        </div>
      </div>
      <div v-else>
        <img class="img" :src="$store.state.layerPopup">
        <div class="bottom">
          <label><input type="checkbox" v-model="checked">오늘 하루 열지 않음</label>
          <button @click="close">닫기</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
    };
  },
  methods: {
    close() {
      this.$store.commit('setLayerPopup', null);
      if (this.checked) {
        this.$cookies.set('yan-whitelabel-no-popup', true, '1d', '/');
      }
    },
    changePage() {
      window.location.href = 'https://combine.yapen.co.kr/reserve';
    },
    changeRoute() {
      this.$store.commit('setLayerPopup', null);
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push('/reserve');
    },
  },
  mounted() {
    // if (!this.$cookies.get('yan-whitelabel-no-popup')) {
    //   this.$store.commit('setLayerPopup', 'check');
    // }
  },
};
</script>

<style lang="scss">
.layerPopupWrapper{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0,0,0,.3);
  z-index: 999;
  > div{
    width: 80%;
    max-width: 614px;
    min-width: 300px;
    max-height: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #FFF;
    border-radius: 4px;
    box-shadow: 0 0 4px 2px rgba(0,0,0,.1);
    overflow: auto;
    h3.pink{
      color: #ff3478;
    }
    > img{
      width: 100%;
    }
    > div.img{
      width: 100%;
      display: block;
      text-align: center;
      padding: 40px 20px 20px;
      > div{
        line-height: 22px;
        font-size: 16px;
        padding-bottom: 10px;
        &.sub{
          font-size: 14px;
          color: #939499;
        }
        &.btn {
          display: flex;
          justify-content: center;
          > button{
            margin-left: 10px;
            background-color: #000;
            color: #FFF;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 11px;
            line-height: 14px;
          }
        }
      }
    }
    .last{
      background-color: #FFF;
      position: sticky;
      bottom: 0;
      left: 0;
      right: 0;
      border-top: 1px solid #ebecf1;
      padding: 10px 0;
      z-index: 1;
      > button{
        background-color: #ff3478;
        color: #FFF;
        border-radius: 4px;
        font-size: 16px;
        width: 100%;
        max-width: 120px;
        margin: 0 auto;
        display: block;
        height: 32px;
        font-weight: bold;
      }
    }
    > .bottom{
      background-color: #f8f9fb;
      height: 30px;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      font-size: 13px;
      > label{
        line-height: 30px;
        display: flex;
        align-items: center;
        input{
          margin-right: 4px;
        }
      }
      > button{
        padding-left: 10px;
      }
    }
  }
}
</style>

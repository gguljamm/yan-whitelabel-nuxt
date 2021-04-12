<template>
  <div class="sellerWrapper popupBack fixWidth">
    <spinner-loading v-if="objSellerInfo.status === 'loading' && !objSellerInfo.sellerInfo"></spinner-loading>
    <div v-else-if="objSellerInfo.status === 'loaded' && objSellerInfo.sellerInfo">
      <div class="pageTitle">판매자 정보</div>
      <div class="infoWrap">
        <div
          v-for="(objInfo, index) in objSellerInfo.sellerInfo"
          :key="index"
          class="info"
        >
          <div class="title">{{ objInfo.title }}</div>
          <div class="listWrapper">
            <div class="list">
              <div class="name">대표자명</div>
              <div class="value">{{ objInfo.partnerName }}</div>
            </div>
            <div class="list">
              <div class="name">상호명</div>
              <div class="value">{{ objInfo.companyName }}</div>
            </div>
            <div class="list">
              <div class="name">사업자주소</div>
              <div class="value">{{ objInfo.address }}</div>
            </div>
            <div class="list">
              <div class="name">전자우편주소</div>
              <div class="value">{{ objInfo.email }}</div>
            </div>
            <div class="list">
              <div class="name">연락처</div>
              <div class="value"><a :href="`tel:${objInfo.phoneNumber}`">{{ $format.formatPhone(objInfo.phoneNumber) }}</a></div>
            </div>
            <div class="list">
              <div class="name">사업자등록번호</div>
              <div class="value">{{ objInfo.businessNumber }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="noResult">
      <div>{{ objSellerInfo.errorMessage }}</div>
      <div>잠시 후에 다시 시도 해주세요.</div>
    </div>
  </div>
</template>

<script>
import SpinnerLoading from '~/components/MVP/Common/SpinnerLoading.vue';

export default {
  components: {
    SpinnerLoading,
  },
  props: {
    objPlace: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      objSellerInfo: {
        status: 'init',
        sellerInfo: null,
        errorMessage: '',
      },
    };
  },
  computed: {
    place() {
      return this.objPlace.place;
    },
  },
  mounted() {
    this.objSellerInfo.status = 'loading';
    this.$apis.getSellerInfo({ placeNo: this.objPlace.place.no }).then((resp) => {
      this.objSellerInfo.status = 'loaded';
      this.objSellerInfo.sellerInfo = resp.data.result;
    }).catch((e) => {
      // console.log({ ...e });
      if (e.response.data.code === 13001) {
        this.objSellerInfo.errorMessage = e.response.data.message;
      } else {
        this.objSellerInfo.errorMessage = '결과를 불러오는데 실패하였습니다.';
      }
      this.objSellerInfo.status = 'loaded';
    });
  },
};
</script>

<style lang="scss">
  .sellerWrapper{
    padding: 0 $sidePadding * 1px;
    .pageTitle {
      line-height: 30px;
      font-size: 23px;
      font-weight: bold;
      padding: 20px 0;
    }
    .infoWrap{
      .info{
        font-size: 14px;
        color: #000;
        margin-top: 20px;
        border-bottom: 10px solid #f8f9fb;
        padding-bottom: 20px;
        &:first-of-type{
          margin-top: 0;
        }
        &:last-of-type{
          border: none;
        }
        .listWrapper{
          padding: 10px 0;
          .groupWrap{
            border-bottom: 1px solid #ebecf1;
            padding: 10px 0;
            &:first-of-type{
              padding: 0 0 10px;
            }
            &:last-of-type{
              border: none;
            }
          }
          .list{
            width: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            font-size: 16px;
            line-height: 22px;
            padding: 10px 0;
            .name{
              flex-shrink: 0;
              color: #939499;
              width: 35%;
            }
            .value{
              flex-shrink: 0;
              text-align: right;
              width: 65%;
              color: #000;
            }
          }
        }
      }
    }
    .noResult{
      height: 100vh;
      background-color: #fff;
      text-align: center;
      padding: 50px $sidePadding * 1px;
      > div:first-of-type{
        color: #000;
        font-size: 23px;
        line-height: 30px;
        font-weight: bold;
      }
      > div:nth-of-type(2){
        color: #939499;
        font-size: 13px;
        line-height: 20px;
        margin-top: 4px;
      }
    }
  }
</style>

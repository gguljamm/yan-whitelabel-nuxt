<template>
  <div class="sellerWrapper popupBack fixWidth">
    <div v-if="arrSellerInfo && arrSellerInfo.length > 0">
      <div class="pageTitle">판매자 정보</div>
      <div class="infoWrap">
        <div
          v-for="(objInfo, index) in arrSellerInfo"
          :key="index"
          class="info"
        >
          <div class="title">{{ objInfo.title }}</div>
          <div class="listWrapper">
            <div class="list">
              <div class="name">대표자명</div>
              <div class="value">{{ objInfo.owner }}</div>
            </div>
            <div class="list">
              <div class="name">상호명</div>
              <div class="value">{{ objInfo.companyName }}</div>
            </div>
            <div class="list">
              <div class="name">사업자주소</div>
              <div class="value">{{ objInfo.companyAddress }}</div>
            </div>
            <div class="list">
              <div class="name">전자우편주소</div>
              <div class="value">{{ objInfo.companyEmail }}</div>
            </div>
            <div class="list">
              <div class="name">연락처</div>
              <div class="value"><a :href="`tel:${objInfo.companyTel}`">{{ $format.formatPhone(objInfo.companyTel) }}</a></div>
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
      <div>판매자 정보가 없습니다.</div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    objLeisure: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    arrSellerInfo() {
      return this.objLeisure.sellerInfos;
      // return [{
      //   businessNumber: '1234567896',
      //   companyAddress: '서울시',
      //   companyEmail: 'seiqosnsn@natre.cocm',
      //   companyName: 'EKDKDK',
      //   companyTel: '0516784118',
      //   id: '0001061133',
      //   owner: 'WW',
      // }];
    },
  },
};
</script>

<style lang="scss" scoped>
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

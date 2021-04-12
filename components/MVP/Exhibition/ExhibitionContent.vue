<template>
  <div class="exhibitionWrapper" :class="{ noImage, noContent, mobile: $device.isMobile }">
    <Header
      :arrClass="noImage ? [] : (fade ? ['invisible', 'fade'] : ['invisible'])"
      :title="noImage ? objExhibition.result.title : ''"
    ></Header>
    <FullLoading v-if="objExhibition.status === 'loading'"></FullLoading>
    <template v-else-if="objExhibition.result && objExhibition.result.content">
      <div class="mainBack" v-if="!noImage">
        <div
          class="fixWidth"
          :style="{
            height: `${imgHeight}px`,
            backgroundImage: `url(${objExhibition.result.image})`,
          }"
        >
          <div>
            <div>
              <div v-html="objExhibition.result.title.replace(/\\n/g, '<br>')"></div>
              <div v-html="replaceNewLineChar(objExhibition.result.explanation)"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="mainWrap fixWidth" :style="{ paddingTop: noImage ? '' : `${imgHeight - 10}px` }">
        <div class="mainWrapBackHeight">
          <div
            ref="contentTarget"
            class="exhibitionContent"
            v-if="objExhibition.result.content"
            v-html="`${(objExhibition.result.content)}`"
          ></div>
          <template v-if="productType === 'place'">
            <div v-if="arr.length > 0" class="btnWrap">
              <button
                @click="clickBtn('date')"
              >{{ $format.formatDate(params.checkin, 'dot') }} - {{ $format.formatDate(params.checkout, 'dot') }}, {{ $format.getBetweenDay(params.checkin, params.checkout) }}박</button>
              <button
                @click="clickBtn('guest')"
              >성인 {{ params.adults }}명{{ params.children > 0 ? `, 아동 ${params.children}명` : '' }}</button>
            </div>
            <ul class="placeList" v-if="arr.length > 0">
              <li v-for="x in arr" :key="x.no" @click="submit(x.no)">
                <div class="bgImg">
                  <div :style="{backgroundImage: `url(${ x.imageUrl ? x.imageUrl : '' })` }"></div>
                </div>
                <div class="textBox">
                  <div class="intro">
                    <div>
                      <span v-show="x.star && x.star.rating !== 0">{{ x.star ? x.star.rating : '' }}성급 </span>
                      <span>{{ categoryNameMap[x.category.toLowerCase()] }}</span>
                    </div>
                  </div>
                  <div class="name">{{ x.name }}</div>
                  <div class="review">
                    <div class="locationText" v-if="x.location || x.directions">{{ x.location || x.directions }}</div>
                    <div class="reviewText" v-if="x.review">{{ x.review.rating.toFixed(1) }}<span>({{ x.review.count }})</span></div>
                  </div>
                  <div class="price">
                    <div
                      class="discountPrice"
                      v-show="x.minPrice !== x.minDiscountPrice"
                    >{{ $format.numberFormat(x.minPrice) }}원</div>
                    <div class="showPrice">
                      <div
                        class="discountRate"
                        v-show="x.minPrice !== x.minDiscountPrice"
                      >{{ x.minDiscountPrice > 0 && x.minPrice > 0 ? Math.ceil((x.minPrice - x.minDiscountPrice) / x.minPrice * 100) : 0 }}</div>
                      <div class="percent"
                           v-show="x.minPrice !== x.minDiscountPrice"
                      >%</div>
                      <div class="salePrice">{{ x.minDiscountPrice !== 0 ? `${$format.numberFormat(x.minDiscountPrice)}원` : '예약 마감' }}</div>
                    </div>
                  </div>
                </div>
                <div class="notice" v-if="x.notices && x.notices.find((v) => v.noticeType === 'CUSTOMER_BENEFITS')">
                  <div v-html="x.notices.find((v) => v.noticeType === 'CUSTOMER_BENEFITS' || v.noticeType === 'EVENT').contents"></div>
                </div>
              </li>
            </ul>
          </template>
          <div
            v-if="productType === 'leisure' && arr.length > 0"
            class="exLeisureListWrapper"
          >
            <LeisureListItem
              v-for="(objItem, index) in arr"
              :key="index"
              :objItem="objItem"
              class="listItem"
              @click.native="openDetail(objItem.id)"
            ></LeisureListItem>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="noResult">
      <div>기획전 컨텐츠를 불러오는데<br>실패하였습니다.</div>
      <div>다시 시도해주세요.</div>
    </div>
  </div>
</template>

<script>
import LeisureListItem from '@/components/MVP/Leisure/List/LeisureListItem.vue';
import FullLoading from '@/components/MVP/Common/Loading.vue';

export default {
  components: {
    LeisureListItem,
    FullLoading,
  },
  data() {
    // 벨리데이션 어캄
    let {
      checkin, checkout, adults, children,
      productType,
    } = this.$route.query;
    const { exhibitionId } = this.$route.query;
    if (!exhibitionId) {
      this.$store.commit('openAlert', {
        text: '잘못된 접근입니다.',
        arrBtn: [
          { text: '확인', event: () => { this.$router.replace(productType && productType === '/leisure' ? productType : '/'); } },
        ],
      });
    }
    if (!productType) {
      productType = 'place';
    }
    if (!checkin) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      checkin = this.$format.ymdDate(today);
      today.setDate(today.getDate() + 1);
      checkout = this.$format.ymdDate(today);
    }
    if (!adults) {
      adults = 2;
    }
    if (!children) {
      children = 0;
    }
    return {
      fade: false,
      objExhibition: {
        status: 'loading',
        result: {},
      },
      productType,
      exhibitionId,
      params: {
        checkin,
        checkout,
        adults,
        children,
      },
      categoryNameMap: {
        pension: '펜션',
        motel: '중저가 숙소',
        hotel: '호텔',
        guesthouse: '게스트하우스',
      },
      imgHeight: 462,
      noImage: false,
      noContent: false,
      page: 0,
      size: 25,
      total: 0,
      arr: [],
      loading: false,
    };
  },
  methods: {
    replaceNewLineChar(strInfo) {
      return strInfo ? strInfo.replace(/(\r\n|\r|\n)/g, '<br>') : '';
    },
    clickBtn(flag) {
      const query = { ...this.$route.query };
      query.callBack = this.$route.path;
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: `/place/${flag}`,
        query,
      });
    },
    submit(id) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$store.commit('place/setPageStatus', {
        key: 'detail',
        value: {
          scrollTop: 0,
          tab: 0,
        },
      });
      this.$router.push({
        path: `/place/result/${id}`,
        query: {
          checkin: this.$route.query.checkin,
          checkout: this.$route.query.checkout,
          adults: this.$route.query.adults,
          children: this.$route.query.children,
        },
      });
    },
    getExhibitionList() {
      this.objExhibition.status = 'loading';
      // 날짜랑 인원수 추가
      this.$apis.getExhibitionContent({
        exhibitionId: this.exhibitionId,
        productType: this.productType,
      }).then((resp) => {
        const div = document.createElement('DIV');
        div.innerHTML = resp.data.result.content;
        let last = div.innerHTML;
        div.style.display = 'none';
        document.body.appendChild(div);
        if (!div.childNodes || div.childNodes.length === 0 || !div.childNodes[0].childNodes || div.childNodes[0].childNodes.length === 0) {
          last = div.textContent;
        }
        document.body.removeChild(div);
        this.objExhibition.result = {
          ...resp.data.result,
          content: last,
        };
        this.noImage = !this.objExhibition.result.image;
        this.objExhibition.status = 'loaded';
        this.$nextTick(() => {
          const target = this.$refs.contentTarget;
          if (target) {
            const content = target.textContent;
            if (content.length === 0 && this.$refs.contentTarget.innerHTML.indexOf('<img') < 0) {
              this.noContent = true;
            }
          }
          const arrNode = document.querySelectorAll('.exhibitionContent a');
          for (let x = 0; x < arrNode.length; x += 1) {
            if (arrNode[x].attributes.href.value && arrNode[x].attributes.href.value.indexOf('http') !== 0) {
              const path = `/${this.$store.state.channelInfo.channelName.replace('dev_', '')}${arrNode[x].attributes.href.value}`;
              arrNode[x].href = path; // eslint-disable-line
              arrNode[x].target = '_self'; // eslint-disable-line
              arrNode[x].addEventListener('click', (e) => this.clickLink(e, path));
              if (arrNode[x].textContent === '상품 보러 가기') {
                arrNode[x].className = 'submit';
              }
            }
          }
        });
        this.getContentList(0);
      }).catch((e) => {
        this.objExhibition.status = 'loaded';
        this.noImage = true;
        console.log({ ...e });
      });
    },
    clickLink(e, path) {
      e.preventDefault();
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(path);
    },
    scrollEvent() {
      this.fade = document.documentElement.scrollTop >= (this.imgHeight - 58);
      if (this.total < this.arr.length && !this.loading
        && window.innerHeight + window.document.documentElement.scrollTop > window.document.body.clientHeight - 1
      ) {
        this.getContentList(this.page + 1);
      }
    },
    openDetail(id) {
      this.$store.commit('leisure/setPageStatus', {
        key: 'detail',
        value: {
          tab: 0,
          scrollTop: 0,
        },
      });
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(`/leisure/result/${id}`);
    },
    getContentList(page) {
      this.loading = true;
      this.page = page;
      const params = {
        productType: this.productType,
        exhibitionId: this.exhibitionId,
      };
      if (this.productType === 'place') {
        const { checkin, checkout, adults } = this.params;
        params.checkIn = checkin;
        params.checkOut = checkout;
        params.adultNum = adults;
      }
      this.$apis.getExhibitionList({ ...params, page, size: this.size }).then((resp) => {
        this.loading = false;
        if (this.productType === 'leisure') {
          resp.data.result.contents.forEach((objList) => {
            this.arr.push({
              ...objList,
              categoryName: objList.type.length > 0 ? objList.type.map((obj) => obj.name)[0] : '',
              minPrice: objList.options && objList.options.length > 0 ? objList.options.reduce((min, x) => ((min.gajagoSalePrice || min.coverPrice) < (x.gajagoSalePrice || x.coverPrice) ? min : x)) : 0,
            });
          });
        } else {
          resp.data.result.contents.forEach((objList) => {
            this.arr.push(objList);
          });
        }
        this.total = resp.data.result.total;
      }).catch(() => {
        this.loading = false;
      });
    },
  },
  mounted() {
    window.addEventListener('scroll', this.scrollEvent);
    this.getExhibitionList();
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollEvent);
  },
};
</script>

<style lang="scss">
.exhibitionWrapper{
  &.mobile{
    .exhibitionContent img{
      width: 100%;
    }
    .exhibitionContent .submit{
      width: 100%;
    }
  }
  .mainBack{
    position: fixed;
    z-index: -1;
    top: 0;
    width: 100%;
    left: 0;
    > div{
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      color: #FFF;
      position: relative;
      &:before{
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.4;
        background-image: linear-gradient(to bottom, #000, rgba(0, 0, 0, 0) 132%);
      }
      > div{
        position: relative;
        height: 100%;
        width: 100%;
        z-index: 1;
        > div{
          position: absolute;
          bottom: 30px;
          left: $sidePadding * 1px;
          right: $sidePadding * 1px;
          color: #FFF;
          > div:nth-of-type(1){
            font-size: 24px;
            line-height: 29px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          > div:nth-of-type(2){
            font-size: 16px;
            line-height: 19px;
          }
        }
      }
    }
  }
  &.noContent{
    .mainWrap .mainWrapBackHeight{
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      .exhibitionContent{
        display: none;
      }
    }
  }
  .mainWrap{
    .mainWrapBackHeight{
      min-height: calc(100vh - 452px);
      background-color: #FFF;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      overflow: hidden;
    }
  }
  .exhibitionContent{
    background-color: #FFF;
    padding: 40px $sidePadding * 1px;
    p{
      font-size: 14px;
      line-height: 19px;
    }
    img{
      width: calc(100% - 40px);
      margin: 20px auto;
      display: block;
    }
    h1{
      font-size: 28px;
      margin: 0;
      padding: 10px 0;
    }
    h2{
      line-height: 32px;
    }
    .ql-indent-1{
      padding-left: 20px;
    }
    .ql-align-center{
      text-align: center;
    }
    a.submit{
      width: calc(100% - 40px);
      margin: 20px auto;
      display: block;
      height: 44px;
      border-radius: 4px;
      border: 1px solid #0152cc;
      text-align: center;
      line-height: 42px;
      font-weight: bold;
      color: #0152cc;
      font-size: 16px;
      &:after{
        content: ' >';
      }
    }
  }
  .btnWrap{
    background-color: #FFF;
    height: 56px;
    border: 1px solid #ebecf1;
    > button{
      height: 100%;
      float: left;
      width: 50%;
      font-size: 13px;
      text-align: left;
      position: relative;
      padding-left: 48px;
      &:before{
        content: '';
        position: absolute;
        top: 18px;
        height: 20px;
        width: 20px;
        background-size: 20px;
        left: $sidePadding * 1px;
      }
      &:nth-of-type(1){
        border-right: 1px solid #ebecf1;
        &:before{
          background: url(~assets/img/icon-calendar.svg) center center no-repeat;
        }
      }
      &:nth-of-type(2):before{
        background: url(~assets/img/icon-user-black.svg) no-repeat center center;
      }
    }
    &:after{
      content: '';
      clear: both;
      display: block;
    }
  }
  .placeList{
    padding: 10px 0 80px;
    background-color: #f8f9fb;
    li{
      background-color: #FFF;
      cursor: pointer;
      width: 100%;
      margin-bottom: 8px;
      border-bottom: 1px solid #ebecf1;
      .bgImg{
        width: 100%;
        > div{
          width: 100%;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          padding-bottom: 51.2%;
        }
      }
      .textBox{
        padding: 0 24px;
        > .intro {
          margin-top: 12px;
          > div{
            float: left;
            font-size: 11px;
            font-weight: bold;
            line-height: 18px;
            color: #939499;
          }
          &:after{
            content: '';
            clear: both;
            display: block;
          }
        }
        .name {
          font-size: 16px;
          font-weight: bold;
          line-height: 22px;
        }
        .review{
          font-size: 11px;
          line-height: 18px;
          > div{
            float: left;
            &.locationText{
            }
            &.reviewText{
              font-weight: bold;
              margin-left: 8px;
              > span{
                font-weight: normal;
                color: #939499;
              }
              &:before{
                content: '';
                display: inline-block;
                background: url(~assets/img/star.svg) center center no-repeat;
                background-size: 14px;
                height: 14px;
                width: 14px;
                float: left;
                margin-right: 2px;
              }
            }
          }
          &:after{
            content: '';
            display: block;
            clear: both;
          }
        }
        .price {
          float: right;
          padding-bottom: 12px;
          > div{
            line-height: 13px;
            height: 13px;
            &.discountPrice{
              font-size: 10px;
              color: #868686;
              text-decoration: line-through;
              text-align: right;
            }
            &.showPrice{
              height: 22px;
              line-height: 22px;
              .discountRate{
                float: left;
                color: #d31111;
              }
              .percent{
                color: #d31111;
                font-size: 12px;
                float: left;
                margin-right: 4px;
              }
              .salePrice{
                float: left;
                font-weight: bold;
              }
              &:after{
                content: '';
                clear: both;
                display: block;
              }
            }
          }
        }
        &:after{
          display: block;
          content: '';
          clear: both;
        }
      }
      .notice{
        padding: 0 24px 10px;
        font-size: 11px;
        color: #939499;
        line-height: 18px;
        > div{
          padding-top: 9px;
          border-top: 1px solid #ebecf1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .noResult {
    text-align: center;
    padding: 50px 24px;
    > div:first-of-type {
      font-size: 23px;
      line-height: 30px;
      font-weight: bold;
    }

    > div:nth-of-type(2) {
      margin-top: 4px;
      font-size: 13px;
      line-height: 20px;
      color: #939499;
    }
  }
  .exLeisureListWrapper{
    padding: 10px 0 80px;
    background-color: #f8f9fb;
    .listItem{
      margin-top: 10px;
      &:first-of-type{
        margin-top: 0;
      }
    }
  }
}
</style>

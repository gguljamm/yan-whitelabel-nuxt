<template>
  <div class="tabRoom" :class="type === 'home' ? 'home' : ''">
    <div class="subBtnWrap">
      <div>
        <button
          @click="clickBtn('date')"
        >{{ $format.formatDate(params.checkin, 'md') }} - {{ $format.formatDate(params.checkout, 'md') }}</button>
      </div>
    </div>
    <div v-if="type !== 'home'" class="roomTitleWrap">
      <div class="titleWrap">
        <div
          class="mainImg"
          :style="{ backgroundImage: representationImage ? `url(${representationImage.thumbUrl || representationImage.bpUrl})` : '' }"
        ></div>
        <div class="info">
          <div class="category">
            <span>{{ categoryNameMap[objPlace.place.category.toLowerCase()] }}</span>
            <span v-show="objPlace.place.star && objPlace.place.star.rating">| {{ objPlace.place.star ? objPlace.place.star.rating : '' }}성급</span>
          </div>
          <div class="name">{{ objPlace.place.korName }}</div>
        </div>
      </div>
    </div>
    <div class="roomQuickFilter">
      <button :class="{ active: arrRoomFilter.length === 0 }" @click="changeRoomFilter('all')">모두</button>
      <button
        v-for="(x, index) in objRoomFilterList"
        :key="index"
        :class="{ active: arrRoomFilter.indexOf(x.id) >= 0 }"
        @click="changeRoomFilter(x.id)"
      >{{ x.text }}</button>
    </div>
    <ul class="roomList">
      <li
        v-for="(x, index) in arrRoom"
        :key="index"
        @click="submit(x)"
      >
        <div class="mainInfo">
          <div><div
            :style="{ backgroundImage: x.images[0] ? `url(${x.images[0].thumbUrl || x.images[0].bpUrl})` : '' }"
          ></div></div>
          <div>
            <div>
              <div v-html="x.name.find((v) => v.language === 'ko').name"></div>
              <div>{{ x.capacity }}인 기준, 최대 {{ x.maxCapacity }}인</div>
            </div>
            <div class="bottomInfo">
              <div class="checkin" v-if="x.checkIn">
                <div>체크인</div>
                <div>{{ x.checkIn ? x.checkIn.split(' ')[1].split(':').slice(0, 2).join(':') : '' }}~</div>
              </div>
              <div class="price">
                <div>
                  <span class="middleline" v-if="x.price && x.price !== x.discountPrice">{{ $format.numberFormat(x.price) }}원</span>
                  <span v-else>&nbsp;</span>
                </div>
                <div v-if="x.price">
                  <span
                    v-show="x.price !== x.discountPrice && !canDiscount(x.discountPrice || x.price)"
                  >{{ Math.ceil((x.price - (x.discountPrice || 0)) / x.price * 100) }}<span>%</span></span>
                  <span v-if="!canDiscount(x.discountPrice || x.price)"><strong>{{ $format.numberFormat(x.discountPrice || x.price || 0) }}</strong>원</span>
                  <span v-else>{{ $format.numberFormat(x.discountPrice || x.price || 0) }}원</span>
                </div>
                <div v-else>
                  <span></span>
                  <span class="soldOut">SOLD OUT</span>
                </div>
              </div>
              <div class="coupon" v-if="x.price && canDiscount(x.discountPrice || x.price)">
                <div>
                  <div>{{ $format.optimizedDiscountPrice(x.discountPrice || x.price, $store.state.channelInfo.discount.place).discountName || '선착순' }}</div>
                  <div>{{ discountPriceFormat(x.discountPrice || x.price) }}</div>
                </div>
                <div>
                  <div>선착순 할인 적용 시{{ $format.optimizedDiscountPrice(x.discountPrice || x.price, $store.state.channelInfo.discount.place).maxPriceText ? ` (최대 ${$format.optimizedDiscountPrice(x.discountPrice || x.price, $store.state.channelInfo.discount.place).maxPriceText})` : '' }}</div>
                  <span>{{ Math.ceil((x.price - getDiscountPrice(x.discountPrice)) / x.price * 100) }}<span>%</span></span>
                  <span><strong>{{ $format.numberFormat(getDiscountPrice(x.discountPrice || x.price)) }}</strong>원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="subInfo" v-if="x.description" v-html="x.description.replace(/(\r\n|\r|\n)/g, '<br>')"></div>
      </li>
      <li v-if="arrRoom.length === 0" class="noResult">
        <template v-if="arrRoomFilter.length === 0">
          <div>예약 가능한 객실이 없습니다.</div>
          <div>다른 숙소를 검색해 주세요.</div>
        </template>
        <template v-else>
          <div>조건에 맞는 객실이 없습니다.</div>
        </template>
      </li>
    </ul>
    <div class="btnWrap"
      v-if="type === 'home'"
      v-show="place.rooms.length > 3"
    >
      <button
        @click="clickRoomMore()"
      >{{ place.rooms.length - 3 }}개 객실 더보기</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['type', 'params', 'objPlace'],
  data() {
    return {
      arrRoomFilter: [], // 0: 조식 1: 얼리체크인 2: 3인이상 3: soldout제외
      objRoomFilterList: [
        // '조식 서비스 포함',
        // '얼리체크인 객실',
        { id: 2, text: '3인 이상 가능 객실' },
        { id: 3, text: 'SOLD OUT 제외' },
      ],
      categoryNameMap: {
        pension: '펜션',
        motel: '중저가 숙소',
        hotel: '호텔',
        guesthouse: '게스트하우스',
      },
    };
  },
  computed: {
    representationImage() {
      return this.objPlace.place.images ? this.objPlace.place.images.find((v) => v.categoryType === 'REPRESENTATION') || this.objPlace.place.images[0] : '';
    },
    arrRoom() {
      if (this.place.rooms) {
        const temp = this.place.rooms.filter((v) => {
          let flag = true;
          if ((this.arrRoomFilter.indexOf(0) >= 0 && v.breakfast === 'NOT_AVAILABLE')
            || (this.arrRoomFilter.indexOf(1) >= 0 && (!v.checkIn || parseInt(v.checkIn.split(' ')[1].split(':')[0], 10) > 12))
            || (this.arrRoomFilter.indexOf(2) >= 0 && v.maxCapacity < 3)
            || (this.arrRoomFilter.indexOf(3) >= 0 && v.status === 0)
          ) {
            flag = false;
          }
          return flag;
        });
        let arr = temp.filter((z) => z.price).sort((a, b) => a.discountPrice - b.discountPrice);
        arr = arr.concat(temp.filter((z) => !z.price));
        return (this.type === 'home' ? arr.slice(0, 3) : arr).filter((z) => !z.price || z.price >= 1000);
      }
      return [];
    },
    place() {
      return this.objPlace.place;
    },
  },
  methods: {
    discountPriceFormat(price) {
      const discount = this.$format.optimizedDiscountPrice(price, this.$store.state.channelInfo.discount.place);
      let temp = '';
      if (discount.discountAmount) {
        temp = `${this.formatPrice(discount.discountAmount)}`;
      } else if (discount.discountPercent) {
        temp = `${discount.discountPercent}%`;
      }
      return temp;
    },
    canDiscount(price) {
      const discount = this.$format.optimizedDiscountPrice(price, this.$store.state.channelInfo.discount.place);
      return !!discount;
    },
    getDiscountPrice(price) {
      const discount = this.$format.optimizedDiscountPrice(price, this.$store.state.channelInfo.discount.place);
      return price - discount.appliedPrice;
    },
    submit(room) {
      if (room.price) {
        this.$emit('submit', room.no);
      } else {
        this.$store.commit('openNotice', { text: '예약 마감된 객실입니다. 다른 객실을 선택해 주세요.' });
      }
    },
    clickRoomMore() {
      this.$emit('clickRoomMore', 1);
    },
    changeRoomFilter(v) {
      if (v === 'all') {
        this.arrRoomFilter = [];
      } else {
        const index = this.arrRoomFilter.indexOf(v);
        if (index >= 0) {
          this.arrRoomFilter.splice(index, 1);
        } else {
          this.arrRoomFilter.push(v);
        }
      }
    },
    clickBtn(flag) {
      this.$emit('openSearch', flag);
    },
    formatPrice(price) {
      let numPrice = parseInt(price, 10);
      let cond = parseInt(numPrice / 10000, 10);
      let text = '';
      if (cond === 1) {
        text = '만';
      } else if (cond >= 1) {
        text = `${parseInt(cond, 10)}만`;
      }
      numPrice -= parseInt(numPrice / 10000, 10) * 10000;
      cond = parseInt(numPrice / 1000, 10);
      if (cond === 1) {
        text = '천';
      } else if (cond >= 1) {
        text += `${parseInt(cond, 10)}천`;
      }
      numPrice -= parseInt(numPrice / 1000, 10) * 1000;
      cond = parseInt(numPrice / 100, 10);
      if (cond === 1) {
        text = '백';
      } else if (cond >= 1) {
        text += `${parseInt(cond, 10)}백`;
      }
      numPrice -= parseInt(numPrice / 100, 10) * 100;
      if (numPrice) {
        text += numPrice;
      }
      if (!text) {
        text = `${this.$format.numberFormat(parseInt(price, 10))}`;
      }
      return `${text}원`;
    },
  },
};
</script>

<style lang="scss">
  .tabRoom{
    &.home{
      padding-bottom: 0;
      min-height: auto;
    }
    padding-bottom: 80px;
    background-color: #fff;
    min-height: calc(100vh - #{ $header * 1px } - 40px);
    font-size: 12px;
    .spacePadding{
      padding: 16px $sidePadding * 1px 0;
    }
    .roomTitleWrap{
      background-color: #FFF;
      padding: 0 $sidePadding * 1px;
      .titleWrap{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 20px 0;
        border-bottom: 1px solid #ebecf1;
        .mainImg{
          flex-shrink: 0;
          width: 46px;
          height: 46px;
          border-radius: 23px;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          background-color: #ebecf1;
        }
        .info{
          margin-left: 14px;
          .category{
            color: #939499;
            font-size: 13px;
            font-weight: bold;
            line-height: 18px;
            margin-bottom: 2px;
          }
          .name{
            width: 100%;
            font-weight: bold;
            font-size: 16px;
            line-height: 22px;
          }
        }
      }
    }
    .roomQuickFilter{
      background-color: #FFF;
      padding: 10px $sidePadding * 1px;
      white-space: nowrap;
      overflow-x: auto;
      font-size: 0;
      > button{
        font-size: 13px;
        height: 34px;
        border-radius: 4px;
        background-color: #FFF;
        border: 1px solid #ebecf1;
        display: inline-block;
        margin-right: 8px;
        padding: 0 12px;
        transition: .3s ease;
        &:last-of-type{
          margin-right: 0;
        }
        &.active{
          background-color: #000;
          color: #FFF;
          border-color: #000;
        }
      }
    }
    .subBtnWrap{
      background-color: #FFF;
      width: 100%;
      > div{
        height: 57px;
        border-bottom: 1px solid #ebecf1;
        > button{
          height: 100%;
          float: left;
          width: 100%;
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
            background: url(~assets/img/icon-calendar.svg) center center no-repeat;
            background-size: 20px;
            left: $sidePadding * 1px;
          }
          &:after{
            content: '';
            position: absolute;
            background: url(~assets/img/icon-caret-down-black.svg) center center no-repeat;
            background-size: 18px;
            right: $sidePadding * 1px;
            width: 18px;
            height: 18px;
            top: 17px;
          }
        }
      }
    }
    .roomList{
      font-size: 14px;
      background-color: #FFF;
      > li{
        cursor: pointer;
        padding: 16px $sidePadding * 1px 0;
        border-bottom: 1px solid #ebecf1;
        &.noResult{
          cursor: auto;
          text-align: center;
          padding-top: 52px;
          padding-bottom: 52px;
          background-color: #f8f9fb;
          > div:first-of-type{
            color: #000;
            font-size: 18px;
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
        &:last-of-type{
          border-bottom: 0;
        }
        .mainInfo{
          display: flex;
          width: 100%;
          padding-bottom: 20px;
          > div:first-of-type{
            width: 34%;
            > div{
              padding-bottom: 100%;
              border-radius: 4px;
              background: #ebecf1 no-repeat center center;
              background-size: cover;
            }
          }
          > div:nth-of-type(2){
            width: 66%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            > div{
              padding-left: 12px;
            }
            > div:first-of-type{
              width: 100%;
              > div:nth-of-type(1){
                padding-top: 2px;
                line-height: 22px;
                font-size: 16px;
                font-weight: bold;
              }
              > div:nth-of-type(2){
                font-size: 13px;
                color: #939499;
                line-height: 20px;
              }
            }
            .bottomInfo{
              width: 100%;
              padding-top: 36px;
              .coupon{
                padding-top: 4px;
                clear: both;
                text-align: right;
                font-size: 0;
                > div:first-child{
                  font-size: 10px;
                  display: inline-block;
                  height: 18px;
                  border-radius: 9px;
                  background-color: #ebecf1;
                  > div{
                    float: left;
                    line-height: 18px;
                    padding: 0 6px;
                    &:nth-of-type(1){
                      background-color: #de2e5f;
                      color: #FFF;
                      border-radius: 9px;
                    }
                  }
                }
                > div:nth-of-type(2){
                  padding-top: 8px;
                  font-size: 0;
                  > div{
                    color: #d0021b;
                    font-size: 10px;
                    padding-bottom: 4px;
                  }
                  > span:nth-of-type(1){
                    color: #d0021b;
                    margin-right: 4px;
                    font-size: 16px;
                    > span{
                      font-size: 12px;
                    }
                  }
                  > span:nth-of-type(2){
                    font-size: 16px;
                    &.soldOut{
                      font-weight: bold;
                      color: #cccdd1;
                    }
                  }
                }
              }
              .checkin {
                float: left;
                width: 30%;
                font-size: 12px;
                line-height: 15px;
                > div:nth-of-type(1){
                  color: #868686;
                  margin-bottom: 2px;
                }
              }
              .price{
                width: 70%;
                float: right;
                text-align: right;
                white-space: nowrap;
                > div:first-of-type{
                  padding-top: 2px;
                  color: #868686;
                  font-size: 10px;
                  line-height: 12px;
                  .middleline{
                    text-decoration: line-through;
                  }
                }
                > div:nth-of-type(2){
                  margin-top: 3px;
                  line-height: 14px;
                  height: 14px;
                  font-size: 0;
                  > span:nth-of-type(1){
                    color: #d0021b;
                    margin-right: 4px;
                    font-size: 16px;
                    > span{
                      font-size: 12px;
                    }
                  }
                  > span:nth-of-type(2){
                    font-size: 16px;
                    &.soldOut{
                      font-weight: bold;
                      color: #cccdd1;
                    }
                  }
                }
              }
            }
          }
        }
        .subInfo{
          color: #939499;
          border-top: 1px solid #ebecf1;
          padding: 10px 0;
          font-size: 11px;
          line-height: 18px;
        }
        &:after{
          content: '';
          display: block;
          clear: both;
        }
      }
    }
  }
</style>

<template>
  <div class="calendarWrapper">
    <div class="fixWidth">
      <div ref="calendarHeader" class="calendarHeader">
        <div class="fixWidth">
          <p
            class="flow"
            v-if="checkin && checkout"
          >{{ $format.formatDate(checkin, 'md') }}-{{ $format.formatDate(checkout, 'md') }}, {{ $format.getBetweenDay(checkin, checkout) }}박</p>
          <p class="flow" v-else>{{ dateFlag === 'checkin' ? '이제, 체크인 날짜를 선택하세요.' : '체크아웃 날짜를 선택하세요.' }}</p>
          <div class="keyword">{{ $route.query.category ? `${categoryMap[$route.query.category]} | ` : '' }}{{ $route.query.keyword }}</div>
          <div class="dow">
            <div v-for="x in dow" :key="x">{{ x }}</div>
          </div>
        </div>
      </div>
      <div ref="monthWrapper" class="monthWrapper">
        <div v-for="(m, mIndex) in arrCalendar" :key="m.month" class="month" :ref="m.month">
          <p>{{ parseInt(m.month.substr(4, 2)) }}월</p>
          <div v-for="(w, wIndex) in m.week" :key="wIndex" class="week">
            <div v-for="(d, dIndex) in w" :key="dIndex" class="day"
              :class="{
                active: isValidDate(m.month, d.date),
                checkin: isCheckinDate(m.month, d.date),
                checkout: isCheckoutDate(m.month, d.date),
                range: isRangeDate(m.month, d.date) && d.date !== 0,
                holiday: isHoliday(m.month, d.date),
                rangeLast: isRangeDate(m.month, d.date) && isRangeLast(mIndex, wIndex, d.date),
                rangeFirst: isRangeDate(m.month, d.date) && isRangeFirst(mIndex, wIndex, d.date),
              }"
              @click="selectDate(m.month, d.date)"
            >
              <div>
                <span>{{ d.date === 0 ? '&nbsp;' : d.date }}</span>
                <!-- <span v-if="isToday(m.month, d.date)">오늘</span> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dawnCheckInPopup" v-if="isDawn && !checkin">
        <div class="fixWidth">
          <DawnCheckIn
            :type="'calendar'"
          ></DawnCheckIn>
        </div>
      </div>
      <global-button
        v-show="checkin"
        :transparent="true"
        :text="$route.query.callBack ? '확인' : '검색'"
        :noShadow="true"
        @submit="submit"
      ></global-button>
    </div>
  </div>
</template>

<script>
import DawnCheckIn from './DawnCheckIn.vue';

export default {
  components: {
    DawnCheckIn,
  },
  data() {
    const arrCalendar = [];
    const today = new Date();
    const { category, type } = this.$route.query;
    const isDawn = (category === 'motel' || category === 'hotel' || type === 'search') && today.getHours() >= 0 && today.getHours() < 2;
    if (isDawn) {
      today.setDate(today.getDate() - 1);
    }
    const todayString = `${today.getFullYear()}-${this.$format.zeros(today.getMonth() + 1)}-${this.$format.zeros(today.getDate())}`;
    const temp = new Date(todayString);
    temp.setDate(temp.getDate() + 90);
    const maxDate = `${temp.getFullYear()}-${this.$format.zeros(temp.getMonth() + 1)}-${this.$format.zeros(temp.getDate())}`;
    today.setDate(1);
    const tomorrow = new Date(todayString);
    tomorrow.setDate(tomorrow.getDate() + 1);
    // const tomorrowString = `${tomorrow.getFullYear()}-${this.$format.zeros(tomorrow.getMonth() + 1)}-${this.$format.zeros(tomorrow.getDate())}`;
    for (let x = 1; x <= 4; x += 1) {
      const thisToday = new Date(todayString);
      thisToday.setDate(1);
      thisToday.setMonth(today.getMonth() + x);
      thisToday.setDate(0);
      const key = `${thisToday.getFullYear()}${this.$format.zeros(thisToday.getMonth() + 1)}`;
      const lastDay = thisToday.getDate();
      const lastDay2 = thisToday.getDay();
      thisToday.setDate(1);
      const firstDay = thisToday.getDay();
      const arrDate = [];
      for (let y = 0; y < firstDay; y += 1) {
        arrDate.push({ date: 0 });
      }
      for (let y = 1; y <= lastDay; y += 1) {
        arrDate.push({ date: y });
      }
      for (let y = lastDay2; y < 6; y += 1) {
        arrDate.push({ date: 0 });
      }
      const arrWeek = [];
      let k = 0;
      for (let y = 0; y < arrDate.length; y += 1) {
        if (!Array.isArray(arrWeek[k])) {
          arrWeek[k] = [];
        }
        arrWeek[k].push(arrDate[y]);
        if (arrWeek[k].length >= 7) {
          k += 1;
        }
      }
      arrCalendar.push({ month: key, week: arrWeek });
    }
    return {
      dateFlag: 'checkin',
      dow: ['일', '월', '화', '수', '목', '금', '토'],
      arrCalendar,
      minDate: parseInt(todayString.replace(/-/g, ''), 10),
      maxDate: parseInt(maxDate.replace(/-/g, ''), 10),
      checkin: this.$route.query.checkin ? this.$route.query.checkin : null,
      checkout: this.$route.query.checkout ? this.$route.query.checkout : null,
      holiday: ['20200930', '20201001', '20201002',
        '20210211', '20210212', '20210213', '20210519', '20210920', '20210921', '20210922',
        '20220131', '20220201', '20220202', '20220122', '20220909', '20220910',
        '20230121', '20230123', '20230527', '20230928', '20230929', '20230930',
        '20240209', '20240210', '20240410', '20240515', '20240916', '20240917', '20240918',
        '20250128', '20250129', '20250130', '20251006', '20251007'],
      generalHoliday: ['0101', '0301', '0505', '0606', '0815', '1003', '1009', '1225'],
      categoryMap: {
        hotel: '호텔',
        motel: '중저가 숙소',
        guesthouse: '게스트하우스',
        pension: '펜션/풀빌라',
        resort: '리조트/콘도',
        camping: '글램핑/카라반',
        premiumhotel: '프리미엄호텔',
      },
      isDawn,
      today: new Date(),
    };
  },
  methods: {
    isValidDate(ym, d) {
      if (d === 0) {
        return false;
      }
      const temp = parseInt(`${ym}${this.$format.zeros(d)}`, 10);
      if (this.dateFlag === 'checkin') {
        return temp >= this.minDate && temp < this.maxDate;
      }
      const t = new Date(this.checkin);
      t.setDate(t.getDate() + (this.$route.query.consecutive === 'f' ? 2 : 10));
      let max = parseInt(`${t.getFullYear()}${this.$format.zeros(t.getMonth() + 1)}${this.$format.zeros(t.getDate())}`, 10);
      if (this.maxDate < max) {
        max = this.maxDate;
      }
      return temp >= this.minDate && temp < max;
    },
    isCheckinDate(ym, d) {
      const ymd = `${ym.substr(0, 4)}-${ym.substr(4, 2)}-${this.$format.zeros(d)}`;
      return ymd === this.checkin;
    },
    isCheckoutDate(ym, d) {
      const ymd = `${ym.substr(0, 4)}-${ym.substr(4, 2)}-${this.$format.zeros(d)}`;
      return ymd === this.checkout;
    },
    isRangeDate(ym, d) {
      const temp = parseInt(`${ym}${this.$format.zeros(d)}`, 10);
      return (this.checkin && this.checkout
        && temp >= parseInt(this.checkin.replace(/-/g, ''), 10)
        && temp <= parseInt(this.checkout.replace(/-/g, ''), 10));
    },
    isRangeLast(mIndex, wIndex, d) {
      const arr = this.arrCalendar[mIndex].week[wIndex].filter((v) => v.date !== 0).map((v) => v.date);
      return arr.indexOf(d) === arr.length - 1;
    },
    isRangeFirst(mIndex, wIndex, d) {
      const arr = this.arrCalendar[mIndex].week[wIndex].filter((v) => v.date !== 0).map((v) => v.date);
      return arr.indexOf(d) === 0;
    },
    isHoliday(ym, d) {
      if (d === 0) {
        return false;
      }
      const temp = `${ym}${this.$format.zeros(d)}`;
      if (this.holiday.indexOf(temp) >= 0) {
        return true;
      }
      const md = temp.substr(4, 4);
      return this.generalHoliday.indexOf(md) >= 0;
    },
    isToday(ym, d) {
      const today = this.$format.ymdDate(new Date());
      const ymd = `${ym.substr(0, 4)}-${ym.substr(4, 2)}-${this.$format.zeros(d)}`;
      return ymd === today;
    },
    selectDate(ym, d) {
      if (d === 0 || !this.isValidDate(ym, d)) {
        return;
      }
      const ymd = `${ym.substr(0, 4)}-${ym.substr(4, 2)}-${this.$format.zeros(d)}`;
      if (this.$store.state.channelInfo.channelName === 'korail' && ymd === this.$format.ymdDate(this.today)) {
        this.$store.commit('openNotice', {
          text: '<strong>오늘 입실을 선택하셨습니다.</strong><br>당일 이용 예약 건은 취소 시 환불이 불가하니, 취소 및 환불 규칙을 확인해주세요.',
          bottom: 86,
          time: 4000,
        });
      }
      if (this.dateFlag === 'checkin') {
        this.checkin = ymd;
        this.checkout = '';
        this.dateFlag = 'checkout';
      } else {
        if (ymd === this.checkin) {
          return;
        }
        if (ymd < this.checkin) {
          this.checkin = ymd;
          return;
        }
        this.checkout = ymd;
        this.dateFlag = 'checkin';
      }
    },
    submit() {
      let { checkout } = this;
      if (!checkout) {
        const d = new Date(this.checkin);
        d.setDate(d.getDate() + 1);
        checkout = `${d.getFullYear()}-${this.$format.zeros(d.getMonth() + 1)}-${this.$format.zeros(d.getDate())}`;
      }
      this.$emit('submit', this.checkin, checkout);
    },
  },
  mounted() {
    if (this.checkin) {
      const ym = this.checkin.replace(/-/g, '').substr(0, 6);
      setTimeout(() => {
        const topSpace = this.$refs.calendarHeader.offsetHeight + document.getElementsByClassName('gnbWrapper')[0].offsetHeight;
        const topPadding = parseInt(getComputedStyle(this.$refs.monthWrapper).paddingTop, 10);
        let offsetTop = this.$refs[ym][0].offsetTop - (topSpace + topPadding);
        const maxTop = this.$refs.monthWrapper.offsetHeight - window.innerHeight + topSpace;
        if (offsetTop < 0) {
          offsetTop = 0;
        } else if (offsetTop > maxTop) {
          offsetTop = maxTop;
        }
        window.scrollTo(0, offsetTop);
      }, 1);
    }
  },
};
</script>

<style lang="scss">
.noHeader{
  .calendarWrapper > div > .calendarHeader{
    top: 0;
  }
}
  .calendarWrapper{
    > div{
      background-color: #FFF;
      .calendarHeader{
        position: sticky;
        z-index: 5;
        top: $header * 1px;
        left: 0;
        width: 100%;
        background-color: #FFF;
        border-bottom: 1px solid #ebecf1;
        > div{
          width: 100%;
          padding: 0 $sidePadding * 1px;
          background-color: #FFF;
          .keyword{
            font-size: 13px;
            line-height: 20px;
            color: #939499;
            padding-bottom: 16px;
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          > p{
            font-size: 16px;
            font-weight: bold;
            line-height: 22px;
            padding-top: 16px;
          }
          .dow{
            white-space: nowrap;
            > div{
              display: inline-block;
              width: 14.285714%;
              text-align: center;
              line-height: 38px;
              font-size: 13px;
              &:first-of-type, &:last-of-type{
                color: #d0021b;
              }
            }
          }
        }
      }
      .monthWrapper {
        padding: 20px 20px 0;
        .month{
          padding-bottom: 20px;
          > p{
            padding: 8px 0;
            font-size: 13px;
            font-weight: bold;
          }
          .week{
            overflow: hidden;
            height: 48px;
            margin: 2px 0;
            .day{
              float: left;
              width: 14.285714%;
              text-align: center;
              height: 44px;
              font-size: 13px;
              font-weight: bold;
              opacity: .3;
              position: relative;
              > div{
                height: 44px;
                width: 44px;
                border-radius: 22px;
                line-height: 44px;
                margin: 0 auto;
                position: relative;
                z-index: 2;
                > span:nth-of-type(1){
                  font-weight: bold;
                }
              }
              &.active{
                cursor: pointer;
                opacity: 1;
              }
              &.checkin > div, &.checkout > div{
                background-color: #ff3478;
                color: #FFF;
                box-shadow: 0 2px 4px 0 rgba(255, 52, 120, 0.3);
              }
              &.today > div{
                > span{
                  line-height: 12px;
                  display: block;
                  &:nth-of-type(1){
                    padding-top: 7px;
                  }
                  &:nth-of-type(2){
                    font-size: 10px;
                  }
                }
              }
              &.range{
                &:before{
                  content: '';
                  position: absolute;
                  background-color: #ffe1eb;
                  z-index: 0;
                  left: 0;
                  height: 44px;
                  width: 100%;
                }
                &.rangeLast:before{
                  border-top-right-radius: 22px;
                  border-bottom-right-radius: 22px;
                }
                &.rangeFirst:before{
                  border-top-left-radius: 22px;
                  border-bottom-left-radius: 22px;
                }
              }
              &.range.checkin{
                &:after{
                  content: '';
                  position: absolute;
                  z-index: 1;
                  left: 0;
                  height: 44px;
                  width: 50%;
                  background-color: #FFF;
                  top: 0;
                }
              }
              &.range.checkout{
                &:after{
                  content: '';
                  position: absolute;
                  z-index: 1;
                  right: 0;
                  height: 44px;
                  width: 50%;
                  background-color: #FFF;
                  top: 0;
                }
              }
              &:first-of-type, &:last-of-type, &.holiday{
                color: #d31111;
              }
            }
          }
        }
      }
      .dawnCheckInPopup{
        position: fixed;
        bottom: 30px;
        width: 100%;
        left: 0;
        z-index: 5;
        > div{
          padding: 0 $sidePadding * 1px;
        }
      }
    }
  }
.korail .calendarWrapper > div .monthWrapper .month .week .day.checkin > div,
.korail .calendarWrapper > div .monthWrapper .month .week .day.checkout > div{
  background-color: #568bc2;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  color: #fff;
}
.korail .calendarWrapper > div .monthWrapper .month .week .day.range:before{
  background-color: rgb(213, 230, 240);
}
</style>

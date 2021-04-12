<template>
  <div class="reviewContent" :class="type">
    <div class="title">평점 및 리뷰</div>
    <div class="summary">
      <div>
        <div></div>
        <div>{{ totalReviewScore.totalRating }}점</div>
        <div>(후기 {{ objPlace.review.total }})</div>
      </div>
      <ul>
        <li>
          <div>친절도<span>{{ totalReviewScore.serviceRating }}</span></div>
          <div><div :style="{ width: `${totalReviewScore.serviceRating / 5 * 100}%` }"></div></div>
        </li>
        <li>
          <div>청결도<span>{{ totalReviewScore.cleanRating }}</span></div>
          <div><div :style="{ width: `${totalReviewScore.cleanRating / 5 * 100}%` }"></div></div>
        </li>
        <li>
          <div>편의성<span>{{ totalReviewScore.convenienceRating }}</span></div>
          <div><div :style="{ width: `${totalReviewScore.convenienceRating / 5 * 100}%` }"></div></div>
        </li>
        <li>
          <div>비품 만족도<span>{{ totalReviewScore.locationRating }}</span></div>
          <div><div :style="{ width: `${totalReviewScore.locationRating / 5 * 100}%` }"></div></div>
        </li>
      </ul>
    </div>
    <ul class="reviews">
      <li v-for="(x, index) in arrReview" :key="index">
        <div class="topInfo">
          <div class="left">
            <div class="rating"><span class="val">{{ x.totalRating.toFixed(1) }}</span></div>
          </div>
          <div class="right">
            <div class="name">{{ x.reviewer }}</div>
            <div class="date">{{ $format.formatDate(x.date, 'ko_ymd') }}</div>
          </div>
        </div>
        <div class="contents" v-html="decodeHtml(x.content)"></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    objPlace: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: 'main',
    },
  },
  data() {
    return {
      page: 1,
    };
  },
  computed: {
    arrReview() {
      if (this.type === 'summary') {
        return this.objPlace.review.reviews.slice(0, 3);
      }
      return this.objPlace.review.reviews.slice(0, 20 * this.page);
    },
    totalReviewScore() {
      return {
        totalRating: this.getReviewInfo('totalRating'),
        cleanRating: this.getReviewInfo('cleanRating'),
        convenienceRating: this.getReviewInfo('convenienceRating'),
        locationRating: this.getReviewInfo('locationRating'),
        serviceRating: this.getReviewInfo('serviceRating'),
      };
    },
  },
  methods: {
    decodeHtml(html) {
      try {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        const div = document.createElement('div');
        div.innerHTML = txt.value;
        const newDiv = document.createElement('div');
        newDiv.className = 'reviewImages';
        const arrImg = [...div.getElementsByTagName('img')];
        if (arrImg.length > 0) {
          arrImg.forEach((v) => {
            newDiv.appendChild(v);
          });
          [...div.getElementsByTagName('br')].forEach((v) => {
            div.removeChild(v);
          });
          div.appendChild(newDiv);
        }
        return div.innerHTML;
      } catch (e) {
        return html;
      }
    },
    getReviewInfo(flag) {
      return (this.objPlace.review.reviews.reduce((total, x) => total + x[flag], 0) / this.objPlace.review.reviews.length).toFixed(1);
    },
    scroll() {
      if (document.documentElement.scrollTop + window.innerHeight >= window.document.body.clientHeight
        && this.objPlace.review.reviews.length > this.page * 20
      ) {
        this.page += 1;
      }
    },
  },
  mounted() {
    if (this.type === 'main') {
      window.addEventListener('scroll', this.scroll);
    }
  },
  beforeDestroy() {
    if (this.type === 'main') {
      window.removeEventListener('scroll', this.scroll);
    }
  },
};
</script>

<style lang="scss">
.reviewContent{
  > .title{
    padding: 10px 0;
    font-size: 13px;
    color: #000;
    line-height: 20px;
    font-weight: bold;
  }
  &.main > .title{
    padding-bottom: 20px;
    font-size: 23px;
    line-height: 30px;
  }
  .summary{
    > div{
      padding: 8px 0;
      > div:first-of-type{
        width: 22px;
        height: 22px;
        background: url(~assets/img/star.svg) center center no-repeat;
        background-size: 22px;
        float: left;
        margin-right: 4px;
      }
      > div:nth-of-type(2){
        font-size: 16px;
        font-weight: bold;
        line-height: 22px;
        float: left;
        margin-right: 4px;
      }
      > div:nth-of-type(3){
        font-size: 16px;
        color: #939499;
        line-height: 22px;
        float: left;
      }
      &:after{
        content: '';
        display: block;
        clear: both;
      }
    }
    > ul{
      > li{
        padding: 11px 0 10px;
        > div{
          float: left;
          width: 50%;
          font-size: 14px;
          line-height: 17px;
          height: 17px;
          &:nth-of-type(1){
            padding-right: 12px;
            > span{
              font-weight: bold;
              float: right;
            }
          }
          &:nth-of-type(2){
            background-color: #ebecf1;
            height: 5px;
            border-radius: 3px;
            margin-top: 6px;
            > div{
              height: 5px;
              background-color: #000;
              border-radius: 3px;
            }
          }
        }
        &:after{
          content: '';
          display: block;
          clear: both;
        }
      }
    }
  }
  &.main .reviews{
    padding-bottom: 80px;
  }
  .reviews{
    border-top: 1px solid #ebecf1;
    margin-top: 20px;
    > li{
      border-top: 1px solid #ebecf1;
      padding: 16px 0;
      &:first-of-type{
        border: none;
      }
      .topInfo{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        .right{
          text-align: right;
          .name{
            font-size: 16px;
            line-height: 22px;
            color: #000;
          }
          .date{
            font-size: 11px;
            line-height: 18px;
            color: #939499;
          }
        }
        .left{
          .rating{
            height: 40px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            position: relative;
            .val{
              line-height: 22px;
              font-weight: bold;
              color: #000;
              font-size: 16px;
            }
            &:before{
              content: '';
              display: block;
              width: 22px;
              height: 22px;
              background-image: url(~assets/img/star.svg);
              background-position: center;
              background-repeat: no-repeat;
              background-size: 18px;
              margin-right: 2px;
            }
          }
        }
      }
      .contents {
        margin-top: 10px;
        font-size: 16px;
        line-height: 22px;
        word-break: break-word;
        > img{
          width: 200px;
          height: 122px;
          display: block;
          border-radius: 4px;
          &:first-of-type{
            margin-top: 10px;
          };
        }
        .reviewImages{
          width: 100%;
          font-size: 0;
          overflow-x: auto;
          white-space: nowrap;
          margin-top: 20px;
          > img{
            border-radius: 4px;
            display: inline-block;
            width: 200px;
            height: 122px;
            margin-right: 10px;
            &:last-of-type{
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}
</style>

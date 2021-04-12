<template>
  <div class="recentSearchWrapper">
    <div class="recentSearch" v-if="arrRecentSearch && arrRecentSearch.length > 0">
      <div class="topInfo">
        <span class="title">최근 검색</span>
        <span class="removeAll" @click="$emit('removeAll')">전체 삭제</span>
      </div>
      <ul>
        <li
          v-for="(x, index) in arrRecentSearch"
          :key="index"
          @click="$emit('submit', index)"
        >
          <div class="contents">
            <div class="info">
              <div class="keyword">{{ x.keyword }}</div>
              <div v-if="x.city" class="region">{{ x.city }}</div>
            </div>
            <div class="right">
              <div v-if="x.date" class="date">{{ $format.formatDate(x.date, 'zerodot') }}</div>
              <div
                class="xBtn"
                @click.stop="$emit('removeRecentItem', index)"
              ></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arrRecentSearch: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss">
  .recentSearchWrapper{
    width: 100%;
    padding: 40px ($sidePadding * 1px) 0;
    .recentSearch{
      .topInfo{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        .title{
          font-size: 13px;
          font-weight: bold;
          color: #000000;
        }
        .removeAll{
          cursor: pointer;
          font-size: 13px;
          color: #939499;
        }
      }
      ul{
        padding-top: 16px;
        > li{
          height: 64px;
          position: relative;
          cursor: pointer;
          border-bottom: 1px solid #ebecf1;
          &:before{
            content: '';
            position: absolute;
            left: 0;
            top: 22px;
            width: 16px;
            height: 16px;
            background: url(~assets/img/icon-history.svg) center center no-repeat;
            background-size: 16px;
          }
          .contents{
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            padding: 12px 0 12px 26px;
            height: 64px;
            .info{
              overflow: hidden;
              padding-right: 10px;
              .keyword {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                line-height: 22px;
                font-size: 16px;
                color: #000;
              }
              .region {
                line-height: 18px;
                font-size: 11px;
                color: #939499;
              }
            }
            .right{
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              .date{
                font-size: 13px;
                color: #939499;
              }
              .xBtn{
                width: 14px;
                height: 14px;
                background: url(~assets/img/delete.svg) center center no-repeat;
                background-size: 14px;
                margin-left: 8px;
              }
            }
          }
        }
      }
    }
  }
</style>

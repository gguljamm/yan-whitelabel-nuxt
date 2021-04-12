<template>
  <div class="autocompleteWrapper">
    <div class="spinnerLoading" v-if="objAutoComplete.status === 'loading'"><div></div></div>
    <ul class="autoList" v-else-if="arrAutoComplete.length > 0" :class="type">
      <li
        v-for="objItem in arrAutoComplete"
        :key="objItem.idx"
        @click="$emit('submit', objAutoComplete.list[objItem.idx])"
        :class="{
          product: objItem.type === 'PLACE_NAME' || objItem.type === 'DEAL_NAME',
          location: objItem.type === 'LOCATION_NAME' || objItem.type === 'STATION_NAME',
        }"
      >
        <div class="info">
          <div><strong v-if="objItem.city">{{ objItem.city }}</strong>{{ objItem.name }}</div>
          <div v-if="objItem.type && textMap[objItem.type]">{{ textMap[objItem.type] }}</div>
        </div>
      </li>
    </ul>
    <div v-else class="noResult">
      <div>검색 결과가 없습니다.</div>
      <div>다른 검색어로 시도해주세요.</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'place',
    },
    objAutoComplete: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      textMap: {
        PLACE_NAME: '숙소명',
        LOCATION_NAME: '지역명',
        DEAL_NAME: '레저명',
        STATION_NAME: '기차역명',
      },
    };
  },
  computed: {
    arrAutoComplete() {
      const mergeKey = ['name', 'type', 'city'];
      const arrKey = this.type === 'place' ? ['text', 'placeType', 'city'] : ['name', 'type'];
      return this.objAutoComplete.list.map((objItem, idx) => ({
        idx,
        ...arrKey.reduce((acc, key, index) => ({
          ...acc, [mergeKey[index]]: objItem[key],
        }), {}),
      }));
    },
  },
};
</script>

<style lang="scss">
  .autocompleteWrapper{
    padding: 0 $sidePadding * 1px;
    .autoList{
      > li{
        &::before{
          content: '';
          display: block;
          width: 18px;
          height: 18px;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          margin-top: 3px;
        }
      }
      &.place{
        > li{
          &.location{
            &::before{
              background-image: url(~assets/img/icon-area-black.svg);
            }
          }
          &.product{
            &::before {
              background-image: url(~assets/img/icon-acco.svg);
            }
          }
        }
      }
      &.leisure{
        > li{
          &.location{
            &::before{
              background-image: url(~assets/img/icon-area-black.svg);
            }
          }
          &.product{
            &::before {
              background-image: url(~assets/img/icon-ticket-black.svg);
            }
          }
        }
      }
      > li{
        padding: 12px 0;
        cursor: pointer;
        border-bottom: 1px solid #ebecf1;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        .info{
          margin-left: 10px;
          > div:nth-of-type(1){
            font-size: 15px;
            line-height: 22px;
            > strong{
              margin-right: 4px;
            }
          }
          > div:nth-of-type(2){
            font-size: 13px;
            line-height: 18px;
            color: #939499;
          }
        }
      }
    }
    .noResult{
      padding-top: 30px;
      text-align: center;
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
    .spinnerLoading{
      padding-top: 40px;
      > div{
        margin: 0 auto;
        width: 24px;
        background: url(~assets/img/loading.svg) center center no-repeat;
        background-size: 24px;
        height: 24px;
        animation: rotate 2s linear infinite;
      }
    }
  }
</style>

<template>
  <div class="leisureSearchWrapper">
    <div class="searchWrapper fixWidth">
      <Header :arrClass="['search']"></Header>
      <SearchInput
        v-if="tab === 'search'"
        :placeholder="'지역, 레저 이름으로 검색하세요.'"
        :type="'leisure'"
        @enter="submitEnter"
        @receiveData="receiveInputStr"
      ></SearchInput>
      <List
        v-if="objAutoComplete.status !== 'init'"
        :type="'leisure'"
        :objAutoComplete="objAutoComplete"
        @submit="submitAutoComplete"
      ></List>
      <template v-else>
        <Popular
          v-if="!arrPopularLoading"
          :arrPopularKeyWord="arrPopularKeyWord"
          @submitKeyword="submitKeyword"
        ></Popular>
        <Recent
          :arrRecentSearch="arrRecentSearch"
          @submit="submitRecent"
          @removeAll="removeAllRecentSearchHistory"
          @removeRecentItem="removeRecentItem"
        ></Recent>
        <RecentGoods
          v-if="arrRecentGoods && arrRecentGoods.length > 0"
          :title="'최근 본 레저'"
          :arrRecent="arrRecentGoods"
          @submit="submitRecentGoods"
          @removeAll="removeAllRecentGoods"
        ></RecentGoods>
      </template>
    </div>
  </div>
</template>

<script>
import SearchInput from '@/components/MVP/Search/Input.vue';
import List from '@/components/MVP/Search/AutoCompleteList.vue';
import Recent from '~/components/MVP/Search/RecentSearch.vue';
import Popular from '~/components/MVP/Search/Popular.vue';
import RecentGoods from '~/components/MVP/Search/RecentGoods.vue';
import viewModel from './Main.js';

export default {
  components: {
    SearchInput,
    List,
    Popular,
    Recent,
    RecentGoods,
  },
  mixins: [viewModel],
};
</script>

<style lang="scss">
.leisureSearchWrapper{
  width: 100%;
  .gnbWrapper > div{
    background-color: #FFF;
  }
  .tabWrapper{
    z-index: 1;
    position: fixed;
    bottom: 20px;
    height: 42px;
    left: 50%;
    transform: translateX(-50%);
    > button{
      font-size: 13px;
      padding: 0 16px 0 36px;
      height: 42px;
      border-radius: 22px;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
      background-color: #000000;
      color: #FFF;
      position: relative;
      &:before{
        content: '';
        width: 20px;
        height: 20px;
        position: absolute;
        top: 11px;
        left: 14px;
      }
      &:first-of-type:before{
        background: url(~assets/img/icon-list-white.svg) center center no-repeat;
        background-size: 20px;
      }
      &:nth-of-type(2):before{
        background: url(~assets/img/icon-search-white.svg) center center no-repeat;
        background-size: 20px;
      }
    }
  }
  .searchWrapper{
    background-color: #fff;
    min-height: 100vh;
    padding-bottom: 80px;
  }
}
</style>

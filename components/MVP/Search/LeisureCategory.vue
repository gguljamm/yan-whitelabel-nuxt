<template>
  <div class="LeisureCategoryWrapper">
    <div class="topInfo">
      <div class="regionName">
        <div class="fixWidth">
          <p>지역을 선택하세요</p>
          <TabMenu
            :arrMenu="arrRegion.map((item) => item.name)"
            :selectedTabIndex="selectedRegionIndex"
            @setSelectedTab="setSelectedTab"
          ></TabMenu>
        </div>
      </div>
    </div>
    <div class="category">
      <div class="fixWidth">
        <div class="categoryItemWrapper">
          <div
            v-for="(obj, categoryIndex) in arrCategory"
            :key="categoryIndex"
            class="categoryItem"
            :class="selectedCategoryId === obj.id ? 'active' : ''"
            @click="setCategory(obj.id)"
          >
            <div class="categoryName">
              <div class="value">
                <strong>{{ obj.name }}</strong>
              </div>
            </div>
            <div class="categoryList">
              <div class="list" @click="submit(obj.id)">
                <div class="value">전체</div>
              </div>
              <div
                v-for="(objList, listIndex) in obj.children"
                :key="listIndex"
                class="list"
                @click="submit(objList.id)"
              >
                <div class="value">{{ objList.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TabMenu from '@/components/MVP/Common/TabMenu.vue';

export default {
  components: {
    TabMenu,
  },
  props: {
    arrRegion: {
      type: Array,
      default: () => [],
    },
    arrCategory: {
      type: Array,
      default: () => [],
    },
    strSelectedCategory: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    const { area } = this.$route.query;
    const areaIndexOf = this.arrRegion.map((obj) => obj.id).indexOf(area * 1);
    const selectedRegionIndex = area && areaIndexOf !== -1 ? areaIndexOf : 0;
    return {
      selectedRegionIndex,
      selectedCategoryId: this.strSelectedCategory,
    };
  },
  methods: {
    setCategory(categoryKey) {
      this.selectedCategoryId = categoryKey;
    },
    setSelectedTab(index) {
      this.selectedRegionIndex = index;
      // api 되면 ㄱㄱ
      // this.$emit('getCategory', this.arrRegion[index]);
    },
    submit(categoryId) {
      const objParams = {
        area: this.arrRegion[this.selectedRegionIndex].id,
        category: categoryId,
      };
      this.$emit('submit', objParams);
    },
  },
};
</script>

<style lang="scss">
.noHeader .LeisureCategoryWrapper .topInfo .regionName{
  top: 0;
}
  .LeisureCategoryWrapper{
    .topInfo{
      width: 100%;
      background-color: #FFF;
      z-index: 5;
      height: 102px;
      .regionName {
        width: 100%;
        height: 102px;
        top: $header * 1px;
        left: 0;
        z-index: 1;
        position: fixed;
        background-color: #FFF;

        p {
          color: #000;
          padding: 16px ($sidePadding * 1px) 20px;
          font-size: 16px;
          font-weight: bold;
          line-height: 22px;
        }
      }
    }
    .category{
      width: 100%;
      .categoryItemWrapper{
        color: #000;
        width: 100%;
        font-size: 13px;
        .categoryItem{
          width: 100%;
          .categoryName{
            height: 50px;
            line-height: 50px;
            cursor: pointer;
            padding-left: $sidePadding * 1px;
            position: relative;
            &::after{
              content: '';
              display: block;
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              width: 40px;
              background-size: 22px;
              background-image: url(~assets/img/icon-chevron-down.svg);
              background-position: center;
              background-repeat: no-repeat;
            }
          }
          .categoryList{
            transition: .3s ease;
            line-height: 50px;
            height: 0;
            overflow: hidden;
            .list{
              padding-left: $sidePadding * 1px;
              cursor: pointer;
            }
          }
          &.active {
            .categoryName{
              &::after{
                transform: rotate(180deg);
              }
            }
            .categoryList {
              height: auto;
              overflow: auto;
            }
          }
        }
        .value{
          border-bottom: 1px solid #ebecf1;
        }
      }
    }
  }
</style>

<template>
  <div class="categoryPop">
    <Header
      :arrClass="['popup', 'home']"
    ></Header>
    <SpinnerLoading
      v-if="loadingStatus !== 'loaded'"
    ></SpinnerLoading>
    <div v-else class="allCategoryWrapper fixWidth">
      <div v-if="arrCategory.length > 0" class="categoryItemWrapper">
        <div class="pageTitle">카테고리를 선택하세요</div>
        <div
          class="categoryItem"
          @click="submit(undefined)"
        >
          <div class="categoryNameWrap">
            <div class="categoryName all">
              <div class="nameWrap">
                <div class="icon icon-ticket"></div>
                <div class="titleWrap">
                  <div class="categoryTitle">
                    <strong>전체</strong>
                  </div>
                  <div class="subCategoryTitle">
                    <span>카테고리 전체</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-for="(obj, categoryIndex) in arrCategory.filter(v => arrExceptCategory.indexOf(v.id) < 0)"
          :key="categoryIndex"
          class="categoryItem"
          :class="selectedCategoryKey * 1 === obj.id || obj.children.some((objChild) => objChild.id === selectedCategoryKey * 1) ? 'active' : ''"
          @click="setCategory(obj.id)"
        >
          <div class="categoryNameWrap">
            <div class="categoryName">
              <div class="nameWrap">
                <div class="icon" :class="`leisure-icon-${obj.id}`"></div>
                <div class="titleWrap">
                  <div class="categoryTitle">
                    <strong>{{ obj.name }}</strong>
                  </div>
                  <div class="subCategoryTitle">
                    <span
                      v-for="(childName, childNameIndex) in obj.children.map((child) => child.name).slice(0, 3)"
                      :key="childNameIndex"
                    >{{ childName }}</span>{{ obj.children.length > 3 ? '...' : '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="categoryList">
            <div class="list" @click="submit(obj.id)">
              <div class="value">전체</div>
            </div>
            <div
              v-for="(objList, listIndex) in obj.children.filter(v => arrExceptSubCategory.indexOf(v.id) < 0)"
              :key="listIndex"
              class="list"
              @click="submit(objList.id)"
            >
              <div class="value">{{ objList.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="noResult fixWidth">
        <div>결과를 불러오는데 실패하였습니다.</div>
        <div>잠시 후에 다시 시도 해주세요</div>
      </div>
    </div>
  </div>
</template>

<script>
import SpinnerLoading from '~/components/MVP/Common/SpinnerLoading.vue';
import objScss from '~/assets/css/variable.scss';

export default {
  components: {
    SpinnerLoading,
  },
  props: {
    category: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedCategoryKey: this.$route.query.category || '',
      arrCategory: this.category && this.category.length > 0 ? [...this.category] : [...this.$store.state.leisure.objSearchOption.category],
      loadingStatus: 'init',
      headerHeight: this.$store.state.channelInfo.header ? objScss.header * 1 : 0,
      arrExceptSubCategory: [],
      arrExceptCategory: [2266, 2315, 2270],
    };
  },
  methods: {
    setCategory(categoryId) {
      this.selectedCategoryKey = this.selectedCategoryKey === categoryId ? '' : categoryId;
    },
    submit(categoryId) {
      const objParams = {
        category: categoryId,
      };
      this.$emit('submit', objParams);
    },
  },
  mounted() {
    if (this.arrCategory.length <= 0) {
      this.loadingStatus = 'loading';
      this.$apis.getLeisureCategory().then((resp) => {
        this.arrCategory = [...resp.data.category.result.categories];
        this.$store.commit('leisure/setSearchOption', {
          category: [...resp.data.category.result.categories],
          region: [],
        });
        this.loadingStatus = 'loaded';
      }).catch(() => {
        this.loadingStatus = 'loaded';
      });
    } else {
      this.loadingStatus = 'loaded';
    }
    if (this.selectedCategoryKey) {
      let intervalCount = 0;
      const activeInterVal = setInterval(() => {
        if (
          (
            this.loadingStatus === 'loaded'
            && this.arrCategory.length > 0
            && this.arrCategory.map((obj) => this.selectedCategoryKey * 1 === obj.id || obj.children.some((objChild) => objChild.id === this.selectedCategoryKey * 1))
          )
          || intervalCount >= 100
        ) {
          const arrSelectedActiveEle = document.querySelectorAll('.categoryItem.active')[0];
          if ((activeInterVal && arrSelectedActiveEle) || intervalCount >= 100) {
            if (arrSelectedActiveEle) {
              const targetEleOffsetTop = arrSelectedActiveEle.offsetTop - this.headerHeight;
              if (targetEleOffsetTop) {
                window.scrollTo({
                  top: targetEleOffsetTop,
                  behavior: 'smooth',
                });
              }
            }
            clearInterval(activeInterVal);
          }
        }
        intervalCount += 1;
      }, 300);
    }
  },
};
</script>

<style lang="scss" scoped>
.categoryPop{
  background-color: #f2f2f2;
  .allCategoryWrapper{
    min-height: calc(100vh - #{$header * 1px});
    background-color: #fff;
    padding-bottom: 48px;
    .pageTitle{
      font-size: 16px;
      line-height: 22px;
      font-weight: bold;
      color: #000;
      padding: 18px $sidePadding * 1px;
    }
    .categoryItemWrapper{
      color: #000;
      width: 100%;
      font-size: 13px;
      .categoryItem{
        width: 100%;
        .categoryNameWrap{
          padding: 0 $sidePadding * 1px;
          cursor: pointer;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          width: 100%;
          .categoryName{
            width: 100%;
            padding: 12px 0;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            border-bottom: 1px solid #ebecf1;
            .nameWrap{
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              width: calc(100% - 16px);
              .icon{
                width: 18px;
                height: 18px;
                background-size: 18px;
                flex-shrink: 0;
              }
              .titleWrap{
                margin-left: 8px;
                .categoryTitle{
                  font-size: 16px;
                  line-height: 22px;
                }
                .subCategoryTitle{
                  color: #939499;
                  font-size: 11px;
                  line-height: 18px;
                  span{
                    &::after{
                      content: ', ';
                    }
                    &:last-of-type{
                      &::after{
                        content: '';
                      }
                    }
                  }
                }
              }
            }
            &.all{
              &::after{
                display: none;
              }
            }
            &::after {
              content: '';
              display: block;
              width: 16px;
              height: 16px;
              background-size: 16px;
              background-image: url(~assets/img/icon-chevron-down.svg);
              background-position: center;
              background-repeat: no-repeat;
            }
          }
        }
        .categoryList{
          transition: .3s ease;
          line-height: 50px;
          height: 0;
          overflow: hidden;
          background-color: #f8f9fb;
          .list{
            color: #000;
            font-size: 16px;
            padding: 0 $sidePadding * 1px;
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
}
</style>

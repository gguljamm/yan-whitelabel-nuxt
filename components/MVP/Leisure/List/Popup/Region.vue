<template>
  <div class="regionPop">
    <Header
      :arrClass="['popup', 'home']"
    ></Header>
    <SpinnerLoading v-if="loadingStatus !== 'loaded'"></SpinnerLoading>
    <div v-else class="allRegionWrapper fixWidth">
      <div v-if="arrRegion.length > 0" class="areaItemWrapper">
        <div class="pageTitle">지역을 선택하세요</div>
        <div
          class="areaItem"
          @click="submit(undefined)"
        >
          <div class="areaNameWrap">
            <div class="areaName all">
              <div class="nameWrap">
                <div class="icon icon-location"></div>
                <div class="titleWrap">
                  <div class="areaTitle">
                    <strong>전체 지역</strong>
                  </div>
                  <div class="subAreaTitle">
                    <span>지역 전체</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-for="(obj, regionIndex) in arrRegion"
          :key="regionIndex"
          class="areaItem"
          :class="selectedAreaKey * 1 === obj.id || obj.children.some((objChild) => objChild.id === selectedAreaKey * 1) ? 'active' : ''"
          @click="setAreaId(obj.id)"
        >
          <div class="areaNameWrap">
            <div class="areaName">
              <div class="nameWrap">
                <div class="icon icon-location"></div>
                <div class="titleWrap">
                  <div class="areaTitle">
                    <strong>{{ obj.name }}</strong>
                  </div>
                  <div class="subAreaTitle">
                    <span
                      v-for="(childName, childNameIndex) in obj.children.map((child) => child.name).slice(0, 3)"
                      :key="childNameIndex"
                    >{{ childName }}</span>{{ obj.children.length > 3 ? '...' : '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="areaList">
            <div class="list" @click="submit(obj.id)">
              <div class="value">전체</div>
            </div>
            <div
              v-for="(objList, listIndex) in obj.children.slice(1, obj.children.length)"
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
        <div>잠시 후에 다시 시도 해주세요.</div>
      </div>
    </div>
  </div>
</template>

<script>
import SpinnerLoading from '@/components/MVP/Common/SpinnerLoading.vue';
import objScss from '~/assets/css/variable.scss';

export default {
  components: {
    SpinnerLoading,
  },
  props: {
    region: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedAreaKey: this.$route.query.area || '',
      arrRegion: JSON.parse(JSON.stringify([...this.region])),
      loadingStatus: 'init',
      headerHeight: this.$store.state.channelInfo.header ? objScss.header * 1 : 0,
    };
  },
  methods: {
    submit(regionId) {
      const objParams = {
        area: regionId,
      };
      this.$emit('submit', objParams);
    },
    setAreaId(areaId) {
      this.selectedAreaKey = this.selectedAreaKey === areaId ? '' : areaId;
    },
  },
  mounted() {
    if (this.arrRegion.length <= 0) {
      this.loadingStatus = 'loading';
      this.$apis.getLeisureRegion().then((resp) => {
        this.arrRegion = [...resp.data.region.result.categories];
        this.$store.commit('leisure/setSearchOption', {
          category: [],
          region: [...resp.data.region.result.categories],
        });
        this.loadingStatus = 'loaded';
      }).catch(() => {
        this.loadingStatus = 'loaded';
      });
    } else {
      this.loadingStatus = 'loaded';
    }
    if (this.selectedAreaKey) {
      let intervalCount = 0;
      const activeInterVal = setInterval(() => {
        if (
          (
            this.loadingStatus === 'loaded'
            && this.arrRegion.length > 0
            && this.arrRegion.map((obj) => this.selectedAreaKey * 1 === obj.id || obj.children.some((objChild) => objChild.id === this.selectedAreaKey * 1))
          )
          || intervalCount >= 100
        ) {
          const arrSelectedActiveEle = document.querySelectorAll('.areaItem.active')[0];
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
.regionPop {
  background-color: #f2f2f2;

  .allRegionWrapper {
    min-height: calc(100vh - #{$header * 1px});
    background-color: #fff;
    padding-bottom: 48px;

    .pageTitle {
      font-size: 16px;
      line-height: 22px;
      font-weight: bold;
      color: #000;
      padding: 18px $sidePadding * 1px;
    }
    .areaItemWrapper{
      .areaItem{
        width: 100%;
        .areaNameWrap{
          padding: 0 $sidePadding * 1px;
          cursor: pointer;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          width: 100%;
          .areaName{
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
                .areaTitle{
                  font-size: 16px;
                  line-height: 22px;
                }
                .subAreaTitle{
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
        .areaList{
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
          .areaName{
            &::after{
              transform: rotate(180deg);
            }
          }
          .areaList {
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

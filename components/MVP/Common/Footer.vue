<template>
  <div class="footerWrap">
    <div class="fixWidth">
      <img src="" alt="로고">
      <div>
        푸터 | 푸터 | 푸터
      </div>
      <div>
        <a href="#">사업자 정보확인</a>
        <a href="#"><strong>개인정보처리방침</strong></a>
      </div>
      <div>footer</div>
    </div>
  </div>
</template>

<style lang="scss">
.footerWrap{
  background-color: #f8f9fb;
  padding: 20px 0;
  font-size: 12px;
  line-height: 18px;
  > div{
    padding: 0 $sidePadding * 1px;
    > img{
      height: 23px;
      margin-bottom: 10px;
    }
    > div{
      font-size: 10px;
      line-height: 14px;
      color: #939499;
      margin-bottom: 10px;
      > a{
        float: right;
        padding: 4px 8px;
        border: 1px solid #ebecf1;
        margin-right: 4px;
        &:first-child{
          margin-right: 0;
        }
        &:hover{
          border-color: #000;
        }
      }
      &:after{
        clear: both;
        display: block;
        content: '';
      }
    }
  }
}
</style>

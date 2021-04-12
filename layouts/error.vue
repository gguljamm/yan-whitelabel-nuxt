<template>
  <div class="error">
    <div class="iconWrap">
      <svg xmlns="http://www.w3.org/2000/svg" width="79" height="79" viewBox="0 0 79 79" class="icon">
        <g fill="none" fill-rule="evenodd">
          <g>
            <g transform="translate(-148 -114) translate(139 105)">
              <path d="M0 0H97V97H0z"/>
              <circle cx="34.5" cy="40.5" r="4.5" fill="#000" fill-rule="nonzero"/>
              <circle cx="62.5" cy="40.5" r="4.5" fill="#000" fill-rule="nonzero"/>
              <path fill="#000" fill-rule="nonzero" d="M48.5 9C70.315 9 88 26.685 88 48.5S70.315 88 48.5 88 9 70.315 9 48.5 26.685 9 48.5 9zm0 6.077c-18.46 0-33.423 14.964-33.423 33.423 0 18.46 14.964 33.423 33.423 33.423 18.46 0 33.423-14.964 33.423-33.423 0-18.46-14.964-33.423-33.423-33.423zm0 39.504c7.598 0 14.62 4.051 18.422 10.629.84 1.452.343 3.311-1.11 4.151-1.452.84-3.31.343-4.15-1.11-2.718-4.699-7.734-7.593-13.162-7.593-5.428 0-10.444 2.894-13.161 7.593-.84 1.453-2.699 1.95-4.151 1.11-1.453-.84-1.95-2.699-1.11-4.152 3.803-6.577 10.824-10.628 18.422-10.628z"/>
            </g>
          </g>
        </g>
      </svg>
      <div class="message">
        <div class="main" v-html="message"></div>
        <div class="sub">
          <div>잠시 후 다시 시도해 주세요.</div>
          <div class="cs">
            고객센터: 1644-1346 | <a href="http://plus.kakao.com/home/@야놀자고객센터" target="_blank">1:1 채팅상담</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    message() {
      const { statusCode } = this.error;
      let message = '';
      switch (statusCode) {
        case 404:
          message = '페이지를 찾을 수 없습니다.';
          break;
        case 500:
          message = '알 수 없는 오류가 발생하였습니다.';
          break;
        case 502:
          message = this.error.message;
          break;
        default:
          message = '페이지를 찾을 수 없습니다.';
          break;
      }
      return message;
    },

  },
};
</script>

<style>
.iconWrap .icon {
  display: block;
  margin: 114px auto 0;
}
.iconWrap .message {
  text-align: center;
}
.iconWrap .message .main {
  margin-top: 17px;
  font-size: 23px;
  line-height: 30px;
  font-weight: bold;
}
.iconWrap .message .sub {
  margin-top: 4px;
  font-size: 13px;
  line-height: 20px;
  color: #939499;
}
</style>

<template>
  <error v-if="error"
    :error="error"
  ></error>
  <div
    v-else
    :class="{
      noHeader: !$store.state.channelInfo.header,
      [$store.state.channelInfo.channelName]: true,
    }"
  >
    <client-only>
      <nuxt
        v-if="init"
      />
      <transition name="toast">
        <Notice v-if="$store.state.noticeInfo.list.length > 0"></Notice>
      </transition>
      <Alert v-if="$store.state.alertInfo"></Alert>
      <LayerPopup></LayerPopup>
    </client-only>
  </div>
</template>

<script>
import Notice from '~/components/MVP/Common/Notice.vue';
import Alert from '~/components/MVP/Common/Alert.vue';
import LayerPopup from '~/components/MVP/Common/LayerPopup.vue';
import Error from '@/layouts/error.vue';

const getJs = (channelName) => import(`~/components/${channelName}/initialize.js`).catch(() => {});

export default {
  components: {
    Error,
    Notice,
    Alert,
    LayerPopup,
  },
  data() {
    const channelName = this.$store.state.channelInfo.channelName.replace('dev_', '');
    return {
      init: false,
      error: false,
      initialize: () => getJs(channelName),
    };
  },
  async mounted() {
    const resp = await this.initialize();
    if (resp && resp.default) {
      await resp.default(this);
    }
    this.init = true;
    this.$cookies.set('bp-session', this.$store.state.sessionId, 0, '/');
    const UA = window.navigator.userAgent;
    const msie = UA.indexOf('MSIE ');
    this.$store.commit('setEnv', msie > 0 && parseInt(UA.substring(msie + 5, UA.indexOf('.', msie)), 10) <= 10);
  },
};
</script>

<style>
  html {
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
    color: #000;
  }
  a{
    color: #2e2e2e;
  }

  body{
    font-family: Apple SD Gothic Neo,Roboto,Arial Helvetica,sans-serif;
    background: #f8f9fb;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
  }
  .fixWidth{
    max-width: 768px;
    margin: 0 auto;
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    5%{
      transform: rotate(10deg);
    }
    20%{
      transform: rotate(80deg);
    }
    25%{
      transform: rotate(90deg);
    }
    30%{
      transform: rotate(100deg);
    }
    45%{
      transform: rotate(170deg);
    }
    50%{
      transform: rotate(180deg);
    }
    55%{
      transform: rotate(190deg);
    }
    70%{
      transform: rotate(260deg);
    }
    75%{
      transform: rotate(270deg);
    }
    80%{
      transform: rotate(280deg);
    }
    95%{
      transform: rotate(350deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .clear{
    display: block !important;
    clear: both !important;
    float: none !important;
  }
</style>

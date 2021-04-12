import axios from 'axios';
import axiosCancel from 'axios-cancel';

let store
if (process.browser) {
  window.onNuxtReady(({$store}) => {
    store = $store
  })
}

axiosCancel(axios);

const CancelToken = axios.CancelToken;

axios.interceptors.request.use((config) => {
  // Do something before request is sent
  if (store) {
    const info = store.getters.getChannelInfo;
    config.headers.channel = info ? info.channelName : 'bringprice';
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

/*
  숙소 자동완성 api
*/
function apiStatus() {
  return axios.post('/api');
}

/*
  숙소 자동완성 api
 */
function placeAutocomplete(params) {
  return new Promise(resolve => {
    resolve({ data: {"code":200,"result":[{"placeId":"ChIJDQHK5ToSczURVY27PEpM_pc","text":"고군면","placeType":"LOCATION_NAME","city":"진도군","latitude":null,"longitude":null},{"placeId":"ChIJ08l99AQSczUR1rJwmsLJ7T4","text":"고군면소재지 교차로","placeType":"LOCATION_NAME","city":"진도군","latitude":null,"longitude":null}],"message":"","timestamp":"2021-04-12 16:14:18"} });
  });
}

/*
  숙소 리스트를 불러오는 api
*/
function getPlaceList(params) {
  return new Promise(resolve => {
    resolve({ data: {"code":200,"result":{"data":[{"no":1000091780,"name":"TEST YAN 전용 모텔 숙소","openPossibility":"AVAILABLE","category":"MOTEL","themes":[],"star":{"rating":0,"type":null,"date":null},"consecutiveNightPossibility":"AVAILABLE","location":"전라도 고군면 경로당에서 따뜻한 온돌","notices":[{"no":801926,"noticeType":"NOTICE","order":1,"title":"연동 여부를 테스트 합니다.","contents":"테스트진행 이용안내 1번 2번 3번 4번 5번 6번"},{"no":801927,"noticeType":"NOTICE","order":2,"title":"숙박 입실시간 조정 안내","contents":"1객실당2인기준 가격이며 추가인원발생시 예약전또는 입실전 미리문의주십시오\n보고없이 추가인원 적발시 환불없이 강제퇴실조치합니다"},{"no":801928,"noticeType":"NOTICE","order":3,"title":"회원규정","contents":"- 현장 체크인시 꼭 야놀자 회원 이라고 말씀해 주셔야 합니다.\n- 대실마감pm11:00 퇴실시간을 어길시 과태료가 부과되며 타고객께 피해가 있을시 불이익도 감수하셔야합니다"},{"no":801929,"noticeType":"NOTICE","order":4,"title":"규정 및 이용 안내","contents":"- 예약을 진행시 호텔의 공지사항을 잘 체크하시고, 체크인&체크아웃시간 등의 제반사항을 준수하여 주시기 바랍니다.\n- 동물,식물 출입불가\n- 객실사진은 대표적인 객실사진만을 야놀자에서 일부만 촬영하였으므로 실제객실과 다를수 있습니다.\n- 대실이용시 숙박변경불가\n- 미성년자 2인이상 이성혼숙은 보호자가 동반해도 불법이으로 호텔에서 신분증 요구시 고객은 요구에 반드시 응해야 합니다."},{"no":801930,"noticeType":"NOTICE","order":5,"title":"주차요금 별도 (15,000원) 개별연락 필요","contents":"만차시 주변 공영주차장을 이용해주십시오\n기타사항은 프런트로 문의 부탁드립니다"},{"no":801931,"noticeType":"NOTICE","order":6,"title":"환불규정 안내","contents":"입실 1일 전까지: 취소수수료 없음\n입실일 및 No-Show: 환불 불가\n예약 완료 후 15분 이내 고객센터를 통해 전액 취소가 가능합니다."},{"no":801932,"noticeType":"NOTICE","order":7,"title":"예약안내","contents":"전화예약도 가능하십니다~!!\n계좌번호\n농협 352-1535-7065-23 이영문"},{"no":801933,"noticeType":"NOTICE","order":8,"title":"야놀자 회원혜택","contents":"성수기 및 특정일, 공휴일(전일 포함)에는 요금 변동이 있을 수 있습니다.\n야놀자 회원혜택은 제휴점 내규에 따라 적용됩니다.\n프런트에서 야놀자 회원임을 알려주세요."},{"no":801934,"noticeType":"NOTICE","order":9,"title":"특별 숙박 1+1 이벤트!","contents":"현장에서 10.000원을 결제하시면 익일 13:00시 퇴실시간이 17:00시로 변경 된답니다!\n이 좋은 기회 놓치지 말고 꼭! 해야되는 부분인거 아시죠"},{"no":800364,"noticeType":"EVENT","order":10,"title":"이벤트 3\t","contents":"\t이벤트 3\nNAVER"},{"no":800365,"noticeType":"EVENT","order":11,"title":"2020-06-03 이벤트 테스트입니다.","contents":"이벤트가 여러개일 때"},{"no":800366,"noticeType":"EVENT","order":12,"title":"이벤트 테스트입니다.","contents":"이벤트는 noticeType 3으로 연동되어야 합니다."},{"no":800367,"noticeType":"EVENT","order":13,"title":"정상 이벤트","contents":"내용"},{"no":801923,"noticeType":"GREETING","order":14,"title":"한줄소개. noticeType TEST","contents":""},{"no":801924,"noticeType":"RESERVATION","order":15,"title":"예약 공지","contents":"(예약) 객실요금은 2인 입실 기준이며, 파티룸 등 특수객실의 경우, 직접 입실 인원 확인이 필요합니다.\n업체 사정에 의한 취소 발생 시 100% 환불 처리됩니다.(업체 방문 시 업체를 통한 즉시 환불 가능)\n업체 사정으로 객실 정보가 수시로 변경될 수 있습니다. 이로 인한 불이익은 당사가 책임지지 않습니다.\n미성년자의 입실 가능여부는 직접 업체에 확인 후 예약 진행하시기 바랍니다.\n미성년자 예약으로 인해 발생하는 입실 거부, 예약 취소 등의 불이익은 당사가 책임지지 않습니다.\n대실이용은 토요일 19이후 3시간 가능합니다.\n퇴실 시간 초과 시 추가 요금이 자동 부과될 수 있습니다.\n객실 호수 및 디자인은 제휴점 운영 상황에 따라 랜덤 배정됩니다.\n야간시간 지나친 소음 발생시 퇴실 조치가 가능하오니 삼가바랍니다.\n객실 물건 파손 및 도난 시 형사 처벌 받을 수 있습니다.\n토요일 및 공휴일 연박 예약 시, 현장에서 대실 요금 추가됩니다.\n자세한 사항은 프런트에 문의 부탁드립니다.\t"},{"no":801925,"noticeType":"CUSTOMER_BENEFITS","order":16,"title":"편의시설 및 테마","contents":"TEST| 베이커리 및 커피 무료제공주차공간이 협소하여, 차량방문 고객님은 숙소(02-512-2016)에 먼저문의, 주차요금 별도부과, 양해바랍니다\n기타사항은 프런트로 문의 부탁드립니다\n2층 C29 다이닝룸은 매주 일요일 휴무 입니다.\n쾌적한 투숙을 위해 HAVENUE 역삼점의 일부 객실은 금연객실로 운영되고 있습니다. 금연객실을 사용하고자 하는 고객님은 프런트에서 문의해주시기 바랍니다.\n2층 C29 다이닝룸에서 조식 쿠폰 지참 후 조식 이용 가능합니다.\n가족과 비즈니스에 안성맞춤, 트윈 객실을 이용해 보십시오.\t"}],"reserveEarly":"AVAILABLE","imageUrl":"/dummy.jpeg","thumbUrl":null,"introduction":"숙소소개. noticeType test . 파트너API 의 introduction","checkInTime":"00:00","checkOutTime":"10:00","directions":"강 건너 세번째 골목","geoPoint":{"lat":34.44370707067878,"lon":126.35237068183015},"minPrice":40000,"minDiscountPrice":10000,"discountRate":75,"review":null,"bpScore":1.3},{"no":3001421,"name":"호텔 테스트 HN 11","openPossibility":"AVAILABLE","category":"HOTEL","themes":[""],"star":{"rating":5,"type":"KTO","date":"2019-03-21"},"consecutiveNightPossibility":"AVAILABLE","location":"경로당 테스트12","notices":[{"no":799665,"noticeType":"RESERVATION","order":1,"title":"확인 사항","contents":"해당 호텔은 테스트 호텔로 일반 고객님이 결제하시면 결제 취소 됩니다: )"}],"reserveEarly":"AVAILABLE","imageUrl":"/dummy.jpeg","thumbUrl":null,"introduction":"\r\n· 본 업체는 가상의 테스트 숙소입니다. 예약하지 말아주세요!!\n\r\n","checkInTime":"15:00","checkOutTime":"11:00","directions":"테스트 테스트","geoPoint":{"lat":34.443035,"lon":126.352628},"minPrice":150000,"minDiscountPrice":100000,"discountRate":33,"review":null,"bpScore":1.3},{"no":1000091779,"name":"TEST YAN 전용 펜션 숙소","openPossibility":"AVAILABLE","category":"PENSION","themes":[],"star":{"rating":0,"type":null,"date":null},"consecutiveNightPossibility":"AVAILABLE","location":null,"notices":[{"no":801451,"noticeType":"NOTICE","order":1,"title":"공지사항","contents":"22시 이후 입실하실 경우 펜션으로 미리 연락 부탁드립니다.\n\n22시 이후 입실하실 경우 펜션으로 미리 연락 부탁드립니다.숙박 업소는 법적으로 청소년 혼숙이 금지되어 있습니다. 또한 해당 펜션은 동성인 경우에도 미성년자 입실이 절대 불가하며 해당 사유로 환불 받을 수 없습니다.\n\n테스트 업체입니다.test "},{"no":801450,"noticeType":"RESERVATION","order":2,"title":"예약공지사항","contents":"테스트 업체"},{"no":801449,"noticeType":"CUSTOMER_BENEFITS","order":3,"title":"예약혜택","contents":"공용거실\n\n펜션즐기기\n[커피무료제공]\n·휴식처개념의 카페에서 커피를 제공해드리고 있습니다.(커피머신)\n·카페이용시간 : 오후3시~ 오후10시\n\n\n[주변관광지]\n· 아침고요수목원\n· 허브아일랜드\n· 베어스타운\n· 아트밸리\n· 평강식물원"}],"reserveEarly":"AVAILABLE","imageUrl":"/dummy.jpeg","thumbUrl":null,"introduction":"※ ※※※ 포레스트풀빌라 펜션 공지사항\n* 한팀당 한 객실만 이용 가능합니다. (※2객실 이상 일행예약 불가) - 미성년자끼리의 입실은 절대 불가능합니다.- 예약자 이름이 다르고 각각 따로 예약을 하더라도 두객실 이상 일행예약은 절대 불가합니다.- 포레스트풀빌라펜션은 소가족을 위한 펜션입니다.- 공동 부대시설 이용시 인원수가 늘어나거나 여러팀 일행분들이 몰려다니면 부대시설 이용에 어려움이 생기고 다른 고객분들이 불편함을 느끼게 됩니다. ※포레스트풀빌라앤스파에는 수영장을 공동이 아닌 개별적으로 이용하실 수 있습니다.* 개별풀장 이용 가능 객실 : C-2, A-2, B-3, A-1, B-1, EpisodeE, 키즈풀빌라,G-1, G-2* 개별야외풀장 객실 : C-2, A-2, B-3, A-1, B-1, EpisodeE, 키즈풀빌라· 개별야외풀장 일정 : 2020년 6월 18일 오픈~· 개별야외풀장은 온수 제공이 불가합니다.* 실내수영장(G-1,G-2) 일정 : 사계절 이용 가능· G-1,G-2객실 실내풀장은 하절기(6~8월)에는 냉수로 제공되며, 6~8월 제외한 기간에는 온수 제공합니다. (온수제공하는데 30~60분 소요되오니 입실 전 미리 연락부탁드립니다.)· G-1,G-2객실 실내풀장 온수 제공은 오후 3~7시까지 무료 제공합니다. (이후 온수추가시 별도 5만원)· 이용시간 : 3시~8시 / 다음날 오전 11시· 개인 수영복은 가져오셔야 합니다.· 풀빌라는 튜브가 구비되어 있습니다.\n\n테스트 업체입니다.test","checkInTime":"11:00","checkOutTime":"00:00","directions":"","geoPoint":{"lat":34.44370609043022,"lon":126.35237369256697},"minPrice":40000,"minDiscountPrice":40000,"discountRate":0,"review":null,"bpScore":0.5},{"no":1000091782,"name":"TEST YAN 전용 호텔 숙소","openPossibility":"AVAILABLE","category":"HOTEL","themes":["condo"],"star":{"rating":5,"type":"KTO","date":"2021-02-01"},"consecutiveNightPossibility":"AVAILABLE","location":"가계리경로당 인근","notices":[{"no":803329,"noticeType":"RESERVATION","order":1,"title":"확인사항","contents":"호텔|확인사항|notices | 제목/설명 사용자가 입력. 호텔나우 엑스트라넷. \n 해당 호텔은 테스트 호텔로 일반 고객님이 결제하시면 결제 취소 됩니다 :) \n APP 노출 불가\n 테스트 중입니다."}],"reserveEarly":"AVAILABLE","imageUrl":"/dummy.jpeg","thumbUrl":null,"introduction":"\r\n· 호텔| 상세설명 | 제목은 사용자가 입력. 설명도 사용자가 입력. \n\r\n· 삭제시 경고 팝업 1회. \n\r\n· 본 업체는 가상의 테스트 숙소입니다. 예약하지 말아주세요!!\n\r\n","checkInTime":"22:00","checkOutTime":"08:00","directions":null,"geoPoint":{"lat":34.443708,"lon":126.352368},"minPrice":20000,"minDiscountPrice":20000,"discountRate":0,"review":null,"bpScore":0.5},{"no":3002411,"name":"실험실펜션","openPossibility":"AVAILABLE","category":"PENSION","themes":[],"star":{"rating":0,"type":null,"date":null},"consecutiveNightPossibility":"AVAILABLE","location":null,"notices":[{"no":787997,"noticeType":"NOTICE","order":1,"title":"공지사항","contents":"입퇴실 시간은 14:30분\n12:30 분입니다.\n---------\n초과시 비용청구 합니다."},{"no":787996,"noticeType":"RESERVATION","order":2,"title":"예약공지사항","contents":"예약 인원에서 인원이 추가되는 경우 펜션에 미리 연락을 주시기 바랍니다.\n\n\t기준인원 초과 시 추가 인원에 대한 비용이 별도로 발생할 수 있습니다.\n\n\t최대 인원 초과 시 입실이 불가능할 수 있으며, 해당 사유로 환불 받을 수 없습니다.\n\n\t반려동물 입실 가능 펜션 외에 반려동물 동반 시 입실이 거부될 수 있으며, 해당 사유로 환불 받을 수 없습니다.\n\n\t숙박 업소는 법적으로 청소년 혼숙이 금지되어 있습니다. 또한 미성년자의 예약 및 이용은 숙소 규정에 따라 결정되며 해당 사유로 환불 받을 수 없습니다.\n\n\t다음 이용 고객을 위해 입실, 퇴실 시간을 준수해 주시기 바랍니다.\n\n\t객실 및 주변시설 이용 시 시설물의 훼손, 분실에 대한 책임은 투숙객에게 있으며, 손해배상의 책임을 질 수 있습니다.\n\n\t객실의 안전과 화재예방을 위해 객실 내에서 생선이나 고기 등을 굽는 직화 방식은 허용되지 않으며, 개인적으로 준비해 오는 취사도구(그릴, 숯, 전기/전열기구 등)은 반입이 금지되어 있습니다.\n\n\t객실 내에서의 흡연은 금지되어 있으며, 지정된 장소를 이용해 주시기 바랍니다.\n\n\t다른 이용객에게 피해를 줄 수 있는 무분별한 오락, 음주, 고성방가는 삼가주시기 바랍니다.\n\n\t실시간예약 시 중복예약이 발생할 수 있으며, 해당 사유의 경우 고객센터를 통해 전액 환불받을 수 있습니다. (야놀자펜션 고객센터 측에서 확인 즉시 안내드립니다.)\n\n\t펜션별 기간 미확정으로 인해 요금 및 요금표가 잘못 반영된 경우, 자동 예약 취소 처리되며 정상 금액으로 재예약할 수 있습니다."},{"no":787995,"noticeType":"CUSTOMER_BENEFITS","order":3,"title":"예약혜택","contents":"스파/월풀\n\n개별바비큐\n\n복층\n\n독채객실\n\nIPTV/WiFi\n\n벽난로\n\n한옥\n\n수영장\n\n노래방\n\n빔프로젝트\n\n찜질방\n\n바비큐장\n\n캠프파이어\n\n카페\n\n매점/편의점\n\n체육시설\n\n레포츠\n\n조식서비스\n\n식사가능\n\n펜션즐기기\n[제목]\n· 테마로 설정, 관리할 수 없는 그 밖의 펜션 부대시설및 서비스 등의 세부 내용을 입력할 수 있습니다.1\n· 테마로 설정, 관리할 수 없는 그 밖의 펜션 부대시설및 서비스 등의 세부 내용을 입력할 수 있습니다.2\n· 테마로 설정, 관리할 수 없는 그 밖의 펜션 부대시설및 서비스 등의 세부 내용을 입력할 수 있습니다.3\n\n[제목]\n· 테마로 설정, 관리할 수 없는 그 밖의 펜션 부대시설및 서비스 등의 세부 내용을 입력할 수 있습니다.\n· 테마로 설정, 관리할 수 없는 그 밖의 펜션 부대시설및 서비스 등의 세부 내용을 입력할 수 있습니다."}],"reserveEarly":"AVAILABLE","imageUrl":"/dummy.jpeg","thumbUrl":null,"introduction":"실험실 펜션 입니다.~~~\n예약을 하지 마세요.!!\n\n실험실 펜션 입니다.~~\n\n예약을 하지 마세요.!!!\n\n\n(31-5)\n31-5","checkInTime":null,"checkOutTime":null,"directions":"","geoPoint":{"lat":34.44369536573887,"lon":126.35239118483626},"minPrice":0,"minDiscountPrice":0,"discountRate":0,"review":null,"bpScore":0.5}],"total":30},"message":"","timestamp":"2021-04-12 15:03:19"} })
  })
}

/*
  숙소 리스트를 좌표기반으로 불러오는 api
 */
function getPlaceListByLocation(params) {
  return axios.post('/api/place/point', params);
}

/*
  숙소 1개의 정보를 불러오는 api
 */
function getPlace(params) {
  return new Promise(resolve => {
    resolve({ data: {"code":200,"result":{"no":1000091780,"korName":"TEST YAN 전용 모텔 숙소","engName":"TEST Dhub Motel","address":"전라남도 진도군 고군면 가계길 3","openPossibility":"AVAILABLE","zipCode":"58911","category":"MOTEL","themes":[],"star":{"rating":0,"type":null,"date":null},"consecutiveNightPossibility":"AVAILABLE","location":"전라도 고군면 경로당에서 따뜻한 온돌","notices":[{"no":801926,"noticeType":"NOTICE","order":1,"title":"연동 여부를 테스트 합니다.","contents":"테스트진행 이용안내 1번 2번 3번 4번 5번 6번"},{"no":801927,"noticeType":"NOTICE","order":2,"title":"숙박 입실시간 조정 안내","contents":"1객실당2인기준 가격이며 추가인원발생시 예약전또는 입실전 미리문의주십시오\n보고없이 추가인원 적발시 환불없이 강제퇴실조치합니다"},{"no":801928,"noticeType":"NOTICE","order":3,"title":"회원규정","contents":"- 현장 체크인시 꼭 야놀자 회원 이라고 말씀해 주셔야 합니다.\n- 대실마감pm11:00 퇴실시간을 어길시 과태료가 부과되며 타고객께 피해가 있을시 불이익도 감수하셔야합니다"},{"no":801929,"noticeType":"NOTICE","order":4,"title":"규정 및 이용 안내","contents":"- 예약을 진행시 호텔의 공지사항을 잘 체크하시고, 체크인&체크아웃시간 등의 제반사항을 준수하여 주시기 바랍니다.\n- 동물,식물 출입불가\n- 객실사진은 대표적인 객실사진만을 야놀자에서 일부만 촬영하였으므로 실제객실과 다를수 있습니다.\n- 대실이용시 숙박변경불가\n- 미성년자 2인이상 이성혼숙은 보호자가 동반해도 불법이으로 호텔에서 신분증 요구시 고객은 요구에 반드시 응해야 합니다."},{"no":801930,"noticeType":"NOTICE","order":5,"title":"주차요금 별도 (15,000원) 개별연락 필요","contents":"만차시 주변 공영주차장을 이용해주십시오\n기타사항은 프런트로 문의 부탁드립니다"},{"no":801931,"noticeType":"NOTICE","order":6,"title":"환불규정 안내","contents":"입실 1일 전까지: 취소수수료 없음\n입실일 및 No-Show: 환불 불가\n예약 완료 후 15분 이내 고객센터를 통해 전액 취소가 가능합니다."},{"no":801932,"noticeType":"NOTICE","order":7,"title":"예약안내","contents":"전화예약도 가능하십니다~!!\n계좌번호\n농협 352-1535-7065-23 이영문"},{"no":801933,"noticeType":"NOTICE","order":8,"title":"야놀자 회원혜택","contents":"성수기 및 특정일, 공휴일(전일 포함)에는 요금 변동이 있을 수 있습니다.\n야놀자 회원혜택은 제휴점 내규에 따라 적용됩니다.\n프런트에서 야놀자 회원임을 알려주세요."},{"no":801934,"noticeType":"NOTICE","order":9,"title":"특별 숙박 1+1 이벤트!","contents":"현장에서 10.000원을 결제하시면 익일 13:00시 퇴실시간이 17:00시로 변경 된답니다!\n이 좋은 기회 놓치지 말고 꼭! 해야되는 부분인거 아시죠"},{"no":800364,"noticeType":"EVENT","order":10,"title":"이벤트 3\t","contents":"\t이벤트 3\nNAVER"},{"no":800365,"noticeType":"EVENT","order":11,"title":"2020-06-03 이벤트 테스트입니다.","contents":"이벤트가 여러개일 때"},{"no":800366,"noticeType":"EVENT","order":12,"title":"이벤트 테스트입니다.","contents":"이벤트는 noticeType 3으로 연동되어야 합니다."},{"no":800367,"noticeType":"EVENT","order":13,"title":"정상 이벤트","contents":"내용"},{"no":801923,"noticeType":"GREETING","order":14,"title":"한줄소개. noticeType TEST","contents":""},{"no":801924,"noticeType":"RESERVATION","order":15,"title":"예약 공지","contents":"(예약) 객실요금은 2인 입실 기준이며, 파티룸 등 특수객실의 경우, 직접 입실 인원 확인이 필요합니다.\n업체 사정에 의한 취소 발생 시 100% 환불 처리됩니다.(업체 방문 시 업체를 통한 즉시 환불 가능)\n업체 사정으로 객실 정보가 수시로 변경될 수 있습니다. 이로 인한 불이익은 당사가 책임지지 않습니다.\n미성년자의 입실 가능여부는 직접 업체에 확인 후 예약 진행하시기 바랍니다.\n미성년자 예약으로 인해 발생하는 입실 거부, 예약 취소 등의 불이익은 당사가 책임지지 않습니다.\n대실이용은 토요일 19이후 3시간 가능합니다.\n퇴실 시간 초과 시 추가 요금이 자동 부과될 수 있습니다.\n객실 호수 및 디자인은 제휴점 운영 상황에 따라 랜덤 배정됩니다.\n야간시간 지나친 소음 발생시 퇴실 조치가 가능하오니 삼가바랍니다.\n객실 물건 파손 및 도난 시 형사 처벌 받을 수 있습니다.\n토요일 및 공휴일 연박 예약 시, 현장에서 대실 요금 추가됩니다.\n자세한 사항은 프런트에 문의 부탁드립니다.\t"},{"no":801925,"noticeType":"CUSTOMER_BENEFITS","order":16,"title":"편의시설 및 테마","contents":"TEST| 베이커리 및 커피 무료제공주차공간이 협소하여, 차량방문 고객님은 숙소(02-512-2016)에 먼저문의, 주차요금 별도부과, 양해바랍니다\n기타사항은 프런트로 문의 부탁드립니다\n2층 C29 다이닝룸은 매주 일요일 휴무 입니다.\n쾌적한 투숙을 위해 HAVENUE 역삼점의 일부 객실은 금연객실로 운영되고 있습니다. 금연객실을 사용하고자 하는 고객님은 프런트에서 문의해주시기 바랍니다.\n2층 C29 다이닝룸에서 조식 쿠폰 지참 후 조식 이용 가능합니다.\n가족과 비즈니스에 안성맞춤, 트윈 객실을 이용해 보십시오.\t"}],"longitude":126.35237068183015,"latitude":34.44370707067878,"reserveEarly":"AVAILABLE","cancelPolicies":[{"seasonType":null,"cancelPenaltyPercent":0,"day":1,"hour":24},{"seasonType":null,"cancelPenaltyPercent":100,"day":0,"hour":24}],"cancelPolicyInfo":"- 입실 1일 전 24:00 전까지 : 취소수수료 없음</br>- 입실 1일 전 24:00시 이후, 당일 취소 및 No-Show, 입실시간 경과/실제 입실 후 : 환불불가","images":[{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"REPRESENTATION","categoryName":"대표 사진"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"EXTERIOR","categoryName":"숙소 외관"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"INTERIOR","categoryName":"숙소 내부"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"FACILITY","categoryName":"숙소 시설"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"AMENITY_AND_ETC","categoryName":"기타"}],"globalSalesAgree":"AVAILABLE","amenities":[{"no":94,"comment":"수영장"},{"no":100108,"comment":"야외수영장"},{"no":100,"comment":"사우나"},{"no":100112,"comment":"커피숍"},{"no":100138,"comment":"세미나실"},{"no":100106,"comment":"비즈니스"},{"no":900086,"comment":"픽업가능"},{"no":100012,"comment":"주차가능"},{"no":100107,"comment":"피트니스"},{"no":100139,"comment":"매점/편의점"},{"no":104,"comment":"와이파이"},{"no":100105,"comment":"어메니티"},{"no":100101,"comment":"객실내PC"},{"no":100116,"comment":"객실금연"},{"no":100123,"comment":"공용주방"},{"no":100075,"comment":"바다전망"},{"no":100102,"comment":"24시간데스크"},{"no":103,"comment":"3DTV"},{"no":100135,"comment":"개별바베큐"},{"no":92,"comment":"거울룸"},{"no":90,"comment":"게임"},{"no":100145,"comment":"계곡인접"},{"no":100124,"comment":"공용거실"},{"no":900516,"comment":"루프탑"},{"no":82,"comment":"공주룸"},{"no":100118,"comment":"공항셔틀"},{"no":100130,"comment":"글램핑"},{"no":100143,"comment":"기본양념"},{"no":99,"comment":"나이트룸"},{"no":95,"comment":"노래방"},{"no":100115,"comment":"노트북대여"},{"no":85,"comment":"노천탕"},{"no":100074,"comment":"다이닝룸"},{"no":91,"comment":"당구대"},{"no":100151,"comment":"대여"},{"no":900088,"comment":"도미토리"},{"no":100133,"comment":"독채객실"},{"no":100132,"comment":"독채펜션"},{"no":100121,"comment":"동물입실"},{"no":100109,"comment":"레스토랑"},{"no":89,"comment":"마사지베드"},{"no":100113,"comment":"무료세탁"},{"no":900515,"comment":"무료영화"},{"no":97,"comment":"무인텔"},{"no":101,"comment":"미니바"},{"no":100111,"comment":"바"},{"no":100120,"comment":"바베큐"},{"no":100134,"comment":"벽난로"},{"no":93,"comment":"복층구조"},{"no":100110,"comment":"부페"},{"no":100144,"comment":"상비약"},{"no":100082,"comment":"샐러드바"},{"no":100103,"comment":"수화물보관"},{"no":100076,"comment":"스낵바"},{"no":106,"comment":"스파/월풀"},{"no":100147,"comment":"식사가능"},{"no":100131,"comment":"안마의자"},{"no":105,"comment":"야외테라스"},{"no":100150,"comment":"여성전용"},{"no":100104,"comment":"연회장"},{"no":84,"comment":"욕실TV"},{"no":100125,"comment":"운동장"},{"no":100136,"comment":"워터슬라이드"},{"no":100114,"comment":"유료세탁"},{"no":100142,"comment":"이벤트가능"},{"no":100122,"comment":"자전거대여"},{"no":100085,"comment":"조식제공"},{"no":100137,"comment":"족구장"},{"no":100119,"comment":"주방"},{"no":96,"comment":"찜질방"},{"no":100152,"comment":"체험"},{"no":87,"comment":"촬영장소"},{"no":100083,"comment":"카페형룸"},{"no":900513,"comment":"커플룸"},{"no":81,"comment":"커플PC"},{"no":100153,"comment":"투어"},{"no":98,"comment":"트윈베드"},{"no":100149,"comment":"파티가능"},{"no":83,"comment":"파티룸"},{"no":900514,"comment":"프랜차이즈"},{"no":80,"comment":"프로젝터"},{"no":86,"comment":"프로포즈"},{"no":900087,"comment":"한옥"},{"no":100146,"comment":"해수욕장인근"},{"no":100117,"comment":"흡연구역"},{"no":88,"comment":"히노끼탕"},{"no":100148,"comment":"PC라운지"},{"no":79,"comment":"VOD"}],"rooms":[{"no":121569,"name":[{"language":"ko","name":"(TEST) DHUB 모텔 Kafka 테스트 객실"},{"language":"en","name":""}],"capacity":2,"maxCapacity":4,"isOpen":"AVAILABLE","description":"DHUB 팀에서 RatePlan Kafka 테스트용으로 생성한 객실입니다.","images":[],"globalSalesAgree":"NOT_AVAILABLE","breakfast":"NOT_AVAILABLE","smokingPreference":null,"bedGroups":null,"checkIn":"2021-04-21 22:00","checkOut":"2021-04-22 12:00","price":10000,"discountPrice":10000,"openRoomCount":5,"reserveRoomCount":0,"availableRoomCount":5,"status":1},{"no":121579,"name":[{"language":"ko","name":"(TEST) DHUB 모텔 테스트 객실 4"},{"language":"en","name":""}],"capacity":2,"maxCapacity":2,"isOpen":"AVAILABLE","description":"(TEST) DHUB 모텔 테스트 객실 4","images":[],"globalSalesAgree":"NOT_AVAILABLE","breakfast":"NOT_AVAILABLE","smokingPreference":null,"bedGroups":null,"checkIn":"2021-04-21 22:00","checkOut":"2021-04-22 12:00","price":40000,"discountPrice":40000,"openRoomCount":5,"reserveRoomCount":0,"availableRoomCount":5,"status":1},{"no":121576,"name":[{"language":"ko","name":"(test) Dhub 테스트 객실 05"},{"language":"en","name":""}],"capacity":2,"maxCapacity":2,"isOpen":"AVAILABLE","description":"설명 추가","images":[],"globalSalesAgree":"NOT_AVAILABLE","breakfast":"NOT_AVAILABLE","smokingPreference":null,"bedGroups":null,"checkIn":"2021-04-21 17:00","checkOut":"2021-04-23 00:00","price":40000,"discountPrice":10000,"openRoomCount":1,"reserveRoomCount":0,"availableRoomCount":1,"status":1},{"no":118101,"name":[{"language":"ko","name":"(TEST) Dhub 모텔 객실 02"},{"language":"en","name":"Room 02"}],"capacity":2,"maxCapacity":5,"isOpen":"AVAILABLE","description":"⭐배틀그라운드 게임 가능한 고사양 PC완비⭐\n테스트 객실입니다.\t","images":[{"originUrl":"https://yadev.yanolja.com/v5/2019/08/20/16/5d5b9ac95b4ed4.26973747.png","bpUrl":"https://wht-img.yanolja.com/place/5d5b9ac95b4ed4.26973747.png","thumbUrl":null,"categoryType":"ROOM_TYPE","categoryName":"객실 사진"}],"globalSalesAgree":"NOT_AVAILABLE","breakfast":"NOT_AVAILABLE","smokingPreference":null,"bedGroups":null,"checkIn":"2021-04-21 22:00","checkOut":"2021-04-22 12:00","price":10000,"discountPrice":8000,"openRoomCount":5,"reserveRoomCount":0,"availableRoomCount":5,"status":1},{"no":118102,"name":[{"language":"ko","name":"(TEST) Dhub 모텔 객실 03"},{"language":"en","name":"Room 03"},{"language":"zh-CN","name":"汽车旅馆客房03"}],"capacity":2,"maxCapacity":4,"isOpen":"AVAILABLE","description":"객실은 현장 상황에 따라 사진과 상이할 수 있습니다아.","images":[{"originUrl":"https://yadev.yanolja.com/v5/2020/06/19/18/5eec8a559da4a3.90071668.jpeg","bpUrl":"https://wht-img.yanolja.com/place/5eec8a559da4a3.90071668.jpeg","thumbUrl":null,"categoryType":"ROOM_TYPE","categoryName":"객실 사진"},{"originUrl":"https://yadev.yanolja.com/v5/2019/08/20/16/5d5b9ae0256c20.33597569.png","bpUrl":"https://wht-img.yanolja.com/place/5d5b9ae0256c20.33597569.png","thumbUrl":null,"categoryType":"ROOM_TYPE","categoryName":"객실 사진"}],"globalSalesAgree":"AVAILABLE","breakfast":"NOT_AVAILABLE","smokingPreference":null,"bedGroups":null,"checkIn":"2021-04-21 22:00","checkOut":"2021-04-22 12:00","price":15000,"discountPrice":10000,"openRoomCount":5,"reserveRoomCount":0,"availableRoomCount":5,"status":1},{"no":118100,"name":[{"language":"ko","name":"(TEST) Dhub 모텔 객실 01"},{"language":"en","name":"Room 01"},{"language":"zh-CN","name":"汽车旅馆客房01"}],"capacity":2,"maxCapacity":4,"isOpen":"AVAILABLE","description":"설명 변경 테스트합니다.","images":[{"originUrl":"https://yadev.yanolja.com/v5/2020/10/29/17/5f9a82e6b01f19.74904859.jpeg","bpUrl":"https://wht-img.yanolja.com/place/5f9a82e6b01f19.74904859.jpeg","thumbUrl":null,"categoryType":"ROOM_TYPE","categoryName":"객실 사진"},{"originUrl":"https://yadev.yanolja.com/v5/2020/11/02/18/5f9fd0ec5167d4.05788472.png","bpUrl":"https://wht-img.yanolja.com/place/5f9fd0ec5167d4.05788472.png","thumbUrl":null,"categoryType":"ROOM_TYPE","categoryName":"객실 사진"}],"globalSalesAgree":"AVAILABLE","breakfast":"AVAILABLE","smokingPreference":null,"bedGroups":null,"checkIn":"2021-04-22 00:00","checkOut":"2021-04-22 12:00","price":50000,"discountPrice":50000,"openRoomCount":5,"reserveRoomCount":0,"availableRoomCount":5,"status":1}],"introduction":"숙소소개. noticeType test . 파트너API 의 introduction","checkInTime":"00:00","checkOutTime":"10:00","direction":"강 건너 세번째 골목","phone":"050350595018"},"message":"","timestamp":"2021-04-12 15:11:33"} })
  });
}

function getPlaceReviews(params) {
  return new Promise(resolve => {
    resolve({ data: {"code":200,"result":{"placeNo":1000091780,"total":7,"reviews":[{"reviewer":"간*******","content":"2번째 후기입니다. 이것은 파.센에 어떻게 보여질까요?? 아! 이거 삭제하는 법 아시는분??ㅋㅋㅋ","totalRating":4,"serviceRating":4,"cleanRating":3,"locationRating":3,"convenienceRating":4,"title":null,"date":"2021-01-21"},{"reviewer":"간*******","content":"후기만족합니다","totalRating":3,"serviceRating":3,"cleanRating":3,"locationRating":3,"convenienceRating":3,"title":null,"date":"2021-01-20"},{"reviewer":"별*******","content":"afwewfefwefw","totalRating":3,"serviceRating":3,"cleanRating":3,"locationRating":3,"convenienceRating":3,"title":null,"date":"2020-10-19"},{"reviewer":"가*******","content":"직원은 불친절하지만 객실 컨디션이 너무 좋았어요\n\n제가 살면서 본것중에 가장 큰 침대가 있었습니다\n\n방에서 보이는 바깥 시티뷰가 너무 예뻤어요\n\n록시땅 어메니티 고급스럽고 좋습니다. 체크인때 받은 패키지용품 바이레도 좋았어요\n이런 패키지 상품 이벤트하는건 여기밖에 없었는데 .. 불친절한거 빼고 좋았어요\n\n목욕가운은 너무 부드러워서 집에 가져가고 싶은거 참았습니다\n\n많이 파세요\n\n//Dhub 테스트용 후기입니다","totalRating":5,"serviceRating":1,"cleanRating":5,"locationRating":5,"convenienceRating":4,"title":null,"date":"2020-09-15"},{"reviewer":"가*******","content":"화장실냄새나요\n침대에 머리카락 있어요\n객실은 크고 좋습니다\n서비스는 그냥 쏘쏘......","totalRating":3,"serviceRating":2,"cleanRating":1,"locationRating":1,"convenienceRating":3,"title":null,"date":"2020-09-15"},{"reviewer":"가*******","content":"후기 TEST\n--&gt; 이거 보다 짧게 입력하면 후기 등록 안됨\nAPI TEST\nREVIEWS TEST\nDhub 테스트\n\n서울시 강남구 테헤란로 108길 42 4층 야놀자 \n\n후기테스트 중입니다 - 단 \n코로나여 물럿거라 \n\n모텔숙소 작고 아담하고 좋아요\n침구류가 깨끗합니다\n바디워시 향이 좋아요 \n\n새벽에 옆방에서 시끄럽게 떠들어서 불편했습니다. 방음은 잘 안되는 편이네요","totalRating":1,"serviceRating":4,"cleanRating":1,"locationRating":2,"convenienceRating":3,"title":null,"date":"2020-09-04"},{"reviewer":"가*******","content":"잘쉬다 갑니다\n후기테스트\nDhub TEST\n\n침대는 편한데 사이즈가 작아요\n타월 품질이 좋습니다. 개수가 넉넉하다면 더 만족할거같아요\n\n\n이쑦쏘 까찌마쎼요\n한꾺살람만 알볼쑤있는 끌\n뜨러ㅃ꼬 냼썌나꼬 뿔친쩔하ㅃ니따\n후끼뗴쓰트","totalRating":5,"serviceRating":5,"cleanRating":5,"locationRating":5,"convenienceRating":5,"title":null,"date":"2020-09-04"}]},"message":"","timestamp":"2021-04-12 15:11:33"} })
  })
}

function getPlaceReviewsBatch(id, params) {
  return axios.post(`/api/place/reviews-batch/${id}`, params);
}

/*
  숙소 예약시 차량 가능 여부 확인
 */
function checkVehicle(params) {
  return axios.post('/api/place/vehicle', params);
}

/*
  숙소 쿠폰 리스트 불러오는 api
 */
function getCoupons(params) {
  return axios.post('/api/place/coupons', params);
}

function publishCoupon(params) {
  return axios.post('/api/place/coupon', params);
}

/*
  결제 성공 후 예약 api
 */
function checkReservePlace(params) {
  return axios.post('/api/placeReserve/checkReservePlace', params);
}

/*
  핸드폰번호로 예약된 리스트 불러오는 api
 */
function getReservePlaceList(params) {
  return new Promise(resolve => {
    resolve({ status: 200, data: {
      result: [{"reservationInfo":{"bpReservationNo":111196568260636,"yanReservationNo":2103251166611667,"customerName":"이철웅","customerPhone":"01025178197","visitorName":"이철웅","visitorPhone":"01025178197","reservationDate":"2021-03-25 11:18","checkIn":"2021-03-25 14:00","checkOut":"2021-03-26 11:00","reservationStatus":"RESERVED","canceledDate":null,"roomLevel":"(TEST) YAN 호텔 객실 03 대기","roomPrice":14000,"couponPrice":null,"paymentPrice":14000,"penaltyFee":null,"paymentCancelStatus":null,"creditCardAmount":14000,"welfarePoint":0,"account":0,"placeChannelDiscounts":[],"consecutive":false},"placeInfo":{"placeNo":1000091782,"placeName":"TEST YAN 전용 호텔 숙소","address":"전라남도 진도군 고군면 가계길 3","category":"HOTEL","images":[{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"REPRESENTATION","categoryName":"대표 사진"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"REPRESENTATION","categoryName":"대표 사진"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"REPRESENTATION","categoryName":"대표 사진"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"REPRESENTATION","categoryName":"대표 사진"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"REPRESENTATION","categoryName":"대표 사진"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"REPRESENTATION","categoryName":"대표 사진"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"REPRESENTATION","categoryName":"대표 사진"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"REPRESENTATION","categoryName":"대표 사진"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"REPRESENTATION","categoryName":"대표 사진"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"REPRESENTATION","categoryName":"대표 사진"},{"bpUrl":"/dummy.jpeg","thumbUrl":null,"categoryType":"REPRESENTATION","categoryName":"대표 사진"}],"cancelPolicies":[{"seasonType":null,"cancelPenaltyPercent":0,"day":3,"hour":14},{"seasonType":null,"cancelPenaltyPercent":100,"day":0,"hour":24}],"zipCode":"12345","phone":"0261068625"}}]
} });
  });
}
/*
  예약 id로 예약된 리스트 불러오는 api
 */
function getReservePlaceById(params) {
  return axios.post('/api/placeReserve/place/id', params);
}
/*
  예약된 숙소 일정 취소 api
 */
function cancelPlaceReserve(params) {
  return axios.post('/api/placeReserve/cancel/place', params);
}

/*
  예약된 숙소 내역에 대한 취소 수수료 api
*/

function getPlaceCancelFee(params) {
  return new Promise(resolve => {
    resolve({ data: {"code":200,"result":{"reservationCancellationFee":0}} });
  });
}

/*
  예약된 리스트에서 제거하는 api(취소는 안되고 단순 리스트에서 제거)
 */
function deleteReserve(params) {
  return axios.post('/api/placeReserve/delete/place', params);
}

/*
  레저 리스트 불러오는 api
*/
function getLeisureList(params) {
  return new Promise(resolve => {
    resolve({ data: {"deal":{"code":200,"result":{"totalCount":30,"totalPages":10,"contents":[{"id":53090,"name":"[전남 보성] 비봉공룡공원","coverPrice":0,"gajagoSalePrice":3000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"status":"SALE","image":"/dummy.jpeg","images":["/dummy.jpeg"],"socialImages":["/dummy.jpeg"],"tel":"1833-8777","dealIntroduce":"아이들에게 공룡에 모든걸 보여드리고 싶다면? 보성 비봉 공룡공원이 답이다!\n국내 최초 리얼공룡쇼부터 디노빌리지 체험 등등 아이들에게 공룡과 친구가 될 수 있는 기회를 선사하세요.\n공룡친구들 만나러 함께 가실래요?","dealInfo":"&bull; 유효기간 : ~2020.05.31\n&bull; 당일구매, 당일사용 가능","usageInfo":"1. 최소 이용1시간 전 상품구매\n2. 현장방문, 성함 및  휴대폰 뒷자리 4자리로 확인 후 이용","storeInfo":"&bull; 업체명 : 보성 비봉공룡공원\n&bull; 업체주소 : 전라남도 보성군 득량면 공룡로 822-51\n&bull; 업체전화번호 : 1833-8777\n&bull; 업체 운영시간\n   * 9월~6월 10:00~18:00(라스트입장 17시)\n   * 7월~8월 10:00~19:00(라스트입장 18시30분)\n   * 워킹공룡쇼/4D공룡공연\n   * 주말 및 공휴일 : 13시(1회) / 15시(2회)\n&bull; 업체휴무 : 매주 월요일 휴무(신정,구정,추석,공휴일,주말 정상운영)\n&bull; 주차가능유무 : 무료주차가능\n&bull; 당일 사용가능(구매후 1시간이후)","noticeInfo":"&bull; 무료입장나이 : 24개월미만(증빙서류 지참)\n&bull; 디노빌리지 공룡알체험을 별도 이용할경우 공룡알을 구매하셔야 합니다(공룡알은 1개당 3,000원이며 현장결제 입니다.)\n&bull; 공연시간은 현장상황에 따라 변경될 수 있습니다.\n&bull; 주말 및 공휴일 구매고객께서는 입장시 공연좌석이 300석 한정입니다.\n&bull; 음식물 반입 금지입니다.\n&bull; 공연시간\n   * 워킹공룡쇼/4D공룡공연\n   * 주말 및 공휴일 : 13시(1회) / 15시(2회)\n&bull; 이용가능시설\n   * 보성비봉공룡공원(40여종의 움직이는 공룡들/코리아노사우루스 보성엔시스진품 화석전시장/ 공룡화석/공룡골격화석/백악기파크/디노빌리지)\n   * 워킹공룡쇼 (공룡알쇼+4D영상+리얼워킹공룡쇼&quot;대한민국 최초의 공룡쇼&quot;)\n   * 유등 ( 고룡유등,LED조형물,등전시)\n   * 전시홀 (코리아노사우루스/보성엔시스/진품화석전시장/공룡골격전시장/공룡알전시장)\n   * 체험(디노빌리지,공룡만들기체험,3D트릭아트,포토존,백악기파크,공룡카타기)\n   * 놀이시설(공룡라이더,워킹공룡,공룡카체험)\n   * 고객휴게실(공룡만들기체험장,공룡스낵코너,공룡기념품,공룡카페,공룡식당)\n   * 기념품샵(허브샵,공룡라텍스,피규어,3D입체카드)\n   * 안내실(안내직원,보성관광스크린,보성관광지도,비봉공룡공원조감도,응급약,모유실)\n   * 공룡한식당(보성 최고의 맛집)","csInfo":"* 고객센터 : 1644-1346 (야놀자)\n* 상담시간 : 09:00 ~ 19:00 (연중무휴)","refundInfo":"* 패키지 1곳 이상 부분이용 시 환불 불가\n* 유효기간 내 취소/환불 가능\n* 미사용 티켓 100% 환불가능\n* 사용한 티켓 환불 불가\n* 중복 할인 적용 불가","salesCount":0,"options":[{"id":475782,"dealId":53090,"name":"A-1. [성인] 1인 입장권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":0,"gajagoSalePrice":5000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":0,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475783,"dealId":53090,"name":"A-2. [청소년] 1인 입장권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":0,"gajagoSalePrice":4000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":0,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475784,"dealId":53090,"name":"A-3. [소인] 1인 입장권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":0,"gajagoSalePrice":3000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":0,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475785,"dealId":53090,"name":"A-4. [주말/공휴일] 1인 입장권+워킹공룡쇼","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":0,"gajagoSalePrice":9000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":0,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true}],"location":[{"id":1258,"name":"전남"},{"id":1552,"name":"고흥, 보성"},{"id":1568,"name":"전남 보성"}],"locations":null,"subLocations":null,"type":[{"id":2263,"name":"테마파크"},{"id":2281,"name":"이색테마파크"}],"address":"전남 보성군 득량면 공룡로 822-51","gajagoUrl":"https://www.thegajago.com/deals/53090?utm_source=oa&utm_medium=BRINGPRICE","tags":"[전남 보성] 비봉공룡테마파크,","discountRate":0,"hasPenalty":false,"dealPointDescription":"대한민국 최대 공룡테마파크","dealPriceGroups":[{"id":31711,"dealId":53090,"name":"비봉공룡공원 이용권","description":null,"sort":1,"dealOptionIds":[475782,475783,475784,475785]}],"hotDealYn":true,"benefit":null,"benefitTitle":null,"benefitDesc":null,"sortWeight":0,"commission":{"commissionType":"SHARE","commissionRate":0},"postReservationYn":false,"extraImages":null,"supplyYn":null,"permanentDealId":null,"geoPoint":{"lat":34.70747931977058,"lon":127.19633690839078}},{"id":53088,"name":"[경기 이천] 별빛정원우주 5월","coverPrice":0,"gajagoSalePrice":6000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"status":"SALE","image":"/dummy.jpeg","images":["/dummy.jpeg"],"socialImages":["/dummy.jpeg"],"tel":"031-645-0002","dealIntroduce":"세상에 없던 빛의 파라노마, 상공에서 즐기는 이색 티타임!","dealInfo":"* 판매기간 : ~2020.05.31\n* 유효기간 : ~2020.05.31","usageInfo":"* 이용권 구매\n* 티켓구매\n* 문자티켓 수신\n* 이용당일 매표소에서 티켓 교환 후 입장","storeInfo":"* 업체이름 : 별빛정원 우주\n* 업체번호 : 031-645-0002\n* 업체주소 : 경기도 이천시 마장면 덕이로 154번길 287-76 덕평자연휴게소 내 별빛정원우주\n   * 4월 운영시간 : 18:00~23:00 입장마감22:00)\n* 야간 오픈 시 파크 전체 조명이 점등됩니다.\n* 폭우/폭설 시 이용은 현장에 문의해주세요.\n* 휴 무 : 연중무휴\n* 무료입장나이 : 36개월미만(증빙서류 지참 필수)\n* 주차가능여부 : 덕평자연휴게소(영동고속도로, 양방향), 국도 전용 주차장 내 무료 주차\n \n[판매처 정보]\n* (주) 플레이스엠\n* 문의: 1544-3913\n* 시간 : 09:00~18:00(평일) / 09:00~14:00(주말&공휴일)\n* 취소&middot;환불 규정을 확인하세요!","noticeInfo":"[별빛 우주정원 이용안내]\n* 운영시간\n   * 야간 18:00 ~23:00 (입장마감 22:00)\n* 폭우/폭설 시 운영시간 및 운영여부가 달라질 수 있으나 방문 전 현장으로 문의 바랍니다.\n* 주차 안내: 덕평자연휴게소(영동고속도로,양방향) 국도 전용 주차장 내 무료 주차 가능\n* 대인기준: 14세 이상/ 소인기준 : 36개월 이상~13세\n* (36개월 미만 유아는 증빙서류 지참시 무료 입장 가능합니다.)\n* 안전하고 즐거운 이용을 위하여 아래 물품 반입을 제한합니다.\n   * 취사도구/돗자리/자전거/인라인/킥보드 등 소형 탑승 기구 및 일체 체육용품, 무선 조종 탑승 기구, 화약등\n* 외부 음식물 반입은 불가합니다.\n* 애완 동물은 출입이 불가합니다.\n* 다른 손님에게 피해를 줄 수 있는 행동은 삼가바랍니다.\n   * 고성방가,과격한 행동,벤치에 눕는 행위, 취사 행위, 잔디/꽃밭 시설물 훼손/낙서 등\n* 관람객이 당 파크 시설물 등을 고의 또는 과실로 훼손할 때에는 이를 즉시 변상하여야 합니다.\n* 노약자/어린이는 안전을 위해 보호자가 반드시 동행하여야 하며, 부주의로 인한 사고 시 당사는 책임지지 않습니다.\n* 시설물의 보수,점검등으로 일부 시설의 관람이 제한/불가할 수 있습니다. 입장권으로 교환 및 입장 후 티켓 환불은 불가합니다\n* 본 쿠폰은 현장에서 현금으로의 환불 및 카드 취소가 불가한 상품이며, 타 할인 쿠폰 및 카드 제휴 할인 등과 중복 사용 불가합니다.","csInfo":"* 고객센터 : 1644-1346 (야놀자)\n* 상담시간 : 09:00 ~ 19:00 (연중무휴)","refundInfo":"- 구매 7일 이내 취소 : 미 사용 티켓 전액환불\n- 구매 7일 이후 취소 : 환불불가\n- 사용한 티켓 환불 불가","salesCount":6,"options":[{"id":475770,"dealId":53088,"name":"A-1. [대인] 야간 연간이용권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":60000,"gajagoSalePrice":30000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":0,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475771,"dealId":53088,"name":"A-2. [소인] 야간 연간이용권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":30000,"gajagoSalePrice":15000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":0,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475772,"dealId":53088,"name":"B-1. [대인] 야간 입장권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":12000,"gajagoSalePrice":9000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":0,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475773,"dealId":53088,"name":"B-2. [소인] 야간 입장권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":6000,"gajagoSalePrice":6000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":0,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true}],"location":[{"id":1244,"name":"경기"},{"id":1303,"name":"경기 남부"},{"id":1323,"name":"경기 이천"}],"locations":null,"subLocations":null,"type":[{"id":2263,"name":"테마파크"},{"id":2281,"name":"이색테마파크"}],"address":"경기 이천시 마장면 덕이로154번길 287-76","gajagoUrl":"https://www.thegajago.com/deals/53088?utm_source=oa&utm_medium=BRINGPRICE","tags":null,"discountRate":0,"hasPenalty":false,"dealPointDescription":"세상에 없던 빛의 파라노마, 상공에서 즐기는 이색 티타임!","dealPriceGroups":[{"id":31706,"dealId":53088,"name":"별빛정원우주 야간 연간입장권","description":"* 판매/유효기간: ~2020.05.31","sort":1,"dealOptionIds":[475770,475771]},{"id":31707,"dealId":53088,"name":"별빛정원우주 야간 입장권","description":"* 판매/유효기간: ~2020.05.31","sort":2,"dealOptionIds":[475772,475773]}],"hotDealYn":true,"benefit":null,"benefitTitle":null,"benefitDesc":null,"sortWeight":0,"commission":{"commissionType":"SHARE","commissionRate":0},"postReservationYn":false,"extraImages":null,"supplyYn":null,"permanentDealId":null,"geoPoint":{"lat":37.241321530161926,"lon":127.38980831645587}},{"id":53087,"name":"[경기 고양] 쥬라리움  하남점","coverPrice":11900,"gajagoSalePrice":10900,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"status":"SALE","image":"/dummy.jpeg","images":["/dummy.jpeg"],"socialImages":["/dummy.jpeg"],"tel":"070-8860-7542","dealIntroduce":null,"dealInfo":"* 판매기간 : ~2020.05.31\n* 유효기간 : ~2020.05.31\n* 당일구매/당일사용 가능","usageInfo":"* 이용권 구매\n* 티켓구매\n* 문자티켓 수신\n* 이용당일 매표소에서 티켓 교환 후 입장","storeInfo":"* 시설명 : 하남 쥬라리움\n* 주소 : 경기 하남시 미사강변한강로 209 하남 쥬라리움\n* 전화번호 :07088607542\n* 홈페이지 :http://zoorarium.com","noticeInfo":"- 매주 월요일은 휴무일입니다.\n- 운영시간 : 10:30~19:00 (입장마감 18:00)\n- 우천 시 동물원은 정상 영업하며 타 프로그램이 취소되거나 변경될 수 있습니다.\n- 반려동물과 자전거, 인라인, 퀵보드 등은 동물원 내 반입이 불가합니다.\n- 동물원 내 취사는 파크 내에서 판매하는 삼겹살 구매시에만 가능합니다.\n- 온라인 재판매 목적으로 양도시 현장에서 티켓불출이 불가합니다.\n\n* [동물들을 위한 필수 에티켓]\n- 동물들이 스트레스를 받을 수 있으니 플래시 촬영은 삼가주시기 바랍니다.\n- 동물의 컨디션이나 기타 날씨 사정으로 인해 예고 없이 관람이 제한될 수 있습니다.\n- 여러분의 안전을 위하여 안전펜스에 매달리거나 안으로 들어가지 마십시오.\n- 동물들에게 비닐, 페트병, 종이, 과자, 아이스크림 등 이물질을 주지 마십시오.\n　\n* 운영 시간 : 10:30 ~ 19:00 (입장마감 18:00)\n* 코로나19로 인해 마스크 착용하신 분만 매표 입장 가능","csInfo":"* 고객센터 : 1644-1346 (야놀자)\n* 상담시간 : 09:00 ~ 19:00 (연중무휴)","refundInfo":"▪ 구매일로부터 7일이내 환불가능합니다.\n▪ 취소∙환불은 회원 본인이 마이페이지 등을 통해서 할 수 있습니다.\n▪ 사용티켓, 부분환불 불가합니다.\n▪ 유효기간내 미사용티켓은 종료후\n　위메프 포인트 100%로 환급해드립니다.\n▪ 부분환불 및 발권 후 환불불가","salesCount":5,"options":[{"id":475762,"dealId":53087,"name":"A-1. [대인] 2시간권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":11900,"gajagoSalePrice":10900,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":983,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475763,"dealId":53087,"name":"A-2. [소인] 2시간권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":13900,"gajagoSalePrice":12900,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":990,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475764,"dealId":53087,"name":"B-1. [대인] 종일권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":13900,"gajagoSalePrice":12900,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":996,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475765,"dealId":53087,"name":"B-2. [소인] 종일권","description":"","status":"SALE","refundType":"REFUND_IN_7D","coverPrice":15900,"gajagoSalePrice":14900,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":997,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475766,"dealId":53087,"name":"C-1. 먹이 체험권 1회","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":0,"gajagoSalePrice":1000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":998,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475767,"dealId":53087,"name":"C-2. 먹이 체험권 3회","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":0,"gajagoSalePrice":2500,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":998,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475768,"dealId":53087,"name":"C-3. 먹이 체험권 5회","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":0,"gajagoSalePrice":4000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":998,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475769,"dealId":53087,"name":"C-4. 먹이 체험권 10회","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":0,"gajagoSalePrice":7000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":999,"pqlpp":0,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":0,"partnerMarginPercent":0,"canExpiredRefund":true}],"location":[{"id":1244,"name":"경기"},{"id":1299,"name":"전체"},{"id":1244,"name":"경기"},{"id":1303,"name":"경기 남부"},{"id":1324,"name":"경기 하남"}],"locations":null,"subLocations":null,"type":[{"id":2263,"name":"테마파크"},{"id":2279,"name":"동물원"}],"address":"경기 하남시 미사강변한강로 209","gajagoUrl":"https://www.thegajago.com/deals/53087?utm_source=oa&utm_medium=BRINGPRICE","tags":null,"discountRate":0,"hasPenalty":false,"dealPointDescription":null,"dealPriceGroups":[{"id":31703,"dealId":53087,"name":"2시간권","description":"* 주중/주말공통","sort":1,"dealOptionIds":[475762,475763]},{"id":31704,"dealId":53087,"name":"종일권","description":"* 주중/주말공통","sort":2,"dealOptionIds":[475764,475765]},{"id":31705,"dealId":53087,"name":"먹이 체험권","description":"* 주중/주말공통","sort":3,"dealOptionIds":[475766,475767,475768,475769]}],"hotDealYn":false,"benefit":null,"benefitTitle":null,"benefitDesc":null,"sortWeight":0,"commission":{"commissionType":"SHARE","commissionRate":0},"postReservationYn":false,"extraImages":null,"supplyYn":null,"permanentDealId":null,"geoPoint":{"lat":37.57111797366322,"lon":127.19489808428648}}]},"message":"","timestamp":"2021-04-12 16:21:43"}} })
  });
}

/*
  레저 지역과 카테고리 불러오는 api
 */
function getLeisureRegionCategory() {
  return new Promise(resolve => {
    resolve([
      { data: {"region":{"code":200,"result":{"categories":[{"id":1243,"name":"서울","children":[{"id":1262,"name":"전체","children":[]},{"id":1261,"name":"강남∙서초","children":[]},{"id":1263,"name":"관악∙동작","children":[]},{"id":1264,"name":"송파∙강동","children":[]},{"id":1265,"name":"종로","children":[]},{"id":1266,"name":"중구","children":[]},{"id":1267,"name":"용산","children":[]},{"id":1268,"name":"성동","children":[]},{"id":1269,"name":"강서","children":[]},{"id":1270,"name":"마포","children":[]},{"id":1271,"name":"강북","children":[]}]},{"id":1244,"name":"경기","children":[{"id":1299,"name":"전체","children":[]},{"id":1300,"name":"수원","children":[]},{"id":1301,"name":"경기 동부","children":[]},{"id":1302,"name":"경기 서부","children":[]},{"id":1303,"name":"경기 남부","children":[]},{"id":1304,"name":"경기 북부","children":[]},{"id":1305,"name":"경기 중부","children":[]}]},{"id":1245,"name":"인천","children":[{"id":1336,"name":"전체","children":[]},{"id":1337,"name":"남구, 남동, 연수","children":[]},{"id":1339,"name":"강화","children":[]},{"id":1340,"name":"중구","children":[]},{"id":1341,"name":"옹진","children":[]},{"id":1342,"name":"계양, 부평","children":[]},{"id":1343,"name":"동구, 서구","children":[]}]},{"id":1246,"name":"강원","children":[{"id":1354,"name":"전체","children":[]},{"id":1355,"name":"속초, 양양, 고성","children":[]},{"id":1356,"name":"강릉, 동해, 삼척","children":[]},{"id":1357,"name":"춘천, 홍천, 원주, 횡성","children":[]},{"id":1358,"name":"평창, 정선, 영월, 태백","children":[]},{"id":1359,"name":"철원, 화천, 양구, 인제","children":[]}]},{"id":1247,"name":"대전","children":[{"id":1378,"name":"전체","children":[]},{"id":1379,"name":"유성","children":[]},{"id":1380,"name":"서구, 중구","children":[]},{"id":1381,"name":"대덕구, 동구","children":[]}]},{"id":1248,"name":"세종","children":[{"id":1382,"name":"전체","children":[]}]},{"id":1249,"name":"충북","children":[{"id":1383,"name":"전체","children":[]},{"id":1384,"name":"단양, 제천, 충주","children":[]},{"id":1385,"name":"괴산, 음성, 증평, 진천","children":[]},{"id":1386,"name":"청주","children":[]},{"id":1387,"name":"보은, 옥천, 영동","children":[]}]},{"id":1250,"name":"충남","children":[{"id":1399,"name":"전체","children":[]},{"id":1400,"name":"아산, 천안","children":[]},{"id":1401,"name":"계룡, 공주, 금산, 논산","children":[]},{"id":1402,"name":"당진, 서산, 예산, 태안","children":[]},{"id":1403,"name":"서천, 보령, 부여, 청양, 홍성","children":[]}]},{"id":1251,"name":"부산","children":[{"id":1419,"name":"전체","children":[]},{"id":1420,"name":"기장, 남구, 수영, 해운대","children":[]},{"id":1421,"name":"동구, 서구, 사하, 영도, 중구","children":[]},{"id":1422,"name":"부산진구, 연제","children":[]},{"id":1423,"name":"동래, 금정","children":[]},{"id":1424,"name":"강서, 사상, 북구","children":[]}]},{"id":1252,"name":"울산","children":[{"id":1441,"name":"전체","children":[]},{"id":1442,"name":"남구, 중구","children":[]},{"id":1443,"name":"동구, 북구, 울주","children":[]}]},{"id":1253,"name":"대구","children":[{"id":1449,"name":"전체","children":[]},{"id":1450,"name":"남구, 달서, 달성","children":[]},{"id":1451,"name":"동구, 수성구","children":[]},{"id":1452,"name":"북구, 서구, 중구","children":[]}]},{"id":1254,"name":"경북","children":[{"id":1461,"name":"전체","children":[]},{"id":1462,"name":"울릉","children":[]},{"id":1463,"name":"영덕, 울진, 청송","children":[]},{"id":1464,"name":"구미, 김천, 문경, 상주","children":[]},{"id":1465,"name":"고령, 성주, 칠곡","children":[]},{"id":1466,"name":"경산, 영천, 청도","children":[]},{"id":1467,"name":"경주","children":[]},{"id":1468,"name":"포항","children":[]},{"id":1469,"name":"봉화, 영양, 안동","children":[]},{"id":1470,"name":"군위, 예천, 영주, 의성","children":[]}]},{"id":1255,"name":"경남","children":[{"id":1494,"name":"전체","children":[]},{"id":1495,"name":"거제, 고성, 통영","children":[]},{"id":1497,"name":"남해, 사천, 진주, 하동","children":[]},{"id":1498,"name":"김해, 밀양, 양산, 창원","children":[]},{"id":1499,"name":"거창, 산청, 함양, 합천","children":[]},{"id":1500,"name":"의령, 창녕, 함안","children":[]}]},{"id":1256,"name":"광주","children":[{"id":1518,"name":"전체 ","children":[]},{"id":1519,"name":"남구, 서구","children":[]},{"id":1520,"name":"동구, 북구, 광산","children":[]}]},{"id":1257,"name":"전북","children":[{"id":1526,"name":"전체","children":[]},{"id":1527,"name":"전주, 완주","children":[]},{"id":1528,"name":"군산, 김제, 부안, 익산","children":[]},{"id":1529,"name":"고창, 순창, 정읍","children":[]},{"id":1530,"name":"남원, 임실, 장수","children":[]},{"id":1531,"name":"무주, 진안","children":[]}]},{"id":1258,"name":"전남","children":[{"id":1548,"name":"전체","children":[]},{"id":1549,"name":"광양, 순천, 여수","children":[]},{"id":1550,"name":"목포, 완도, 진도, 해남","children":[]},{"id":1551,"name":"곡성, 구례, 담양, 장성","children":[]},{"id":1552,"name":"고흥, 보성","children":[]},{"id":1553,"name":"강진, 장흥","children":[]},{"id":1554,"name":"나주, 영암, 화순","children":[]},{"id":1555,"name":"무안, 신안, 영광, 함평","children":[]}]},{"id":1259,"name":"제주","children":[{"id":1578,"name":"전체","children":[]},{"id":1579,"name":"제주 북부","children":[]},{"id":1580,"name":"제주 남부","children":[]},{"id":1581,"name":"제주 동부","children":[{"id":1589,"name":"제주 표선","children":[]}]},{"id":1582,"name":"제주 서부","children":[]}]}]},"message":"","timestamp":"2021-04-12 16:49:50"}} }, { data: {"category":{"code":200,"result":{"categories":[{"id":2263,"name":"테마파크","children":[{"id":2276,"name":"놀이동산","children":[]},{"id":2277,"name":"아쿠아리움","children":[]},{"id":2278,"name":"스노우파크","children":[]},{"id":2279,"name":"동물원","children":[]},{"id":2280,"name":"수목원/식물원","children":[]},{"id":2281,"name":"이색테마파크","children":[]}]},{"id":2222,"name":"스파/워터파크","children":[{"id":2262,"name":"스파/온천","children":[]},{"id":2261,"name":"워터파크","children":[]}]},{"id":2264,"name":"익스트림","children":[{"id":2282,"name":"스키시즌권/렌탈권","children":[]},{"id":2283,"name":"패러글라이딩/경비행기","children":[]},{"id":2284,"name":"짚라인/번지점프","children":[]},{"id":2285,"name":"사격/양궁/골프","children":[]},{"id":2286,"name":"레일바이크","children":[]},{"id":2287,"name":"카트/ATV","children":[]},{"id":2288,"name":"전동휠/스쿠터/자전거","children":[]},{"id":5116,"name":"기타익스트림","children":[]}]},{"id":2267,"name":"공연/전시/관람","children":[{"id":5118,"name":"전시회","children":[]},{"id":2299,"name":"공연","children":[]},{"id":2300,"name":"박물관/미술관","children":[]},{"id":2301,"name":"이색전시","children":[]}]},{"id":2266,"name":"투어/교통","children":[{"id":2297,"name":"버스여행","children":[]},{"id":2295,"name":"패스권/시티투어","children":[]},{"id":2296,"name":"기차여행","children":[]},{"id":2298,"name":"케이블카/곤돌라","children":[]},{"id":5117,"name":"유람선/잠수함/요트","children":[]}]},{"id":2268,"name":"키즈체험","children":[{"id":2302,"name":"실내키즈체험","children":[]},{"id":2303,"name":"실외키즈체험","children":[]}]},{"id":2265,"name":"체험","children":[{"id":2290,"name":"승마/동물체험","children":[]},{"id":2291,"name":"한복체험","children":[]},{"id":2292,"name":"VR/방탈출","children":[]},{"id":2293,"name":"테마카페/스튜디오","children":[]}]},{"id":2333,"name":"클래스/모임","children":[{"id":2334,"name":"클래스","children":[]},{"id":2335,"name":"모임","children":[]}]},{"id":2269,"name":"축제/캠핑/대여","children":[{"id":5119,"name":"대여상품","children":[]},{"id":2304,"name":"텐트/캠핑/카라반","children":[]}]},{"id":2260,"name":"수상레저","children":[{"id":2271,"name":"수상레저","children":[]},{"id":2272,"name":"서핑/카약","children":[]},{"id":2273,"name":"스노쿨링/다이빙","children":[]},{"id":2274,"name":"레프팅/보트","children":[]},{"id":2275,"name":"수영장","children":[]}]},{"id":2270,"name":"렌터카","children":[{"id":2305,"name":"제주렌터카","children":[]},{"id":2306,"name":"내륙렌터카","children":[]}]},{"id":2315,"name":"낚시","children":[{"id":2316,"name":"바다낚시/선상","children":[]},{"id":2317,"name":"바다낚시/낚시터","children":[]},{"id":2318,"name":"바다낚시/갯바위","children":[]},{"id":2319,"name":"바다낚시/요트","children":[]}]}]},"message":"","timestamp":"2021-04-12 17:00:12"}} }
    ])
  })
}
/*
  레저 카테고리
*/
function getLeisureCategory() {
  return axios.post('/api/leisure/category');
}
/*
  레저 지역
*/
function getLeisureRegion() {
  return axios.post('/api/leisure/region');
}
/*
  레져 자동완성
*/
let leisureAutocompleteCancel = null;
function leisureAutoComplete(params) {
  return new Promise(resolve => {
    resolve({ data: {"code":200,"result":[{"dealId":53088,"placeId":null,"name":"[경기 이천] 별빛정원우주 5월","latitude":37.241321530161926,"longitude":127.38980831645587,"type":"DEAL_NAME"},{"dealId":52848,"placeId":null,"name":"[경기 이천] 에덴파라다이스객실+공룡수목원패키지","latitude":37.2323188917753,"longitude":127.337227620054,"type":"DEAL_NAME"},{"dealId":52646,"placeId":null,"name":"[경기 이천] 미란다 스파플러스 단품권","latitude":37.27876664334794,"longitude":127.46337002682365,"type":"DEAL_NAME"},{"dealId":52385,"placeId":null,"name":"[경기 이천] 노리디지털 키즈카페 안흥점","latitude":37.2742780446662,"longitude":127.45444878428623,"type":"DEAL_NAME"},{"dealId":51688,"placeId":null,"name":"[경기 이천] 파밀리에 승마장 승마체험","latitude":37.14612594386537,"longitude":127.52964500570467,"type":"DEAL_NAME"},{"dealId":0,"placeId":"ChIJg2aRABSmZDURYOQUKaHNj1k","name":"이천시","latitude":37.2719952,"longitude":127.4348221,"type":"LOCATION_NAME"},{"dealId":0,"placeId":"ChIJuQtspJGnZDURg6ts1hKfxSI","name":"이천IC","latitude":37.2451112,"longitude":127.4965393,"type":"LOCATION_NAME"},{"dealId":0,"placeId":"ChIJT0nRgIHufDUR6OOfal6IvC8","name":"이천리","latitude":37.8722542,"longitude":126.8334137,"type":"LOCATION_NAME"}],"message":"","timestamp":"2021-04-12 16:44:02"} })
  })
}

/*
  레저 상세정보(1개의 상세 정보) 불러오는 api
*/
function getLeisure(params) {
  return new Promise(resolve => {
    resolve({ data: {"code":200,"result":{"id":53088,"name":"[경기 이천] 별빛정원우주 5월","coverPrice":0,"gajagoSalePrice":6000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"status":"SALE","images":["/dummy.jpeg"],"socialImages":["/dummy.jpeg", "/dummy.jpeg"],"lat":37.241321530161926,"lon":127.38980831645587,"tel":"031-645-0002","dealIntroduce":"세상에 없던 빛의 파라노마, 상공에서 즐기는 이색 티타임!","dealInfo":"* 판매기간 : ~2020.05.31\n* 유효기간 : ~2020.05.31","usageInfo":"* 이용권 구매\n* 티켓구매\n* 문자티켓 수신\n* 이용당일 매표소에서 티켓 교환 후 입장","storeInfo":"* 업체이름 : 별빛정원 우주\n* 업체번호 : 031-645-0002\n* 업체주소 : 경기도 이천시 마장면 덕이로 154번길 287-76 덕평자연휴게소 내 별빛정원우주\n   * 4월 운영시간 : 18:00~23:00 입장마감22:00)\n* 야간 오픈 시 파크 전체 조명이 점등됩니다.\n* 폭우/폭설 시 이용은 현장에 문의해주세요.\n* 휴 무 : 연중무휴\n* 무료입장나이 : 36개월미만(증빙서류 지참 필수)\n* 주차가능여부 : 덕평자연휴게소(영동고속도로, 양방향), 국도 전용 주차장 내 무료 주차\n \n[판매처 정보]\n* (주) 플레이스엠\n* 문의: 1544-3913\n* 시간 : 09:00~18:00(평일) / 09:00~14:00(주말&공휴일)\n* 취소&middot;환불 규정을 확인하세요!","noticeInfo":"[별빛 우주정원 이용안내]\n* 운영시간\n   * 야간 18:00 ~23:00 (입장마감 22:00)\n* 폭우/폭설 시 운영시간 및 운영여부가 달라질 수 있으나 방문 전 현장으로 문의 바랍니다.\n* 주차 안내: 덕평자연휴게소(영동고속도로,양방향) 국도 전용 주차장 내 무료 주차 가능\n* 대인기준: 14세 이상/ 소인기준 : 36개월 이상~13세\n* (36개월 미만 유아는 증빙서류 지참시 무료 입장 가능합니다.)\n* 안전하고 즐거운 이용을 위하여 아래 물품 반입을 제한합니다.\n   * 취사도구/돗자리/자전거/인라인/킥보드 등 소형 탑승 기구 및 일체 체육용품, 무선 조종 탑승 기구, 화약등\n* 외부 음식물 반입은 불가합니다.\n* 애완 동물은 출입이 불가합니다.\n* 다른 손님에게 피해를 줄 수 있는 행동은 삼가바랍니다.\n   * 고성방가,과격한 행동,벤치에 눕는 행위, 취사 행위, 잔디/꽃밭 시설물 훼손/낙서 등\n* 관람객이 당 파크 시설물 등을 고의 또는 과실로 훼손할 때에는 이를 즉시 변상하여야 합니다.\n* 노약자/어린이는 안전을 위해 보호자가 반드시 동행하여야 하며, 부주의로 인한 사고 시 당사는 책임지지 않습니다.\n* 시설물의 보수,점검등으로 일부 시설의 관람이 제한/불가할 수 있습니다. 입장권으로 교환 및 입장 후 티켓 환불은 불가합니다\n* 본 쿠폰은 현장에서 현금으로의 환불 및 카드 취소가 불가한 상품이며, 타 할인 쿠폰 및 카드 제휴 할인 등과 중복 사용 불가합니다.","csInfo":"* 고객센터 : 1644-1346 (야놀자)\n* 상담시간 : 09:00 ~ 19:00 (연중무휴)","refundInfo":"- 구매 7일 이내 취소 : 미 사용 티켓 전액환불\n- 구매 7일 이후 취소 : 환불불가\n- 사용한 티켓 환불 불가","salesCount":6,"options":[{"id":475770,"dealId":53088,"name":"A-1. [대인] 야간 연간이용권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":60000,"gajagoSalePrice":30000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":0,"pqlpp":null,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":null,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475771,"dealId":53088,"name":"A-2. [소인] 야간 연간이용권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":30000,"gajagoSalePrice":15000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":0,"pqlpp":null,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":null,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475772,"dealId":53088,"name":"B-1. [대인] 야간 입장권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":12000,"gajagoSalePrice":9000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":0,"pqlpp":null,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":null,"partnerMarginPercent":0,"canExpiredRefund":true},{"id":475773,"dealId":53088,"name":"B-2. [소인] 야간 입장권","description":null,"status":"SALE","refundType":"REFUND_IN_7D","coverPrice":6000,"gajagoSalePrice":6000,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"expiredType":"ON_PERIOD","items":[{"stockCount":0,"pqlpp":null,"pqlat":30,"sellerInfoId":""}],"expiredAt":0,"availablePeriod":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"discountedGajagoSalePrice":null,"partnerMarginPercent":0,"canExpiredRefund":true}],"location":[{"id":1244,"name":"경기"},{"id":1303,"name":"경기 남부"},{"id":1323,"name":"경기 이천"}],"locations":[{"id":1244,"name":"경기"},{"id":1303,"name":"경기 남부"},{"id":1323,"name":"경기 이천"}],"subLocations":null,"type":[{"id":2263,"name":"테마파크"},{"id":2281,"name":"이색테마파크"}],"address":"경기 이천시 마장면 덕이로154번길 287-76","gajagoUrl":"","tags":null,"discountRate":0,"hasPenalty":false,"dealPointDescription":"세상에 없던 빛의 파라노마, 상공에서 즐기는 이색 티타임!","dealPriceGroups":[{"id":31706,"dealId":53088,"name":"별빛정원우주 야간 연간입장권","description":"* 판매/유효기간: ~2020.05.31","sort":1,"dealOptionIds":[475770,475771]},{"id":31707,"dealId":53088,"name":"별빛정원우주 야간 입장권","description":"* 판매/유효기간: ~2020.05.31","sort":2,"dealOptionIds":[475772,475773]}],"hotDealYn":true,"benefit":null,"benefitTitle":null,"benefitDesc":null,"sortWeight":0,"commission":{"commissionType":"SHARE","commissionRate":0},"postReservationYn":false,"extraImages":null,"supplyYn":null,"ppermanentDealId":null,"message":null,"sellerInfos":[]},"message":"","timestamp":"2021-04-12 16:25:26"} })
  });
}

/*
  레저 좌표 검색
*/
function getLeisureAsLocation(params) {
  return axios.post('/api/leisure/point', params);
}

/*
  레저 예약
*/
function reserveLeisure(params) {
  return axios.post('/api/leisureReserve', params);
}

/*
  레저 예약 내역 조회
*/
function getReserveLeisureList(params) {
  return new Promise(resolve => {
    resolve({ status: 200, data: {"code":200,"result":[{"orderId":110196927641900,"dealId":53088,"image":"/dummy.jpeg","status":"RESERVATION_SUCCEEDED","refundInfo":"- 구매 7일 이내 취소 : 미 사용 티켓 전액환불\n- 구매 7일 이후 취소 : 환불불가\n- 사용한 티켓 환불 불가","address":"경기 이천시 마장면 덕이로154번길 287-76","storeInfo":"* 업체이름 : 별빛정원 우주\n* 업체번호 : 031-645-0002\n* 업체주소 : 경기도 이천시 마장면 덕이로 154번길 287-76 덕평자연휴게소 내 별빛정원우주\n   * 4월 운영시간 : 18:00~23:00 입장마감22:00)\n* 야간 오픈 시 파크 전체 조명이 점등됩니다.\n* 폭우/폭설 시 이용은 현장에 문의해주세요.\n* 휴 무 : 연중무휴\n* 무료입장나이 : 36개월미만(증빙서류 지참 필수)\n* 주차가능여부 : 덕평자연휴게소(영동고속도로, 양방향), 국도 전용 주차장 내 무료 주차\n \n[판매처 정보]\n* (주) 플레이스엠\n* 문의: 1544-3913\n* 시간 : 09:00~18:00(평일) / 09:00~14:00(주말&공휴일)\n* 취소&middot;환불 규정을 확인하세요!","geoPoint":{"lat":37.241321530161926,"lon":127.38980831645587},"orderOption":[{"orderOptionId":1109300,"optionId":475770,"quantity":1,"salePrice":30000,"status":"NOT_USED","canceledDate":null,"optionName":"A-1. [대인] 야간 연간이용권","refundType":"REFUND_IN_7D","orderedOptionItem":[{"orderedOptionItemId":1447026,"itemId":78614,"name":"A-1. [대인] 야간 연간이용권","pinCode":"mock-pin-1447026","status":"NOT_USED","pinType":null}],"expiredType":"ON_PERIOD","expirationDate":null,"period":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"channelDiscounts":[{"createdDate":"2021-03-29 15:07:22","modifiedDate":"2021-03-29 15:07:22","id":101,"discountAmount":2000,"policyNo":7,"isCanceled":false,"policyName":"삼카레저퍼센트"}]},{"orderOptionId":1109301,"optionId":475770,"quantity":1,"salePrice":30000,"status":"NOT_USED","canceledDate":null,"optionName":"A-1. [대인] 야간 연간이용권","refundType":"REFUND_IN_7D","orderedOptionItem":[{"orderedOptionItemId":1447027,"itemId":78614,"name":"A-1. [대인] 야간 연간이용권","pinCode":"mock-pin-1447027","status":"NOT_USED","pinType":null}],"expiredType":"ON_PERIOD","expirationDate":null,"period":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"channelDiscounts":[{"createdDate":"2021-03-29 15:07:22","modifiedDate":"2021-03-29 15:07:22","id":102,"discountAmount":2000,"policyNo":7,"isCanceled":false,"policyName":"삼카레저퍼센트"}]},{"orderOptionId":1109302,"optionId":475771,"quantity":1,"salePrice":15000,"status":"NOT_USED","canceledDate":null,"optionName":"A-2. [소인] 야간 연간이용권","refundType":"REFUND_IN_7D","orderedOptionItem":[{"orderedOptionItemId":1447028,"itemId":78615,"name":"A-2. [소인] 야간 연간이용권","pinCode":"mock-pin-1447028","status":"NOT_USED","pinType":null}],"expiredType":"ON_PERIOD","expirationDate":null,"period":{"start":"2020-05-04","end":"2022-01-01","startDateTime":"2020-05-04 00:00:00","endDateTime":"2022-01-01 00:00:00"},"channelDiscounts":[{"createdDate":"2021-03-29 15:07:22","modifiedDate":"2021-03-29 15:07:22","id":103,"discountAmount":1200,"policyNo":7,"isCanceled":false,"policyName":"삼카레저퍼센트"}]}],"customerInfo":{"customerName":"이철웅","customerPhone":"01025178197","customerEmail":null,"visitorName":"이철웅","visitorPhone":"01025178197","visitorEmail":null},"salePrice":75000,"createdDate":"2021-03-29 15:07:22","category":null,"salesPeriod":{"start":"2020-05-04","end":"2021-11-30","startDateTime":"2020-05-04 00:00:00","endDateTime":"2021-11-30 23:59:00"},"dealPriceGroups":[{"id":31706,"dealId":53088,"name":"별빛정원우주 야간 연간입장권","description":"* 판매/유효기간: ~2020.05.31","sort":1,"dealOptionIds":[475770,475771]},{"id":31707,"dealId":53088,"name":"별빛정원우주 야간 입장권","description":"* 판매/유효기간: ~2020.05.31","sort":2,"dealOptionIds":[475772,475773]}],"hasPenalty":false,"dealName":"[경기 이천] 별빛정원우주 5월"},],"message":"","timestamp":"2021-04-12 16:40:04"} })
  });
}
/*
  레저 id로 예약내역 조회
*/
function getReserveLeisureById(params) {
  return axios.post('/api/leisureReserve/list/id', params);
}
/*
  레저 예약 취소
*/
function cancelLeisureReserve(params) {
  return axios.post('/api/leisureReserve/cancel', params);
}
/*
  판매자 정보
*/
function getSellerInfo(params) {
  return axios.post('/api/place/getsellerInfo', params);
}

function certification(params) {
  return new Promise(resolve => {
    resolve({ data: {"code":200,"result":{"result":"SUCCESS"} }});
  });
}

function certificationCheck(params) {
  return new Promise(resolve => {
    resolve({ data: {"code":200,"result":{"result":"SUCCESS"}} });
  })
}

function certificationReset(params) {
  return axios.post('/api/certification/reset', params);
}
/*
 숙소 추천 키워드
*/
function placeRecommendKeyword(params) {
  return axios.post('/api/place/getRecommendKeyword', params);
}
/*
 레저 추천 키워드
*/
function leisureRecommendKeyword(params) {
  return axios.post('/api/leisure/getRecommendKeyword', params);
}
/*
 기획전 상세 조회
*/
function getExhibitionContent(params) {
  return axios.post(`/api/${params.productType}/exhibitions/${params.exhibitionId}`, params);
}
function getExhibitionList(params) {
  return axios.post(`/api/${params.productType}/exhibitions`, params);
}
/*
 숙소 기획전 리스트 조회
*/
function getPlaceContents(params) {
  return new Promise(resolve => {
    resolve({ data: {"code":200,"result":{"exhibitionGroupList":[{"id":47,"title":"기획전","postStartDate":"2021-04-01","postEndDate":"2021-04-30","createdDate":"2021-04-07 18:12","exhibitionContents":[{"id":107,"title":"기획전 고도화 테스트중입니다.","promotionStartDate":"2021-02-01","promotionEndDate":"2021-12-31","createdDate":"2021-02-04 18:03","modifiedDate":"2021-04-08 14:37","productType":"PLACE","thumbnailTitle":"기획전","thumbnailExplanation":"기획전설명","thumbnailCategory":"카테고리","thumbnailImage": "/dummy.jpeg","exhibitionType":"HOTPICK"},{"id":107,"title":"기획전 고도화 테스트중입니다.","promotionStartDate":"2021-02-01","promotionEndDate":"2021-12-31","createdDate":"2021-02-04 18:03","modifiedDate":"2021-04-08 14:37","productType":"PLACE","thumbnailTitle":"기획전 제목","thumbnailExplanation":"기획전설명 길게길게 쓰면 이렇다","thumbnailCategory": "MD추천","thumbnailImage": "/dummy.jpeg","exhibitionType":"HOTPICK"}],"exhibitionType":"HOTPICK","string":"PLACE","open":true},],"hotPickGroupList":[{"id":47,"title":"[전용기획전]삼카 이벤트","postStartDate":"2021-04-01","postEndDate":"2021-04-30","createdDate":"2021-04-07 18:12","exhibitionContents":[{"id":107,"title":"","promotionStartDate":"2021-02-01","promotionEndDate":"2021-12-31","createdDate":"2021-02-04 18:03","modifiedDate":"2021-04-08 14:37","productType":"PLACE","thumbnailTitle":"기획전\n첫번째","thumbnailExplanation":"#기획전","thumbnailCategory":null,"thumbnailImage":null,"exhibitionType":"HOTPICK"},{"id":107,"title":"","promotionStartDate":"2021-02-01","promotionEndDate":"2021-12-31","createdDate":"2021-02-04 18:03","modifiedDate":"2021-04-08 14:37","productType":"PLACE","thumbnailTitle":"기획전\n첫번째","thumbnailExplanation":"#기획전","thumbnailCategory":null,"thumbnailImage":null,"exhibitionType":"HOTPICK"},{"id":107,"title":"","promotionStartDate":"2021-02-01","promotionEndDate":"2021-12-31","createdDate":"2021-02-04 18:03","modifiedDate":"2021-04-08 14:37","productType":"PLACE","thumbnailTitle":"기획전\n첫번째","thumbnailExplanation":"#기획전","thumbnailCategory":null,"thumbnailImage":null,"exhibitionType":"HOTPICK"},{"id":107,"title":"","promotionStartDate":"2021-02-01","promotionEndDate":"2021-12-31","createdDate":"2021-02-04 18:03","modifiedDate":"2021-04-08 14:37","productType":"PLACE","thumbnailTitle":"기획전\n첫번째","thumbnailExplanation":"#기획전","thumbnailCategory":null,"thumbnailImage":null,"exhibitionType":"HOTPICK"},{"id":107,"title":"","promotionStartDate":"2021-02-01","promotionEndDate":"2021-12-31","createdDate":"2021-02-04 18:03","modifiedDate":"2021-04-08 14:37","productType":"PLACE","thumbnailTitle":"기획전\n첫번째","thumbnailExplanation":"#기획전","thumbnailCategory":null,"thumbnailImage":null,"exhibitionType":"HOTPICK"}],"exhibitionType":"HOTPICK","string":"PLACE","open":true}, {"id":47,"title":"HOT PICK","postStartDate":"2021-04-01","postEndDate":"2021-04-30","createdDate":"2021-04-07 18:12","exhibitionContents":[{"id":107,"title":"","promotionStartDate":"2021-02-01","promotionEndDate":"2021-12-31","createdDate":"2021-02-04 18:03","modifiedDate":"2021-04-08 14:37","productType":"PLACE","thumbnailTitle":"기획전 첫번째","thumbnailExplanation":"#기획전","thumbnailCategory":null,"thumbnailImage": "/dummy.jpeg","exhibitionType":"HOTPICK"},{"id":107,"title":"","promotionStartDate":"2021-02-01","promotionEndDate":"2021-12-31","createdDate":"2021-02-04 18:03","modifiedDate":"2021-04-08 14:37","productType":"PLACE","thumbnailTitle":"기획전 첫번째","thumbnailExplanation":"#기획전","thumbnailCategory":null,"thumbnailImage": "/dummy.jpeg","exhibitionType":"HOTPICK"},{"id":107,"title":"","promotionStartDate":"2021-02-01","promotionEndDate":"2021-12-31","createdDate":"2021-02-04 18:03","modifiedDate":"2021-04-08 14:37","productType":"PLACE","thumbnailTitle":"기획전 첫번째","thumbnailExplanation":"#기획전","thumbnailCategory":null,"thumbnailImage": "/dummy.jpeg","exhibitionType":"HOTPICK"}],"exhibitionType":"HOTPICK","string":"PLACE","open":true}],"bannerGroupList":[{"id":14,"title":"이달의 추천 숙소","postStartDate":"2021-02-25","postEndDate":"2025-12-31","createdDate":"2021-02-25 18:28","bannerContents":[{"id":16,"productType":"PLACE","title":"해운대 센텀 호텔","explanation":null,"productId":3000620,"thumbnailImage":"/dummy.jpeg","createdDate":"2021-02-25 18:27","modifiedDate":"2021-02-26 13:52","thumbnailTitle":"해운대 센텀 호텔","thumbnailExplanation":"해운대 최적의 비즈니스 호텔","thumbnailCategory":"추천숙소"},{"id":17,"productType":"PLACE","title":"베니키아호텔 해운대","explanation":null,"productId":3001614,"thumbnailImage":"/dummy.jpeg","createdDate":"2021-02-26 13:32","modifiedDate":"2021-02-26 13:53","thumbnailTitle":"베니키아호텔 해운대","thumbnailExplanation":"해운대의 감흥을 베니키아호텔에서","thumbnailCategory":"추천숙소"},{"id":18,"productType":"PLACE","title":"프린스호텔 명동","explanation":null,"productId":3000619,"thumbnailImage":"/dummy.jpeg","createdDate":"2021-02-26 13:33","modifiedDate":"2021-02-26 13:53","thumbnailTitle":"프린스호텔 명동","thumbnailExplanation":"서울역과 명동에 인접한 최상의 호텔","thumbnailCategory":"숙소추천"},{"id":19,"productType":"PLACE","title":"센터마크호텔","explanation":null,"productId":3000592,"thumbnailImage":"/dummy.jpeg","createdDate":"2021-02-26 13:35","modifiedDate":"2021-02-26 13:53","thumbnailTitle":"센터마크 호텔","thumbnailExplanation":"서울역 근처 중심지 호텔","thumbnailCategory":"숙소추천"}],"productType":"PLACE","open":true}]},"message":"","timestamp":"2021-04-12 14:57:31"} });
  });
}
/*
 레저 기획전 리스트 조회
*/
function getLeisureContents(params) {
  return axios.post('/api/leisure/contents', params);
}
/*
 이제너두 회원인증 요청
*/
function getEtbsUserInfo(params) {
  return axios.post('/api/channel/etbs/getUserInfo', params);
}

function getEtbsOrderId(params) {
  return axios.post('/api/channel/etbs/getOrderId', params);
}

function etbsCancel(params) {
  return axios.post('/api/channel/etbs/cancel/payment', params);
}

function etbsCancelPenalty(params) {
  return axios.post('/api/channel/etbs/cancel/payment/penalty', params);
}

function channelCancelReserve(id, params) {
  return axios.post(`/api/channel/cancel/reserve/${id}`, params);
}

function channelSave(params) {
  return axios.post('/api/certification/save', params);
}

function getReceipt(id, params) {
  return axios.post(`/api/receipts/${id}`, params);
}

function slackPayNotice(params) {
  return axios.post('/api/slack-notice', params);
}

function getDiscountInfo(params) {
  return new Promise(resolve => {
    resolve({ data: { result: [{
          id: 6,
          maxDiscountAmount: null,
          minItemPrice: 10000,
          moneyDiscount: {
            discountAmount: null,
            moneyChanalChargePercent: 0,
          },
          discountAmount:null,
          moneyChanalChargePercent: 0,
          percentDiscount: {
            discountPercent:10,
            percentChanalChargePercent:50,
          },
          discountPercent: 10,
          policyName: '',

        }] } });
  })
}

function sendApi(path, query, body) {
  const queryString = query && typeof query === 'object' ? Object.keys(query).map((v) => `${v}=${query[v]}`).join('&') : '';
  const url = `/api${path}${queryString ? `?${queryString}` : ''}`;
  return axios.post(url, body);
}

export default {
  getPlaceList,
  getPlaceListByLocation,
  getPlace,
  checkVehicle,
  getCoupons,
  checkReservePlace,
  getReservePlaceList,
  cancelPlaceReserve,
  getPlaceCancelFee,
  deleteReserve,
  placeAutocomplete,
  apiStatus,
  getLeisureList,
  getLeisureRegionCategory,
  getLeisure,
  leisureAutoComplete,
  getLeisureAsLocation,
  reserveLeisure,
  getReserveLeisureList,
  getLeisureCategory,
  getLeisureRegion,
  getPlaceReviews,
  getPlaceReviewsBatch,
  publishCoupon,
  cancelLeisureReserve,
  getSellerInfo,
  certification,
  certificationCheck,
  certificationReset,
  getReservePlaceById,
  getReserveLeisureById,
  getEtbsUserInfo,
  placeRecommendKeyword,
  leisureRecommendKeyword,
  getExhibitionList,
  getPlaceContents,
  getLeisureContents,
  getEtbsOrderId,
  etbsCancel,
  channelCancelReserve,
  channelSave,
  getExhibitionContent,
  getReceipt,
  etbsCancelPenalty,
  slackPayNotice,
  getDiscountInfo,
  sendApi,
};

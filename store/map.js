export const state = () => ({
  objMapMarker: {
    status: 'loading',
    list: [],
  },
});

export const mutations = {
  setMarkerActive(state, index) {
    if (state.objMapMarker.list[index]) {
      state.objMapMarker.list[index].active = !state.objMapMarker.list[index].active;
    }
  },
  clearActiveMarker(state) {
    state.objMapMarker.list = state.objMapMarker.list.map((obj) => ({ ...obj, active: false }));
  },
  setMarkerStatus(state, status) {
    state.objMapMarker.status = status;
  },
  saveMarkerList(state, arrMarkerList) {
    state.objMapMarker.list = arrMarkerList;
  },
  setMarkerList(state, objMarkerList) {
    let arrList = [];
    if (objMarkerList.type === 'place') {
      arrList = objMarkerList.list.map((objList) => ({
        position: {
          lat: objList.geoPoint.lat,
          lng: objList.geoPoint.lon,
        },
        active: false,
        info: {
          id: objList.no,
          image: objList.thumbUrl || objList.imageUrl,
          category: objList.category,
          name: objList.name,
          originPrice: objList.minPrice,
          salePrice: objList.minDiscountPrice,
          discountPercent: objList.minPrice && objList.salePrice ? parseInt(((objList.minPrice - (objList.minDiscountPrice || 0)) / objList.minPrice) * 100, 10) : '',
          rating: objList.star && objList.star.rating ? objList.star.rating : '',
          review: objList.review && objList.review.count ? objList.review.count : '',
        },
      }));
    } else {
      arrList = objMarkerList.list.map((objList) => ({
        position: {
          lat: objList.geoPoint.lat,
          lng: objList.geoPoint.lon,
        },
        active: false,
        info: {
          id: objList.id,
          image: objList.image,
          category: objList.categoryName,
          name: objList.name,
          originPrice: objList.minPrice.coverPrice || '',
          salePrice: objList.minPrice.gajagoSalePrice || objList.minPrice.coverPrice,
          discountPercent: objList.minPrice.coverPrice && objList.minPrice.gajagoSalePrice && objList.minPrice.coverPrice !== objList.minPrice.gajagoSalePrice ? Math.ceil((objList.minPrice.coverPrice - objList.minPrice.gajagoSalePrice) / objList.minPrice.coverPrice * 100) : '',
        },
      }));
    }
    state.objMapMarker.list = arrList;
  },
};

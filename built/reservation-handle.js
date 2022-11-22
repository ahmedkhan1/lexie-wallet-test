"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReservationHandle {
    constructor(addressList) {
        this.coinAdsLst = [];
        this.reserved = false;
        if (addressList === null || addressList === void 0 ? void 0 : addressList.length)
            this.reserve(addressList);
    }
    reserve(addressList) {
        this.reserved = true;
        this.coinAdsLst = [...addressList];
    }
    showReserved() {
        return [...this.coinAdsLst];
    }
    cancelReservation(coinAds) {
        const coinAdsIndex = this.coinAdsLst.findIndex(el => el === coinAds);
        if (coinAdsIndex !== null)
            this.coinAdsLst.splice(coinAdsIndex, 1);
        this.reserved = false;
    }
}
exports.default = ReservationHandle;

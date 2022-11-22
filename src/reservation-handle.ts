class ReservationHandle {
  private coinAdsLst: Array<string> = [];

  public reserved: boolean = false;

  constructor(addressList?: string[]) {
    if (addressList?.length) this.reserve(addressList);
  }

  reserve(addressList: string[]) {
    this.reserved = true;
    this.coinAdsLst = [...addressList];
  }

  showReserved() {
    return [...this.coinAdsLst];
  }

  cancelReservation(coinAds: string) {
    const coinAdsIndex = this.coinAdsLst.findIndex((el) => el === coinAds);
    if (coinAdsIndex !== null) this.coinAdsLst.splice(coinAdsIndex, 1);
    this.reserved = false;
  }
}

export default ReservationHandle;

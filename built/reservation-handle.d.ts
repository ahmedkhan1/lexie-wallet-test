declare class ReservationHandle {
    private coinAdsLst;
    reserved: boolean;
    constructor(addressList?: string[]);
    reserve(addressList: string[]): void;
    showReserved(): string[];
    cancelReservation(coinAds: string): void;
}
export default ReservationHandle;

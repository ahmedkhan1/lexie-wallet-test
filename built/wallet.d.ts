import Coin from './coin';
import Distribution from './distribution';
import ReservationHandle from './reservation-handle';
declare class Wallet {
    private coins;
    private reservedCoins;
    constructor(coins: Array<Coin>);
    available(): number;
    add(coin: Coin): void;
    distribution(scale: number): Distribution;
    spend(amount: number): Array<Coin>;
    reserve(amount: number): ReservationHandle;
    reservationSpend(reservation: string[]): Array<Coin>;
    reservationCancel(reservation: string[]): boolean;
    private findSpendAmountCoins;
}
export default Wallet;

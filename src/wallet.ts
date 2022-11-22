import Coin from './coin';
import Distribution from './distribution';
import ReservationHandle from './reservation-handle';

// The Wallet Class
class Wallet {
  private coins: Array<Coin>;

  private reservedCoins: any;

  constructor(coins: Array<Coin>) {
    // 1_234, 5, 67, 1_000_001
    this.coins = coins;
  }

  //* *******************************************************************************
  // Part 1 : API
  //* *******************************************************************************

  //* *******************************************************************************
  // Part 1.1: return the total amount of coins available in this wallet
  //* *******************************************************************************
  public available(): number {
    return this.coins.length;
  }

  //* *******************************************************************************
  // Part 1.2: Add coins to this wallet
  //
  // We want the ability to reserve
  //* *******************************************************************************
  public add(coin: Coin) {
    this.coins.push(coin);
  }

  //* *******************************************************************************
  // Part 1.3: Distribution of coins
  //
  // We want to be able to categorize the coins scale distribution we have in the wallet.
  //
  // For example, using a scale of 1000, we want to categorize in bucket of the following range:
  //
  // * bucket[0] : 0 .. 999
  // * bucket[1] : 1_000 .. 999_999
  // * bucket[2] : 1_000_000 .. 999_999_999.
  // * bucket[3] : etc
  //
  // Given the following wallet coins: [1_234, 5, 67, 1_000_001] should result in the following:
  // * bucket[0] : [5, 67]
  // * bucket[1] : [1_234]
  // * bucket[2] : [1_000_001]
  //* *******************************************************************************
  public distribution(scale: number): Distribution {
    const coins: number[] = this.coins.map((coin: Coin) => coin.value);
    const totalCoins: number = coins.length;
    const min: number = Math.min(...coins);
    const buckets: number[][] = Array.from(new Array(totalCoins), () => []);
    const bucketsList: any[] = [];

    for (let i = 0; i < totalCoins; i += 1) {
      const idx = Math.floor(((coins[i] - min) / scale));
      if (idx <= totalCoins) buckets[idx].push(coins[i]);
      else buckets[i].push(coins[i]);
    }

    this.coins.forEach((_, i) => {
      const list:any[] = [];
      buckets[i].sort((a, b) => a - b)
        .forEach((__, j) => {
          const result = this.coins.find(
            (coin) => coin.value === buckets[i][j],
          );
          list.push(result);
        });
      if (list.length !== 0) bucketsList.push(list);
    });

    return new Distribution(bucketsList);
  }

  //* *******************************************************************************
  // Part 1.4: Spending from this wallet a specific amount
  //
  // Try to construct a valid result where the sum of coins return are above the requested
  // amount, and try to stay close to the amount as possible. Explain your choice of
  // algorithm.
  //
  // If the requested cannot be satisfied then an error should be return.
  //* *******************************************************************************
  public spend(amount: number): Array<Coin> {
    const spendAmountCoins = this.findSpendAmountCoins(amount);

    if (spendAmountCoins && (amount <= spendAmountCoins.sum)) {
      const { indexI, indexJ } = spendAmountCoins;
      if (indexI > indexJ) {
        this.coins[indexI].value -= amount;
      } else {
        this.coins[indexJ].value -= amount;
      }
      return this.coins;
    }
    throw new Error('Spend Error: Insufficient funds in the wallet.');
  }

  //* *******************************************************************************
  // Part 1.5: Reserving assets
  //
  // In certain cases, it's important to consider that some coins need to be reserved;
  // for example we want to put aside some coins from a wallet while
  // we conduct other verification, so that once we really want to spend, we
  //
  // We need a way to reserve and keep a handle of this reservation; this works very similarly
  // to the previous part (1.4) except that the fund are kept in the wallet and reserved
  // until the user either 'cancel' or 'spend' this reservation.
  //
  // With cancel, the locked coins are returned to the available funds
  // With spend, the locked coins are remove from the wallet and given to the user
  //* *******************************************************************************
  public reserve(amount: number): ReservationHandle {
    const spendAmountCoins = this.findSpendAmountCoins(amount);

    if (spendAmountCoins && (amount <= spendAmountCoins.sum)) {
      this.reservedCoins = new ReservationHandle([
        spendAmountCoins.valueIAds,
        spendAmountCoins.valueJAds,
      ]);
      this.reservedCoins.reserved = true;
      return this.reservedCoins;
    }
    throw new Error('Spend Error: Insufficient funds in the wallet.');
  }

  public reservationSpend(reservation: string[]): Array<Coin> {
    const result = this.reservationCancel(reservation);
    if (!result) return [];

    const spentCoins = [];
    for (let i = 0; i < reservation.length; i += 1) {
      const coinIndex = this.coins.findIndex((ads) => ads.address === reservation[i]);
      if (coinIndex) {
        spentCoins.push(this.coins[coinIndex]);
        this.coins.splice(coinIndex, 1);
      }
    }
    return spentCoins;
  }

  public reservationCancel(reservation: string[]) {
    if (!this.reservedCoins?.reserved) return false;

    const resevedCoinsLst = this.reservedCoins.showReserved();
    for (let i = 0; i < resevedCoinsLst.length; i += 1) {
      const result = reservation.find((ads) => ads === resevedCoinsLst[i]);
      if (result) this.reservedCoins.cancelReservation(result);
    }

    return (this.reservedCoins.showReserved().length === 0);
  }

  private findSpendAmountCoins(amount: number) {
    const buckets = this.coins;
    const maxList = [];
    let result = {
      indexI: 0,
      indexJ: 0,
      sum: 0,
      diff: 0,
      valueI: 0,
      valueJ: 0,
      valueIAds: '',
      valueJAds: '',
    };

    for (let i = 0; i < buckets.length; i += 1) {
      for (let j = buckets.length - 1; j >= 0; j -= 1) {
        maxList.push({
          indexI: i,
          indexJ: j,
          sum: buckets[i].value + buckets[j].value,
          diff: Math.abs((buckets[i].value + buckets[j].value) - amount),
          valueI: buckets[i].value,
          valueIAds: buckets[i].address,
          valueJ: buckets[j].value,
          valueJAds: buckets[j].address,
        });
      }
    }

    maxList.sort((a, b) => {
      if (a.diff < b.diff) return -1;
      if (a.diff > b.diff) return 1;
      return 0;
    });
    const uniqList = maxList.filter((v, i, a) => a.findIndex((v2) => (v2.diff === v.diff)) === i);

    for (let i = 0; i < uniqList.length; i += 1) {
      if (uniqList[i].diff >= amount) {
        result = uniqList[i];
        break;
      }
    }
    return result;
  }
}

export default Wallet;

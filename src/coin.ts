// Represent a specific value of a coin
class Coin {
  public address: string;

  public value: number;

  constructor(value: number) {
    this.address = (Math.random() * 1e64).toString(36);
    this.value = value;
  }
}

export default Coin;

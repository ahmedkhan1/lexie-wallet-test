import Coin from './coin';
declare class Distribution {
    buckets: Array<Array<Coin>>;
    constructor(value: Array<Array<Coin>>);
}
export default Distribution;

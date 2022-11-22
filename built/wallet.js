"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const distribution_1 = __importDefault(require("./distribution"));
const reservation_handle_1 = __importDefault(require("./reservation-handle"));
class Wallet {
    constructor(coins) {
        this.coins = coins;
    }
    available() {
        return this.coins.length;
    }
    add(coin) {
        this.coins.push(coin);
    }
    distribution(scale) {
        const coins = this.coins.map(coin => coin['value']);
        const totalCoins = coins.length;
        const min = Math.min(...coins);
        let buckets = Array.from(new Array(totalCoins), function () { return []; });
        let bucketsList = new Array();
        for (let i = 0; i < totalCoins; i++) {
            const idx = Math.floor(((coins[i] - min) / scale));
            if (idx <= totalCoins)
                buckets[idx].push(coins[i]);
            else
                buckets[i].push(coins[i]);
        }
        this.coins.forEach((_, i) => {
            let list = new Array();
            buckets[i].sort((a, b) => a - b)
                .forEach((_, j) => {
                const result = this.coins.find(coin => coin['value'] === buckets[i][j]);
                list.push(result);
            });
            if (list.length !== 0)
                bucketsList.push(list);
        });
        return new distribution_1.default(bucketsList);
    }
    spend(amount) {
        const spendAmountCoins = this.findSpendAmountCoins(amount);
        if (spendAmountCoins && (amount <= spendAmountCoins.sum)) {
            const { indexI, indexJ } = spendAmountCoins;
            if (indexI > indexJ)
                this.coins[indexI]['value'] = this.coins[indexI]['value'] - amount;
            else
                this.coins[indexJ]['value'] = this.coins[indexJ]['value'] - amount;
            return this.coins;
        }
        else {
            throw new Error('Spend Error: Insufficient funds in the wallet.');
        }
    }
    reserve(amount) {
        const spendAmountCoins = this.findSpendAmountCoins(amount);
        if (spendAmountCoins && (amount <= spendAmountCoins.sum)) {
            this.reservedCoins = new reservation_handle_1.default([
                spendAmountCoins.valueIAds,
                spendAmountCoins.valueJAds
            ]);
            this.reservedCoins.reserved = true;
            return this.reservedCoins;
        }
        else {
            throw new Error('Spend Error: Insufficient funds in the wallet.');
        }
    }
    reservationSpend(reservation) {
        const result = this.reservationCancel(reservation);
        if (!result)
            return [];
        let spentCoins = [];
        for (var i = 0; i < reservation.length; i++) {
            const coinIndex = this.coins.findIndex(ads => ads.address === reservation[i]);
            if (coinIndex) {
                spentCoins.push(this.coins[coinIndex]);
                this.coins.splice(coinIndex, 1);
            }
        }
        return spentCoins;
    }
    reservationCancel(reservation) {
        var _a;
        if (!((_a = this.reservedCoins) === null || _a === void 0 ? void 0 : _a.reserved))
            return false;
        const resevedCoinsLst = this.reservedCoins.showReserved();
        for (var i = 0; i < resevedCoinsLst.length; i++) {
            const result = reservation.find(ads => ads === resevedCoinsLst[i]);
            if (result)
                this.reservedCoins.cancelReservation(result);
        }
        return (this.reservedCoins.showReserved().length === 0) ? true : false;
    }
    findSpendAmountCoins(amount) {
        const buckets = this.coins;
        let maxList = [];
        let result = {
            indexI: 0,
            indexJ: 0,
            sum: 0,
            diff: 0,
            valueI: 0,
            valueJ: 0,
            valueIAds: "",
            valueJAds: ""
        };
        for (let i = 0; i < buckets.length; i++) {
            for (let j = buckets.length - 1; j >= 0; j--) {
                maxList.push({
                    indexI: i,
                    indexJ: j,
                    sum: buckets[i]['value'] + buckets[j]['value'],
                    diff: Math.abs((buckets[i]['value'] + buckets[j]['value']) - amount),
                    valueI: buckets[i]['value'],
                    valueIAds: buckets[i]['address'],
                    valueJ: buckets[j]['value'],
                    valueJAds: buckets[j]['address'],
                });
            }
        }
        maxList.sort((a, b) => (a.diff < b.diff) ? -1 : (a.diff > b.diff) ? 1 : 0);
        const uniqList = maxList.filter((v, i, a) => a.findIndex(v2 => (v2.diff === v.diff)) === i);
        for (let i = 0; i < uniqList.length; i++) {
            if (uniqList[i].diff >= amount) {
                result = uniqList[i];
                break;
            }
        }
        return result;
    }
}
exports.default = Wallet;

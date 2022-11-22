"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wallet_1 = __importDefault(require("./wallet"));
const coin_1 = __importDefault(require("./coin"));
const router = express_1.default.Router();
const coinList = [
    new coin_1.default(1234),
    new coin_1.default(5),
    new coin_1.default(67),
    new coin_1.default(1000001)
];
const wallet = new wallet_1.default(coinList);
router.get('/coins', (req, res) => {
    const coinValue = wallet.available();
    res.json({
        status: 200,
        message: "Ok",
        data: { coins: coinValue },
    });
});
router.post('/coins', (req, res) => {
    const { value } = req.body;
    const newCoin = new coin_1.default(value);
    wallet.add(newCoin);
    res.json({
        status: 200,
        message: "Coin added successfully"
    });
});
router.get('/distribution', (req, res) => {
    const { scale } = req.body;
    const distributedCoinsList = wallet.distribution(scale);
    res.json({
        status: 200,
        message: "Ok",
        data: { coinList: distributedCoinsList },
    });
});
router.post('/spend', (req, res) => {
    const { spendAmount } = req.body;
    const spend = wallet.spend(spendAmount);
    res.json({
        status: 200,
        data: {
            spendAmount,
            remaingCoins: spend,
            message: "Amount spend successfully"
        },
    });
});
router.put('/reserve', (req, res) => {
    const { reserveAmount } = req.body;
    const reservedCoins = wallet.reserve(reserveAmount);
    res.json({
        status: 200,
        message: "Amount reserved successfully",
        data: { reservedCoins },
    });
});
router.post('/reserve/spend', (req, res) => {
    const { reservedList } = req.body;
    const spend = wallet.reservationSpend(reservedList);
    res.json({
        status: 200,
        message: "Reserved Amount spend successfully",
        data: { spend },
    });
});
router.put('/reserve/cancel', (req, res) => {
    const { reservedList } = req.body;
    const result = wallet.reservationCancel(reservedList);
    if (result) {
        res.json({
            status: 200,
            message: "Reserved Coins removed successfully ",
        });
    }
    else {
        res.json({
            status: 200,
            message: "Failed to remove reserved coins ",
        });
    }
});
exports.default = router;

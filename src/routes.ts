import express from 'express';
import Wallet from './wallet';
import Coin from './coin';

const router = express.Router();
const coinList = [
  new Coin(1_234),
  new Coin(5),
  new Coin(67),
  new Coin(1_000_001),
];
const wallet = new Wallet(coinList);

router.get('/coins', (_, res) => {
  const coinValue = wallet.available();
  res.json({
    status: 200,
    message: 'Ok',
    data: { coins: coinValue },
  });
});

router.post('/coins', (req, res) => {
  const { value } = req.body;
  const newCoin = new Coin(value);
  wallet.add(newCoin);
  res.json({
    status: 200,
    message: 'Coin added successfully',
  });
});

router.get('/distribution', (req, res) => {
  const { scale } = req.body;
  const distributedCoinsList = wallet.distribution(scale);
  res.json({
    status: 200,
    message: 'Ok',
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
      message: 'Amount spend successfully',
    },
  });
});

router.put('/reserve', (req, res) => {
  const { reserveAmount } = req.body;
  const reservedCoins = wallet.reserve(reserveAmount);
  res.json({
    status: 200,
    message: 'Amount reserved successfully',
    data: { reservedCoins },
  });
});

router.post('/reserve/spend', (req, res) => {
  const { reservedList } = req.body;
  const spend = wallet.reservationSpend(reservedList);
  res.json({
    status: 200,
    message: 'Reserved Amount spend successfully',
    data: { spend },
  });
});

router.put('/reserve/cancel', (req, res) => {
  const { reservedList } = req.body;
  const result = wallet.reservationCancel(reservedList);
  if (result) {
    res.json({
      status: 200,
      message: 'Reserved Coins removed successfully ',
    });
  } else {
    res.json({
      status: 200,
      message: 'Failed to remove reserved coins ',
    });
  }
});

export default router;

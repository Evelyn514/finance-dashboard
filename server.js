const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.static('public'));

const endpoints = {
  US10Y: 'https://query1.finance.yahoo.com/v8/finance/chart/^TNX?interval=1d&range=1d',
  DXY: 'https://query1.finance.yahoo.com/v8/finance/chart/DX-Y.NYB?interval=1d&range=1d',
  USDTWD: 'https://query1.finance.yahoo.com/v8/finance/chart/USDTWD=X?interval=1d&range=1d',
  USDKRW: 'https://query1.finance.yahoo.com/v8/finance/chart/USDKRW=X?interval=1d&range=1d'
};

app.get('/price/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  const url = endpoints[symbol];
  if (!url) return res.status(400).json({ error: 'Unknown symbol' });

  try {
    const { data } = await axios.get(url);
    const result = data.chart?.result?.[0];
    const price = result?.meta?.regularMarketPrice;

    if (price === undefined) {
      return res.status(500).json({ error: 'Price not found in response' });
    }

    const formatted = symbol === 'US10Y' ? price.toFixed(3) + '%' : price.toFixed(3);
    res.json({ symbol, price: formatted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
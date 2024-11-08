export default function initTickerTape() {
  const script = document.createElement('script')
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
  script.async = true
  script.textContent = `
    {
      "symbols": [
        {
          "proName": "BITSTAMP:BTCUSD",
          "title": "Bitcoin"
        },
        {
          "proName": "BITSTAMP:ETHUSD",
          "title": "Ethereum"
        },
        {
          "proName": "BINANCE:BNBUSDT",
          "title": "Binance Coin"
        },
        {
          "proName": "COINBASE:SOLUSD",
          "title": "Solana"
        },
        {
          "proName": "BINANCE:ADAUSDT",
          "title": "Cardano"
        }
      ],
      "showSymbolLogo": true,
      "colorTheme": "light",
      "isTransparent": false,
      "displayMode": "adaptive",
      "locale": "en"
    }
  `
  return script
}

import React, { useEffect, useState } from 'react';
import  refresh from '../../assets/reload-svgrepo-com.svg';

type Crypto = 'USDT' | 'BTC' | 'ETH' | 'XRP' | 'BNB';


const ExchangeRates: React.FC = () => {
  const [selectedCryptoFrom, setSelectedCryptoFrom] = useState('BTC');
  const [selectedCryptoTo, setSelectedCryptoTo] = useState('USDT');
  const [exchangeRateFrom, setExchangeRateFrom] = useState(0);
  const [exchangeRateTo, setExchangeRateTo] = useState(0);
  
  const cryptos: Crypto[] = ['USDT', 'BTC', 'ETH', 'XRP', 'BNB'];
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const wsFrom = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedCryptoFrom.toLowerCase()}usdt@trade`);
    const wsTo = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedCryptoTo.toLowerCase()}usdt@trade`);
  
    wsFrom.onopen = () => {
      console.log(`WebSocket connection for ${selectedCryptoFrom} exchange rate established.`);
    };
  
    wsFrom.onmessage = (event) => {
      const jsonData = JSON.parse(event.data);
      setExchangeRateFrom(parseFloat(jsonData.p));
    };
  
    wsFrom.onclose = () => {
      console.log(`WebSocket connection for ${selectedCryptoFrom} exchange rate closed.`);
    };
  
    wsTo.onopen = () => {
      console.log(`WebSocket connection for ${selectedCryptoTo} exchange rate established.`);
    };
  
    wsTo.onmessage = (event) => {
      const jsonData = JSON.parse(event.data);
      setExchangeRateTo(parseFloat(jsonData.p));
    };
  
    wsTo.onclose = () => {
      console.log(`WebSocket connection for ${selectedCryptoTo} exchange rate closed.`);
    };
  
    return () => {
      wsFrom.close();
      wsTo.close();
    };
  }, [selectedCryptoFrom, selectedCryptoTo]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseFloat(e.target.value));
  };

  const swapCurrencies = () => {
    setSelectedCryptoFrom(selectedCryptoTo);
    setSelectedCryptoTo(selectedCryptoFrom);
  };


  const calculateAmount = () => {
    if (isNaN(quantity)) {
      return 0;
    }

    if (selectedCryptoTo === 'USDT' && selectedCryptoFrom === 'USDT') {
      return quantity;
    }

    if (selectedCryptoTo === 'USDT') {
      return exchangeRateFrom * quantity;
    }

    if (selectedCryptoFrom === 'USDT') {
      return quantity / exchangeRateTo;
    }

    if (exchangeRateFrom && exchangeRateTo && quantity) {
      const conversionRate = exchangeRateFrom / exchangeRateTo;
      return quantity * conversionRate;
    }

    return 0;
  };
  

 return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <label 
            htmlFor="cryptoCurrencyFrom" 
            className="block font-semibold text-gray-700 mb-2"
          >
            Choose a cryptocurrency:
          </label>

          <select
            id="cryptoCurrencyFrom"
            name="cryptoCurrencyFrom"
            className="w-full border rounded-md p-2"
            value={selectedCryptoFrom}
            onChange={(e) => setSelectedCryptoFrom(e.target.value)}
          >
            {cryptos.map((crypto) => (
              <option key={crypto} value={crypto}>{crypto}</option>
            ))}
          </select>
        </div>

        <div className="mx-4 hover:text-blue-500 cursor-pointer" onClick={swapCurrencies}>
         <img 
          className="h-6 w-6 text-gray-500 transition-colors duration-300 hover:scale-110" 
          src={refresh} alt='refresh' 
        />
        </div>

        <div>
          <label 
            htmlFor="cryptoCurrencyTo" 
            className="block font-semibold text-gray-700 mb-2"
          >
            Select the currency to exchange:
          </label>

          <select
            id="cryptoCurrencyTo"
            name="cryptoCurrencyTo"
            className="w-full border rounded-md p-2"
            value={selectedCryptoTo}
            onChange={(e) => setSelectedCryptoTo(e.target.value)}
          >
            {cryptos.map((crypto) => (
              <option key={crypto} value={crypto}>{crypto}</option>
            ))}
          </select>
        </div>
      </div>

      <label 
        htmlFor="quantity" 
        className="block font-semibold text-gray-700 mt-4 mb-2"
      >
        Enter the quantity {selectedCryptoFrom}:
      </label>

      <input
        id="quantity"
        name="quantity"
        type="number"
        className="w-full border rounded-md p-2"
        value={quantity}
        onChange={handleQuantityChange}
      />

      <label 
        htmlFor="amount" 
        className="block font-semibold text-gray-700 mt-4 mb-2"
      >
        You will get {selectedCryptoTo}:
      </label>

      <input
        id="amount"
        name="amount"
        type="text"
        className="w-full border rounded-md p-2"
        value={calculateAmount()}
        readOnly
      />

      <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
        Exchange
      </button>
  </div>
  );
};

export default ExchangeRates;

import axios from "axios";

export const convertCurrency = () => {
  const apikey = process.env.REACT_APP_YOUR_API_KEY;
  const currencyConversionRates = axios
    .get("https://api.freecurrencyapi.com/v1/lates", {
      params: {
        apikey,
        base_currency: "USD",
        currencies: "USD,GBP,JPY,CAD,AUD,SGD,CNY",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));

  return currencyConversionRates;
};

export const convertPrice = (priceUSD, current, rates) => {
  return (priceUSD * rates[current]).toFixed(2);
};

export const convertToUSD = (price, current, rates) => {
  return (price / rates[current]).toFixed(2);
};

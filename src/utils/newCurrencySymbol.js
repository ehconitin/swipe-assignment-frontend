export const newCurrencySymbol = (currency) => {
  let newCurrencySymbol = "$";
  switch (currency) {
    case "USD":
      newCurrencySymbol = "$";
      break;
    case "GBP":
      newCurrencySymbol = "£";
      break;
    case "AUD":
      newCurrencySymbol = "$";
      break;
    case "CAD":
      newCurrencySymbol = "$";
      break;
    case "CNY":
      newCurrencySymbol = "¥";
      break;
    case "JPY":
      newCurrencySymbol = "¥";
      break;
    case "SGD":
      newCurrencySymbol = "$";
      break;
    default:
      newCurrencySymbol = "$";
      break;
  }
  return newCurrencySymbol;
};

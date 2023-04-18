type UrlLink = string;
type ApiKey = string;
const API_KEY: ApiKey | undefined = process.env.REACT_APP_FX_API;
const STOCK_API: ApiKey | undefined = process.env.REACT_APP_STOCK_API;

// fetch statements for the Forex Exhange

const getResponse = async (apiUrl: UrlLink, resName: string) => {
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${resName}`);
  return res.json();
};

export async function getCurrencyList() {
  const CURRENCY_URL: UrlLink = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

  const res = await getResponse(CURRENCY_URL, "Currency List");
  return res;
}

export async function getExchangeRate({
  primaryCurrency,
  secondaryCurrency,
}: {
  primaryCurrency: string;
  secondaryCurrency: string;
}) {
  const EXCHANGE_URL: UrlLink = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${primaryCurrency}/${secondaryCurrency}`;

  const res = await getResponse(EXCHANGE_URL, "Exchange Rate");
  return res;
}

// fetch statements for the Stock Exchange

export async function getSearchResult({
  searchInput,
}: {
  searchInput: string;
}) {
  const SEARCH_URL: UrlLink = `https://api.twelvedata.com/symbol_search?symbol=${searchInput}`;

  const res = await getResponse(SEARCH_URL, "Stock search result");
  return res;
}

export async function getStockPrice({
  selectedSymbol,
}: {
  selectedSymbol: string;
}) {
  const PRICE_URL: UrlLink = `https://api.twelvedata.com/price?symbol=${selectedSymbol}&apikey=${STOCK_API}`;

  const res = await getResponse(PRICE_URL, "Stock Price");
  return res;
}

export async function getStockDetails({
  selectedSymbol,
}: {
  selectedSymbol: string;
}) {
  const DETAILS_URL: UrlLink = `https://api.twelvedata.com/quote?symbol=${selectedSymbol}&apikey=${STOCK_API}`;

  const res = await getResponse(DETAILS_URL, "Stock Details");
  return res;
}

//TODO export the values as named exports or see if they can work as normal default export

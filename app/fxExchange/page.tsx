import AssetRow from "@/lib/assetRow";
import { getCurrencyList, getExchangeRate } from "@/lib/apiCalls";
import { useEffect, useState } from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Typography } from "@mui/material";

export default function FxExhange() {
  const [amount, setAmount] = useState<string>("1");
  const [currencyOptions, setCurrencyOptions] = useState<string[]>([]);
  const [primaryCurrency, setPrimaryCurrency] = useState<string>("USD");
  const [secondaryCurrency, setSecondaryCurrency] = useState<string>("AED");
  const [amountFromPrimary, setAmountFromPrimary] = useState<boolean>(true);
  const [rate, setRate] = useState<string>("");

  useEffect(() => {
    getCurrencyList()
      .then((res) => res.json())
      .then((resJson) => {
        const currency = Object.keys(resJson.conversion_rates)[1];
        setCurrencyOptions([...Object.keys(resJson.conversion_rates)]);
        setPrimaryCurrency(resJson.base_code);
        setSecondaryCurrency(currency);
        setRate(resJson.conversion_rates[currency]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (primaryCurrency != null && secondaryCurrency != null) {
      getExchangeRate({ primaryCurrency, secondaryCurrency })
        .then((res) => res.json())
        .then((resJson) => setRate(resJson.conversion_rate));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryCurrency, secondaryCurrency]);

  const formatNum = (num: number): number => {
    return +num.toFixed(2);
  };

  let primaryAmount: number, secondaryAmount: number;
  if (amountFromPrimary) {
    primaryAmount = formatNum(+amount);
    secondaryAmount = formatNum(+amount * +rate);
  } else {
    secondaryAmount = formatNum(+amount);
    primaryAmount = formatNum(+amount / +rate);
  }

  const handlePrimaryAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmount(e.target.value);
    setAmountFromPrimary(true);
  };

  const handleSecondaryAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmount(e.target.value);
    setAmountFromPrimary(false);
  };

  return <main></main>;
}

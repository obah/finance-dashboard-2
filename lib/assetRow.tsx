import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
  SelectChangeEvent,
} from "@mui/material";

export default function AssetRow({
  currencyOptions,
  selectedCurrency,
  onChangeCurrency,
  amount,
  onChangeAmount,
}: {
  currencyOptions: string[];
  selectedCurrency: string;
  onChangeCurrency: (e: SelectChangeEvent) => void;
  amount: number;
  onChangeAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Box sx={{ marginTop: 1, marginBottom: 1 }}>
      <TextField
        variant="outlined"
        type="number"
        value={amount}
        onChange={onChangeAmount}
      />
      <FormControl variant="filled" sx={{ minWidth: 100 }}>
        <Select value={selectedCurrency} onChange={onChangeCurrency}>
          {currencyOptions?.map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

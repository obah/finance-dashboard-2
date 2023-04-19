import {
  Autocomplete,
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import {
  getSearchResult,
  getStockPrice,
  getStockDetails,
} from "@/lib/apiCalls";

type MuiObject = {
  expand?: boolean;
};

const ExpandMore = styled((props: MuiObject) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function StockEchange() {
  const [searchResult, setSearchResult] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedStock, setSelectedStock] = useState<string | null>("");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [stockPrice, setStockPrice] = useState<string>("");
  const [stockName, setStockName] = useState<string>("");
  const [stockChange, setStockChange] = useState<string>("");
  const [stockPercentChange, setStockPercentChange] = useState<string>("");
  const [stockOpen, setStockOpen] = useState<string>("");
  const [stockHigh, setStockHigh] = useState<string>("");
  const [stockLow, setStockLow] = useState<string>("");
  const [stockVolume, setStockVolume] = useState<string>("");
  const [stockWkHigh, setStockWkHigh] = useState<string>("");
  const [stockWkLow, setStockWkLow] = useState<string>("");

  const [expanded, setExpanded] = useState(false);

  //handle search input and get the results
  useEffect(() => {
    getSearchResult({ searchInput }).then((resJson) => {
      let searchResultsArray: string[] = [];
      let searchResults: string = resJson.data
        .filter(
          (
            value: StockSearchResData,
            index: number,
            self: StockSearchResData[]
          ): boolean =>
            index ===
            self.findIndex(
              (_value: StockSearchResData) => _value.symbol === value.symbol
            )
        )
        .map(
          (results: StockSearchResData): string =>
            `${results.symbol} - ${results.instrument_name}`
        );

      searchResultsArray.push(searchResults);
      setSearchResult([...searchResultsArray]);
    });
  }, [searchInput]);

  //gets symbol from selected search result
  useEffect(() => {
    let stockText = selectedStock as string;
    if (selectedStock) {
      const stringEnd = stockText.indexOf("-") - 1;
      const stockSymbol = stockText.slice(0, stringEnd);
      setSelectedSymbol(stockSymbol);
    } else return;
  }, [selectedStock]);

  //gets price, logo & other details of selected symbol
  useEffect(() => {
    getStockPrice({ selectedSymbol }).then((resJson) => {
      setStockPrice(resJson.price);
    });

    getStockDetails({ selectedSymbol }).then((resJson) => {
      setStockName(resJson.name);
      setStockChange(resJson.change);
      setStockPercentChange(resJson.percent_change);
      setStockOpen(resJson.open);
      setStockHigh(resJson.high);
      setStockLow(resJson.low);
      setStockVolume(resJson.volume);
      setStockWkHigh(resJson.fifty_two_week.high);
      setStockWkLow(resJson.fifty_two_week.low);
    });
  }, [selectedSymbol]);

  const handleSearchInput = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string
  ) => {
    setSearchInput(newValue);
  };

  const handleSearchSelect = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    setSelectedStock(newValue);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const formatNum = (num: number) => {
    return num.toFixed(2);
  };

  let formattedPrice = formatNum(+stockPrice);
  let formattedPriceChange = formatNum(+stockChange);
  let formattedPercentageChange = formatNum(+stockPercentChange);
  let formattedOpen = formatNum(+stockOpen);
  let formattedHigh = formatNum(+stockHigh);
  let formattedLow = formatNum(+stockLow);
  let formattedWkHigh = formatNum(+stockWkHigh);
  let formattedWkLow = formatNum(+stockWkLow);

  return (
    <Grid2 container>
      <Grid2
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Autocomplete
          id="stocksSearchBar"
          value={selectedStock}
          onChange={handleSearchSelect}
          options={searchResult}
          inputValue={searchInput}
          onInputChange={handleSearchInput}
          getOptionLabel={(option) => option}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Stock symbol: " />
          )}
        />
        {selectedStock ? (
          <Card
            sx={{ maxWidth: 600, display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ display: "flex" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {stockName}
                  </Typography>
                </CardContent>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    ${formattedPrice}
                  </Typography>
                  {/*============================= Make color based on green or red ===========================================*/}
                  {+stockChange > 0 ? (
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ color: "green" }}
                    >
                      +{formattedPriceChange}({formattedPercentageChange})
                    </Typography>
                  ) : (
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ color: "red" }}
                    >
                      {formattedPriceChange}({formattedPercentageChange})
                    </Typography>
                  )}
                </CardContent>
              </Box>
            </Box>
            <CardActions disableSpacing>
              {/* Error here needs fixing, issue with MUI component prop support */}
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="more details"
              >
                {!expanded ? (
                  <Typography variant="caption" gutterBottom>
                    View Details
                  </Typography>
                ) : (
                  <Typography variant="caption" gutterBottom>
                    Hide Details
                  </Typography>
                )}
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <TableContainer>
                  <Table sx={{ minWidth: 700 }} aria-label="details table">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="right">Open</TableCell>
                        <TableCell align="right">Volume</TableCell>
                        <TableCell align="right">52 Week range</TableCell>
                        <TableCell align="right">Low</TableCell>
                        <TableCell align="right">High</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{selectedSymbol}</TableCell>
                        <TableCell align="right">{formattedOpen}</TableCell>
                        <TableCell align="right">${stockVolume}</TableCell>
                        <TableCell align="right">
                          {formattedWkLow} - {formattedWkHigh}
                        </TableCell>
                        <TableCell align="right">{formattedLow}</TableCell>
                        <TableCell align="right">{formattedHigh}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Collapse>
          </Card>
        ) : (
          ""
        )}
      </Grid2>
    </Grid2>
  );
}

import { useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const NewsFilters = () => {
  const [value, setValue] = useState<Dayjs | null>(dayjs("2022-04-17"));

  return (
    <>
      <Box sx={{ flex: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={value}
            onChange={(newValue) => setValue(newValue)}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                size: "small",
              },
            }}
          />
        </LocalizationProvider>
      </Box>
      <Box sx={{ flex: 1 }}>
        <FormControl fullWidth>
          <InputLabel id="categories-filter-label">Categories</InputLabel>
          <Select
            labelId="categories-filter-label"
            id="categories-filter"
            label="Categories"
            value={10}
            size="small"
            onChange={() => {}}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ flex: 1 }}>
        <FormControl fullWidth>
          <InputLabel id="sources-filter-label">Sources</InputLabel>
          <Select
            labelId="sources-filter-label"
            id="sources-filter"
            label="Sources"
            value={10}
            size="small"
            onChange={() => {}}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

export default NewsFilters;

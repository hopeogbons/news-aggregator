import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAppSelector } from "../../redux/store";

interface Filters {
  date: Dayjs | null;
  category: string;
  source: string;
}

interface NewsFiltersProps {
  filters: Filters;
  onFilterChange: (updatedFilter: Partial<Filters>) => void;
}

const NewsFilters = ({ filters, onFilterChange }: NewsFiltersProps) => {
  const sourcesObject: Record<string, string> = {
    newsAPI: "NewsAPI",
    newYorkTimes: "New York Times",
    theGuardian: "The Guardian",
  };

  const selectedSources = useAppSelector(
    (state) => state.sources.selectedSources
  );

  const mergedCategories = useAppSelector(
    (state) => state.categories.mergedCategories
  );

  return (
    <>
      <Box sx={{ flex: "1 1 0" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={filters.date}
            onChange={(newValue) => onFilterChange({ date: newValue })}
            format="DD MMM YYYY"
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                size: "small",
                placeholder: "None",
                InputLabelProps: {
                  shrink: true,
                },
                inputProps: {
                  readOnly: true,
                },
                sx: {
                  "& .MuiInputBase-input::placeholder": {
                    fontStyle: "italic",
                  },
                },
              },
              actionBar: {
                actions: ["clear"],
              },
            }}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ flex: "1 1 0" }}>
        <FormControl fullWidth>
          <InputLabel id="categories-filter-label" shrink>
            Categories
          </InputLabel>
          <Select
            labelId="categories-filter-label"
            id="categories-filter"
            label="Categories"
            value={filters.category}
            size="small"
            onChange={(e: SelectChangeEvent<string>) =>
              onFilterChange({ category: e.target.value })
            }
            displayEmpty
          >
            <MenuItem value="">
              <em style={{ opacity: 0.4 }}>None</em>
            </MenuItem>
            {mergedCategories.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ flex: "1 1 0" }}>
        <FormControl fullWidth>
          <InputLabel id="sources-filter-label" shrink>
            Sources
          </InputLabel>
          <Select
            labelId="sources-filter-label"
            id="sources-filter"
            label="Sources"
            value={filters.source}
            size="small"
            onChange={(e: SelectChangeEvent<string>) =>
              onFilterChange({ source: e.target.value })
            }
            displayEmpty
          >
            <MenuItem value="">
              <em style={{ opacity: 0.4 }}>None</em>
            </MenuItem>
            {selectedSources.map((item) => (
              <MenuItem key={item} value={sourcesObject[item]}>
                {sourcesObject[item]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

export default NewsFilters;

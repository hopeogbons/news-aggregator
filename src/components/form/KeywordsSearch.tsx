import { ChangeEvent, KeyboardEvent, MouseEvent, useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useAppDispatch } from "../../redux/store";
import { search } from "../../redux/slices/newsSlice";

const KeywordsSearch = () => {
  const dispatch = useAppDispatch();
  const [keyword, setKeyword] = useState<string>("");

  const handleSearch = async () => {
    if (keyword !== "") {
      try {
        dispatch(search(keyword));
      } catch (error) {
        console.error("Search failed: ", error);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleSearch();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: { xs: "10em", sm: "12em", md: "15em" },
        mt: { xs: 2, sm: 0 },
      }}
    >
      <InputBase
        value={keyword}
        sx={{ ml: 1, flex: 1 }}
        size="small"
        placeholder="Search"
        inputProps={{ "aria-label": "search" }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={handleClick}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default KeywordsSearch;

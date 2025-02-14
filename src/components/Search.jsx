import { TextField } from "@mui/material";
import { useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";

const Search = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { value } = target;
    setSearch(value);

    const query = createSearchParams({ spot: value });

    if (value !== "") {
      navigate({
        pathname: "/:search",
        search: `?${query}`,
      });
    } else {
      navigate({
        pathname: "/",
      });
    }
  };

  return (
    <TextField
    variant="filled"
    placeholder="Type village, city or country"

      sx={{
        bgcolor: 'white',
        borderRadius:2,
      }}
      fullWidth
      value={search}
      onChange={handleChange}
    ></TextField>
  );
};

export default Search;

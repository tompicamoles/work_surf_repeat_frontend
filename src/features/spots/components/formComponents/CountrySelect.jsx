import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getCountriesList } from "../../../../common/utils/countriesData";

export function CountrySelect({ value, handleOtherInputChange, context }) {
  const countries = getCountriesList();

  return (
    <Autocomplete
      value={value}
      onChange={(_event, newValue) =>
        handleOtherInputChange("country", newValue)
      }
      id="country"
      options={countries}
      autoHighlight
      renderInput={(params) => (
        <TextField
          required={context === "popup" && true}
          {...params}
          label="country"
        />
      )}
    />
  );
}

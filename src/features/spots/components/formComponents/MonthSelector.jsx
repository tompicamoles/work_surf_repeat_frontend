import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MonthSelector({surfSeason, handleInputChange, context}) {
  const theme = useTheme();
  

  return (
    <div>
      <FormControl required={context === "popup" && true} sx={{ m: 1, width: "100%"}}>
        <InputLabel id="demo-multiple-name-label">{context === "popup" ? "Surf Season" : "Months"}</InputLabel>
        <Select
          labelId="surfSeason"
          id="surfSeason"
          name="surfSeason"
          multiple
          value={surfSeason}
          onChange={handleInputChange}
          input={<OutlinedInput label="surfSeason" />}
          MenuProps={MenuProps}
        >
          {months.map((month) => (
            <MenuItem
              key={month}
              value={month}
              style={getStyles(month, surfSeason, theme)}
            >
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
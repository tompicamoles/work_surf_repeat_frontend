import {
  Checkbox,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { GiWaveSurfer } from "react-icons/gi";

const LevelSelector = ({ level, handleOtherInputChange, context }) => {
  const handleChange = (e) => {
    const { name } = e.target;
    let updatedLevel = [...level];

    if (level.includes(name)) {
      updatedLevel = level.filter((item) => item !== name);
    } else {
      updatedLevel = [...updatedLevel, name];
    }
    handleOtherInputChange("level", updatedLevel);
  };

  return (
    <FormControl required={context === "popup" && true} component="fieldset">
      <FormLabel component="legend">Surfing Level</FormLabel>
      <FormGroup aria-label="position" row sx={{ display:"flex", alignItems:"end"}}>
        <FormControlLabel
          control={
            <Checkbox
              checked={level.includes("Beginner")}
              icon={<GiWaveSurfer color="secondary" size={25} />}
              checkedIcon={<GiWaveSurfer color="primary" size={25} />}
              name="Beginner"
              onChange={handleChange}
            />
          }
          label="Beginner"
          labelPlacement="bottom"
          sx={{
            '.MuiFormControlLabel-label': {
              fontSize: '12px',
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
            checked={level.includes("Intermediate")}
              icon={<GiWaveSurfer color="secondary" size={30} />}
              checkedIcon={<GiWaveSurfer color="primary" size={30} />}
              name="Intermediate"
              onChange={handleChange}
            />
          }
          label="Intermediate"
          labelPlacement="bottom"
          sx={{
            '.MuiFormControlLabel-label': {
              fontSize: '12px',
            },
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
            checked={level.includes("Advanced")}
              icon={<GiWaveSurfer color="secondary" size={35} />}
              checkedIcon={<GiWaveSurfer color="primary" size={35} />}
              name="Advanced"
              onChange={handleChange}
            />
          }
          label="Advanced"
          labelPlacement="bottom"
          sx={{
            '.MuiFormControlLabel-label': {
              fontSize: '12px',
            },
          }}
        />
      </FormGroup>
    </FormControl>
  );
};

export default LevelSelector;

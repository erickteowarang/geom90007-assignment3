import React from "react";
import { 
  Box,
  Heading,
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  Radio
} from "@chakra-ui/react"
import Select from "react-select";
import "./Filter.css";

import { getEstablishments, getSuburbs } from "../../util";

const Filter = ({
  suburb,
  estab,
  setSuburb,
  setSeatingType,
  setEstabType,
  setShowAll,
}) => {
  // Handle Suburb Change
  const handleSuburbChange = (e) => {
    setSuburb(e.value);
  };

  // Handle Seating Change
  const handleSeatingChange = (value) => {
    setSeatingType(value === "outdoor");
  };

  // Handle establishment Change
  const handleEstabChange = (e) => {
    setEstabType(e.value);
  };

  // Handle show-all Change
  const handleShowAllChange = () => {
    setShowAll((prevCheck) => !prevCheck);
  };

  const generateSelectOptions = (originalArray) => {
    const optionsArray = originalArray.map(cafeSuburb => (
      {
        value: cafeSuburb,
        label: cafeSuburb
      }
    ))

    optionsArray.unshift({
      value: "All",
      label: "All"
    })

    return optionsArray;
  }

  return (
    <Box 
      w="sm"
      borderWidth="2px"
      borderRadius="md"
      bg="gray.600"
      p={5}
      className="filter-container"
    >
      <Heading size="md">Filter Cafes</Heading>

      <FormControl as="fieldset">
        <FormLabel as="legend">Do you need outdoor seating?</FormLabel>
        <RadioGroup defaultValue="outdoor" name="seating-type" onChange={handleSeatingChange}>
        <Stack direction="row">
            <Radio value="outdoor">Yes</Radio>
            <Radio value="any">No</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      <div className="suburb-container">
        <p> Choose a suburb: </p>
        <Select 
          className="dropdown"
          options={generateSelectOptions(getSuburbs())}
          onChange={handleSuburbChange}
          defaultValue={{
            value: suburb,
            label: suburb
          }}
        />
      </div>

      <div className="estab-container">
        <p> Choose an establishment type: </p>
        <Select 
          className="dropdown"
          options={generateSelectOptions(getEstablishments())}
          onChange={handleEstabChange}
          defaultValue={{
            value: estab,
            label: estab
          }}
        />
      </div>
      {/* edit here dunno what the onchange is*/}
      <div className="showall-container">
        <p> Show all data: </p>
        <label class="switch">
          <input
            type="checkbox"
            value="checked"
            onChange={handleShowAllChange}
          ></input>
          <span class="slider"></span>
        </label>
      </div>
    </Box>
  );
};

export default Filter;


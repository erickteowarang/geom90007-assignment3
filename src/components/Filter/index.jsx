import React, { useState } from "react";
import { 
  Box,
  Heading,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Stack,
  VStack
} from "@chakra-ui/react"
import Select from "react-select";
import "./Filter.css";

import { getEstablishments, getSuburbs, getLandmarkThemes } from "../../util";

const Filter = ({
  suburb,
  estab,
  landmarkType,
  setSuburb,
  setSeatingType,
  setEstabType,
  setLandmarkType,
}) => {
  const [showEstabFilter, setShowEstabFilter] = useState(false);

  // Handle Suburb Change
  const handleSuburbChange = (e) => {
    setSuburb(e.value);
  };

  // Handle Seating Change
  const handleSeatingChange = (value) => {
    setSeatingType(value === "outdoor");
  };

  // Handle establishment Change
  const handleEstabChange = (value) => {
    setEstabType(value);
  };

   // Handle establishment Change
   const handleLandmarkChange = (value) => {
    setLandmarkType(value);
  };


  const generateSelectOptions = (originalArray) => {
    const optionsArray = originalArray.map(arrayValue => (
      {
        value: arrayValue,
        label: arrayValue
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
      bg="white"
      p={6}
      className="filter-container"
    >
      <VStack spacing="16px" align="flex-start">
        <Heading size="md">Filter Points of Interest</Heading>

        <FormControl as="fieldset">
          <FormLabel as="legend">I'm looking for:</FormLabel>
          <RadioGroup 
            defaultValue="attractions"
            name="filter-type"
            onChange={value => setShowEstabFilter(value === "establishments")}
          >
            <Stack direction="row">
              <Radio value="attractions">Landmarks</Radio>
              <Radio value="establishments">Food/Drinks</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        
        {showEstabFilter ? (
          <>
            <FormControl as="fieldset">
              <FormLabel as="legend">Do you need outdoor seating?</FormLabel>
              <RadioGroup defaultValue="outdoor" name="seating-type" onChange={handleSeatingChange}>
              <Stack direction="row">
                  <Radio value="outdoor">Yes</Radio>
                  <Radio value="any">No</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Select a suburb:</FormLabel>
              <Select 
                className="dropdown"
                options={generateSelectOptions(getSuburbs())}
                onChange={handleSuburbChange}
                defaultValue={{
                  value: suburb,
                  label: suburb
                }}
              />
            </FormControl>

            <FormControl as="fieldset">
              <FormLabel as="legend">Choose an establishment type</FormLabel>
              <CheckboxGroup 
                defaultValue={estab}
                onChange={handleEstabChange}
              >
                <Stack>
                  {getEstablishments().map(establishment => (
                    <Checkbox value={establishment}>{establishment}</Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </FormControl>
          </>
        ) : (
          <>
            <FormControl as="fieldset">
              <FormLabel as="legend">Choose a type of landmark</FormLabel>
              <CheckboxGroup 
                defaultValue={landmarkType}
                onChange={handleLandmarkChange}
              >
                <Stack>
                  {getLandmarkThemes().map(theme => (
                    <Checkbox value={theme}>{theme}</Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </FormControl>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default Filter;


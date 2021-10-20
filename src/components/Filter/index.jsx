import React from "react";
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

import { 
  getEstablishments,
  getSuburbs,
  getLandmarkThemes,
} from "../../util";

const Filter = ({
  activeView,
  suburb,
  estab,
  landmarkType,
  bathroomType,
  setSuburb,
  setSeatingType,
  setEstabType,
  setLandmarkType,
  setBathroomType,
  setActiveView
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
  const handleEstabChange = (value) => {
    setEstabType(value);
  };

   // Handle establishment Change
   const handleLandmarkChange = (value) => {
    setLandmarkType(value);
  };

  const handleBathroomChange = (value) => {
    setBathroomType(value);
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

  const renderFilterView = viewName => {
    switch (viewName) {
      case 'landmarks':
        return (
          <>
            <FormControl as="fieldset">
              <FormLabel as="legend">Choose a type of landmark</FormLabel>
              <CheckboxGroup 
                value={landmarkType}
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
        )
      case 'establishments':
        return (
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
                value={estab}
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
        )
      case 'bathrooms':
        return (
          <>
            <FormControl as="fieldset">
              <FormLabel as="legend">What type of bathroom do you need?</FormLabel>
              <CheckboxGroup 
                value={bathroomType}
                onChange={handleBathroomChange}
              >
                <Stack>
                  <Checkbox value="male">Male</Checkbox>
                  <Checkbox value="female">Female</Checkbox>
                  <Checkbox value="baby_facil">Has baby facilities</Checkbox>
                  <Checkbox value="wheelchair">Wheelchair Accessible</Checkbox>
                </Stack>
              </CheckboxGroup>
            </FormControl>
          </>
        )
      default: 
        return (
          <p>Please select an option.</p>
        )
    }
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
        <Heading size="md">Melbourne City Location Finder</Heading>

        <FormControl as="fieldset">
          <FormLabel as="legend">I'm looking for:</FormLabel>
          <RadioGroup 
            name="filter-type"
            onChange={value => setActiveView(value)}
          >
            <Stack direction="row"> 
              <Radio value="bathrooms">Bathrooms</Radio>
              <Radio value="landmarks">Landmarks</Radio>
              <Radio value="establishments">Food/Drinks</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        
        {renderFilterView(activeView)}
      </VStack>
    </Box>
  );
};

export default Filter;


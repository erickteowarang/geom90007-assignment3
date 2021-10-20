import React from "react";
import { Box, Heading, Link, VStack } from "@chakra-ui/react";
import { Popup } from "react-map-gl";
import BeatLoader from "react-spinners/BeatLoader";
import { getDirectionsLink } from "../../util";

const PopupComponent = ({
  isLoading,
  latitude,
  longitude,
  onClose,
  heading,
  content
}) => (
  <Popup 
    latitude={latitude} 
    longitude = {longitude}
    onClose={onClose}
  >
    <Box p={4}>
      {isLoading ? (
        <div className="popupLoader">
          <BeatLoader color="#36D7B7" size={12} />
        </div>
      ) : (
        <VStack 
          spacing={1}
          align="flex-start"
        >
          <Heading as="h3" size="sm">
            {heading}
          </Heading>
          {content}
          <Link href={getDirectionsLink(latitude, longitude)} isExternal color="teal.400">
            <strong>Get directions</strong>
          </Link>
        </VStack>
      )}
    </Box>
  </Popup>
);

export default PopupComponent;
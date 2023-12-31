import {
  ListItem,
  Image,
  Flex,
  Heading,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { SyntheticEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./country-card.css";
import axios from "axios";

interface Country {
  country: string;
  num_jumps: number;
  code: string;
}

interface CountryCardProps {
  country: Country;
}

export default function CountryCard({ country }: CountryCardProps) {
  const navigate = useNavigate();
  const txt_300 = useColorModeValue("txt_light.300", "txt_dark.300");
  const out_500 = useColorModeValue("out_light.500", "out_dark.500");
  const [image, setImage] = useState<any>(null);
  const url = `${import.meta.env.VITE_SERVER_DOMAIN_NAME}/country-images/${
    country.code
  }.webp`;
  const flagUrl = `${import.meta.env.VITE_SERVER_DOMAIN_NAME}/country-flags/${
    country.code
  }.svg`;
  const [tryFallback, setTryFallback] = useState(true);

  function imageFallback(e: SyntheticEvent<HTMLImageElement, Event>) {
    if (tryFallback) {
      e.currentTarget.src = flagUrl;
      setTryFallback(false);
    }
  }

  return (
    <ListItem
      className="country-card"
      id={`country-${country.country[0]}`}
      key={country.country}
      color={out_500}
      border="1px solid"
      _hover={{
        borderColor: txt_300,
        color: txt_300,
      }}
      onClick={() => navigate(country.code)}
    >
      <Image
        src={url}
        loading="lazy"
        crossOrigin="anonymous"
        onError={imageFallback}
        className="country-image"
      />
      <Flex direction="column">
        <Flex alignItems="center">
          <Heading as="h4">{country.country}</Heading>
        </Flex>
        <Spacer />
        <Flex>
          <Image
            className="flag"
            src={flagUrl}
            crossOrigin="anonymous"
            loading="lazy"
          />
          <Spacer />
          <Text>
            {country.num_jumps == 1 ? `1 jump` : `${country.num_jumps} jumps`}
          </Text>
        </Flex>
      </Flex>
    </ListItem>
  );
}

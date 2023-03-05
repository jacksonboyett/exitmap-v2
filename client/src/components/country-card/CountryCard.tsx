import {
  ListItem,
  Image,
  Flex,
  Heading,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import countryImage from "../../assets/country-image.jpeg";
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
  const url = `http://localhost:8000/country-images/${country.code}.webp`;

  return (
    <ListItem
      className="country-card"
      key={country.country}
      color={out_500}
      border="1px solid"
      _hover={{
        borderColor: txt_300,
        color: txt_300,
      }}
      onClick={() => navigate(country.country)}
    >
      <Image src={url} loading="lazy" />
      <Flex direction="column">
        <Heading as="h4">{country.country}</Heading>
        <Spacer />
        <Flex>
          <Text>{country.code}</Text>
          <Spacer />
          <Text>{country.num_jumps} jumps</Text>
        </Flex>
      </Flex>
    </ListItem>
  );
}

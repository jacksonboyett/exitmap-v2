import "./forgot-password.css";
import axios from "axios";
import { useContext, useState } from "react";
import { ExitDataContext } from "../../context/ExitDataContext";
import {
  Heading,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Button,
  Text,
  useColorModeValue,
  useColorMode,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { EventType } from "@testing-library/react";
import { useNavigate } from "react-router";
import { UserContext } from "../../context/UserContext";

interface FormInputs extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

function ForgotPassword() {
  const navigate = useNavigate();
  const [userContext, setUserContext] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const lightMode = useColorModeValue(true, false);
  const inputColorMode = lightMode ? "input-light" : "input-dark";
  const txt_500 = useColorModeValue("txt_light.500", "txt_dark.500");
  const toast = useToast();
  const out_500 = useColorModeValue("out_dark.500", "out_light.500");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    const url = `${import.meta.env.VITE_SERVER_DOMAIN_NAME}/forgot-password`;
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const inputs = target.elements as FormInputs;
    try {
      const { data } = await axios.post(url, { email: inputs.email.value });
      setLoading(false);
      setSubmitted(true);
    } catch (err: any) {
      if (err.response.status === 404) {
        setLoading(false);
        toast({
          title: "Error",
          description: "This email is not registered with ExitMap.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }

  async function populateUser() {
    const userRes = await axios.post(
      `${import.meta.env.VITE_SERVER_DOMAIN_NAME}/populate-test-users`,
      {
        username: "j",
        first_name: "j",
        last_name: "j",
        email: "j@j.j",
        password: "j",
        token: localStorage.getItem("token"),
      }
    );
  }

  if (submitted) {
    return (
      <div className="forgot-pass-submitted-page">
        <Text
          fontSize="3xl !important"
          onClick={() => {
            toggleColorMode();
          }}
        >
          Please check your email for the link to reset your password.
        </Text>
      </div>
    );
  } else {
    return (
      <div className="forgot-password-page">
        <div className={`forgot-password-box ${inputColorMode}`}>
          <form
            className="forgot-password-form"
            onSubmit={(e) => handleSubmit(e)}
          >
            <Heading
              as="h2"
              fontSize="2.5rem !important"
              onClick={() => {
                toggleColorMode();
              }}
            >
              Forgot password?
            </Heading>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                className={inputColorMode}
                name="email"
                required
              />
            </FormControl>

            <Flex className="register-user-button-container">
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <Button
                    type="submit"
                    className="reset-password"
                    bg={txt_500}
                    color={out_500}
                  >
                    Reset password
                  </Button>
                </>
              )}
            </Flex>
          </form>
        </div>
      </div>
    );
  }
}

export default ForgotPassword;

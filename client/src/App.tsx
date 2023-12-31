import Domain from "./pages/domain/Domain";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import DashHome from "./pages/dash-home/DashHome";
import DashSubmit from "./pages/dash-submit/DashSubmit";
import DashCountries from "./pages/dash-countries/DashCountries";
import Country from "./pages/country/Country";
import Exit from "./pages/exit/Exit";
import ContactUs from "./pages/contact-us/ContactUs";
import { Routes, Route, useLocation } from "react-router-dom";
import "./app.css";
import { ExitDataContext } from "./context/ExitDataContext";
import { UserContext } from "./context/UserContext";
import getCurrentUser from "./utils/getCurrentUser";
import { useState, useMemo, useEffect, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ChangePassword from "./pages/change-password/ChangePassword";
import AdminPage from "./pages/admin/AdminPage";
import ReviewExits from "./pages/admin/review-exits/ReviewExits";
import AdminHome from "./pages/admin/admin-home/AdminHome";
import ReviewUsers from "./pages/admin/review-users/ReviewUsers";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import ResetPassword from "./pages/reset-password/ResetPassword";
import VerifyUser from "./pages/verify-user/VerifyUser";
import useReviewedExitsFetch from "./hooks/useReviewedExitsFetch";

function App() {
  const [exitDataContext, setExitDataContext] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalErrorMessage, setModalErrorMessage] = useState("");
  const [user, setUser] = useContext(UserContext);
  const { data, error, loading } = useReviewedExitsFetch();
  const navigate = useNavigate();
  let location = useLocation();

  const bg_500 = useColorModeValue("bg_light.500", "bg_dark.500");

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        console.log(user)
        setUser(user);
      } catch (err) {
        if (location.pathname == "/reset-password") {
          navigate(`${location.pathname}${location.search}`);
        } else if (location.pathname == "/verify-user") {
          navigate(`${location.pathname}${location.search}`);
        } else {
          navigate("/login");
        }
      }
    })();
  }, []);

  useEffect(() => {
    setExitDataContext(data as any);
  }, [data]);

  const exitsData = useMemo(
    () => ({ exitDataContext, setExitDataContext }),
    [exitDataContext, setExitDataContext]
  );

  return (
    <div
      className="app"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
      }}
    >
      <ExitDataContext.Provider value={exitsData}>
        <Routes>
          <Route path="" element={<Domain />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="login" element={<Login />} />
          <Route path="home" element={<DashHome />} />
          <Route path="submit" element={<DashSubmit />} />
          <Route path="countries" element={<DashCountries />} />
          <Route path="countries/:country_code" element={<Country />} />
          <Route path="countries/:country_code/:exit_id" element={<Exit />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="verify-user" element={<VerifyUser />} />
          <Route path="admin" element={<AdminPage />}>
            <Route path="" element={<AdminHome />} />
            <Route path="review-exits" element={<ReviewExits />} />
            <Route path="review-users" element={<ReviewUsers />} />
          </Route>
        </Routes>
      </ExitDataContext.Provider>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="modal" bg={bg_500}>
          <ModalHeader className="modal-header" color="red">
            Network Error
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalErrorMessage}</ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default App;

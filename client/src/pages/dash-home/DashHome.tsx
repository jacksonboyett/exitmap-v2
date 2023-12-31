import NavBar from "../../components/navbar/NavBar";
import Map from "../../components/map/Map";
import "./dash-home.css";

export default function DashHome() {
  return (
    <div className="dash-home">
      <NavBar currentPage="home" />
      <Map editable={false} />
    </div>
  );
}

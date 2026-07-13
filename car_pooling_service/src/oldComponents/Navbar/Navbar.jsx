import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="sticky">
      <Toolbar
        sx={{
          backgroundColor: "white",
          color: "black",
          display: "flex",
          justifyContent: "space-around",
          lineHeight: "0.5rem",
        }}
      >
        <Link to="/" className="logo">
          <img
            src="/images/eco-ride.png"
            style={{ width: "6.5rem", height: "2rem" }}
          />
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "20%",
            marginLeft: "8%",
            marginRight: "8%",
          }}
        >
          <Link to="/findRagPickers">
            <Typography sx={{ fontWeight: "550" }}></Typography>
          </Link>
          <Link to="/findRags">
            <Typography sx={{ fontWeight: "550" }}></Typography>
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "15%",
          }}
        >
          <Link to="/signup" style={{ textDecoration: "none", color: "black" }}>
            <Typography sx={{ fontWeight: "550" }}>SignUp</Typography>
          </Link>
          <Link
            to="/signin"
            sx={{ display: "flex" }}
            style={{ textDecoration: "none", color: "#33333" }}
          >
            <Typography className="nav-sign-in" sx={{ fontWeight: "550", }}>SignIn</Typography>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

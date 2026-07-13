import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },

          color: "black",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#000000",
          "&:hover": {
            backgroundColor: "#000000",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "white",
          "&.Mui-focused": {
            color: "white",
          },
        },
      },
    },
  },
});

export default function MyModal() {
  let [isOpen, setIsOpen] = useState(true);
  const [passengerLocation, setPassengerLocation] = useState("");
  const [passLatitude, setPassLatitude] = useState();
  const [passLongitude, setPassLongitude] = useState();
  const [suggestions, setSuggestions] = useState([]);

  const handleSubmit = () => {
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log("dialogue");
    console.log(passengerLocation);
    console.log(passLatitude);
    console.log(passLongitude);
    localStorage.setItem("passLati", passLatitude);
    localStorage.setItem("passLongitude", passLongitude);
    localStorage.setItem("passengerLocation", passengerLocation);
  };

  useEffect(() => {
    if (passengerLocation !== "") {
      fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${passengerLocation}&format=json&apiKey=7150d3d1879642babb4e29c827ae645b`
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          const newSuggestions = result.results.map((item) => ({
            label: `${item.address_line1} ${item.address_line2}`,
            value: item,
          }));
          setSuggestions(newSuggestions);
        })
        .catch((error) => console.log("error", error));
    }
  }, [passengerLocation]);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <Button
        onClick={open}
        variant="contained"
        style={{ backgroundColor: "black" }}
        className=" py-2 px-4 text-sm font-medium text-white rounded-md bg-black "
      >
        Change your location
      </Button>

      <Dialog
        open={isOpen}
        onClose={close}
        className="rounded-lg"
        maxWidth="xs" // You can use 'xs', 'sm', 'md', 'lg', 'xl' or a custom value
        fullWidth={true}
      >
        <DialogTitle className="text-base/7 font-medium text-primary">
          Current Location:
        </DialogTitle>
        <DialogContent className="bg-secondary p-6">
          <p className="mt-2 text-sm/6 text-primary mr-4" id="location">
            Enter your Current Location :{" "}
            <ThemeProvider theme={theme}>
              <Autocomplete
                options={suggestions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    onChange={(e) => setPassengerLocation(e.target.value)}
                  />
                )}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setPassengerLocation(newValue.label);
                    setPassLatitude(newValue.value.lat);
                    setPassLongitude(newValue.value.lon);
                  } else {
                    setPassengerLocation("");
                    setPassLatitude(null);
                    setPassLongitude(null);
                  }
                }}
              />
            </ThemeProvider>
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            // color="primary"
            style={{ backgroundColor: "black" }}
            className="inline-flex items-center gap-2 py-1.5 px-3 text-sm/6 font-semibold text-white"
            onClick={handleSubmit}
          >
            Got it, thanks!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

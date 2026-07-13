import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

const ModeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === "light" ? "dark" : "light"} mode
    </button>
  );
};

export default ModeToggle;

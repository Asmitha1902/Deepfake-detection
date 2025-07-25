import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "./components/Navbar";
import { ImageForm } from "./components/ImageForm";
import { useState } from "react";
import { Report } from "./components/Report";

function App() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const submitForm = () => {
    // This should be triggered when the form is fully processed
    setFormSubmitted(true);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar />
      <div className="h-[60vh] flex justify-center items-center">
        <ImageForm submitForm={submitForm} />
      </div>
    </ThemeProvider>
  );
}

export default App;

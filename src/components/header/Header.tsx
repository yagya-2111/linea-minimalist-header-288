import StatusBar from "./StatusBar";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <StatusBar />
      <Navigation />
    </header>
  );
};

export default Header;
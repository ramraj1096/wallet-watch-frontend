import Footer from "../components/Footer";
import HomePageHeader from "../components/HomePageHeader";

const HomeLayout = ({ children}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <HomePageHeader />
      {/* {showHero && <Hero />} */}
      <div className="container mx-auto flex-1 py-10">{children}</div>
      <Footer />
    </div>
  );
};

export default HomeLayout;

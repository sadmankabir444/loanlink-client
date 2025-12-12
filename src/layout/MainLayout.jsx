import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

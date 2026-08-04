import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
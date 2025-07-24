import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import CampaignsIndexPage from "./pages/CampaignsIndexPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import CampaignDetailPage from "./pages/CampaignDetailPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/campaigns" element={<CampaignsIndexPage />} />
          <Route path="/create-campaign" element={<CreateCampaignPage />} />
          <Route path="/campaigns/:campaignAddress" element={<CampaignDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

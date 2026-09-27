import React from 'react';
import { useAppStore } from './store/appStore';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { FarmerCopilot } from './components/FarmerCopilot';
import { JudgeDemoModal } from './components/JudgeDemoModal';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ARAssistantPage } from './pages/ARAssistantPage';
import { CropScannerPage } from './pages/CropScannerPage';
import { DiseaseAnalysisPage } from './pages/DiseaseAnalysisPage';
import { GuidancePage } from './pages/GuidancePage';
import { CropLibraryPage } from './pages/CropLibraryPage';
import { CropDetailPage } from './pages/CropDetailPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { EquipmentDetailPage } from './pages/EquipmentDetailPage';
import { TrainingHubPage } from './pages/TrainingHubPage';
import { TrainingExperiencePage } from './pages/TrainingExperiencePage';
import { VirtualFarmPage } from './pages/VirtualFarmPage';
import { FieldDetailPage } from './pages/FieldDetailPage';
import { CommunityPage } from './pages/CommunityPage';
import { KisanSuvidhaPage } from './pages/KisanSuvidhaPage';
import { ProgressPage } from './pages/ProgressPage';
import { HistoryPage } from './pages/HistoryPage';
import { DemoOverviewPage } from './pages/DemoOverviewPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const { currentRoute } = useAppStore();

  const renderPage = () => {
    switch (currentRoute) {
      case 'landing':
        return <LandingPage />;
      case 'login':
      case 'register':
        return <AuthPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'ar-assistant':
        return <ARAssistantPage />;
      case 'crop-scanner':
        return <CropScannerPage />;
      case 'disease-analysis':
        return <DiseaseAnalysisPage />;
      case 'guidance':
        return <GuidancePage />;
      case 'crops':
        return <CropLibraryPage />;
      case 'crop-detail':
        return <CropDetailPage />;
      case 'equipment':
        return <EquipmentPage />;
      case 'equipment-detail':
        return <EquipmentDetailPage />;
      case 'training':
        return <TrainingHubPage />;
      case 'training-experience':
        return <TrainingExperiencePage />;
      case 'virtual-farm':
        return <VirtualFarmPage />;
      case 'field-detail':
        return <FieldDetailPage />;
      case 'community':
        return <CommunityPage />;
      case 'kisan-suvidha':
        return <KisanSuvidhaPage />;
      case 'progress':
        return <ProgressPage />;
      case 'history':
        return <HistoryPage />;
      case 'demo':
        return <DemoOverviewPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const showNavbar = true;
  const showBottomNav = currentRoute !== 'landing' && currentRoute !== 'login' && currentRoute !== 'register';

  return (
    <MobileFrameWrapper>
      <div className="min-h-screen flex flex-col bg-[#061208] text-gray-100 font-sans selection:bg-agri-accent selection:text-black">
        {showNavbar && <Navbar />}

        <main className="flex-1 pb-16">
          {renderPage()}
        </main>

        {showBottomNav && <BottomNav />}

        {/* Floating Global Widgets */}
        <FarmerCopilot />
        <JudgeDemoModal />
        <ToastContainer />
      </div>
    </MobileFrameWrapper>
  );
}

export default App;

import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import SEOHead from '@/components/SEOHead.jsx';

// Pages
const HomePage = lazy(() => import('@/pages/HomePage.jsx'));
const ContactPage = lazy(() => import('@/pages/ContactPage.jsx'));
const SpecialtiesPage = lazy(() => import('@/pages/SpecialtiesPage.jsx'));
const SpecialtyTemplate = lazy(() => import('@/pages/SpecialtyTemplate.jsx'));
const ABATherapyPage = lazy(() => import('@/pages/ABATherapyPage.jsx'));
const BehavioralHealthPage = lazy(() => import('@/pages/BehavioralHealthPage.jsx'));
const CardiologyPage = lazy(() => import('@/pages/CardiologyPage.jsx'));
const OrthopedicsPage = lazy(() => import('@/pages/OrthopedicsPage.jsx'));
const PMEPage = lazy(() => import('@/pages/PMEPage.jsx'));
const SportsMedicinePage = lazy(() => import('@/pages/SportsMedicinePage.jsx'));
const UrgentCarePage = lazy(() => import('@/pages/UrgentCarePage.jsx'));
const UrologyPage = lazy(() => import('@/pages/UrologyPage.jsx'));
const AdminDashboard = lazy(() => import('@/admin/Dashboard.jsx'));

// State Pages
const TexasPage = lazy(() => import('@/pages/TexasPage.jsx'));
const CaliforniaPage = lazy(() => import('@/pages/CaliforniaPage.jsx'));
const DelawarePage = lazy(() => import('@/pages/DelawarePage.jsx'));
const FloridaPage = lazy(() => import('@/pages/FloridaPage.jsx'));
const NevadaPage = lazy(() => import('@/pages/NevadaPage.jsx'));
const NewJerseyPage = lazy(() => import('@/pages/NewJerseyPage.jsx'));
const NewYorkPage = lazy(() => import('@/pages/NewYorkPage.jsx'));
const PennsylvaniaPage = lazy(() => import('@/pages/PennsylvaniaPage.jsx'));

// Who We Serve Pages
const MedicalGroupPracticesPage = lazy(() => import('@/pages/MedicalGroupPracticesPage.jsx'));
const OutsourceBillingServicesPage = lazy(() => import('@/pages/OutsourceBillingServicesPage.jsx'));
const SmallPracticesPage = lazy(() => import('@/pages/SmallPracticesPage.jsx'));
const HospitalsHealthSystemsPage = lazy(() => import('@/pages/HospitalsHealthSystemsPage.jsx'));
const IndependentPracticesPage = lazy(() => import('@/pages/IndependentPracticesPage.jsx'));

// Service Pages
const ServicesPage = lazy(() => import('@/pages/ServicesPage.jsx'));
const MedicalBillingPage = lazy(() => import('@/pages/MedicalBillingPage.jsx'));
const RCMPage = lazy(() => import('@/pages/RCMPage.jsx'));
const MedicalCodingPage = lazy(() => import('@/pages/MedicalCodingPage.jsx'));
const ClearinghousePage = lazy(() => import('@/pages/ClearinghousePage.jsx'));
const MedicalAuditPage = lazy(() => import('@/pages/MedicalAuditPage.jsx'));
const HealthcareSEOPage = lazy(() => import('@/pages/HealthcareSEOPage.jsx'));
const LaboratoryBillingPage = lazy(() => import('@/pages/LaboratoryBillingPage.jsx'));
const MIPSConsultingPage = lazy(() => import('@/pages/MIPSConsultingPage.jsx'));
const PatientBenefitsEligibilityPage = lazy(() => import('@/pages/PatientBenefitsEligibilityPage.jsx'));
const MedicalBillingCodingPage = lazy(() => import('@/pages/MedicalBillingCodingPage.jsx'));
const EpicPage = lazy(() => import('@/pages/EpicPage.jsx'));
const AthenahealthPage = lazy(() => import('@/pages/AthenahealthPage.jsx'));
const AdvancedMDPage = lazy(() => import('@/pages/AdvancedMDPage.jsx'));
const ICANotesPage = lazy(() => import('@/pages/ICANotesPage.jsx'));
const NextGenPage = lazy(() => import('@/pages/NextGenPage.jsx'));
const CareCloudPage = lazy(() => import('@/pages/CareCloudPage.jsx'));
const GenericPage = lazy(() => import('@/pages/GenericPage.jsx'));
const CompanyPage = lazy(() => import('@/pages/CompanyPage.jsx'));
const BlogPage = lazy(() => import('@/pages/BlogPage.jsx'));
const BlogTemplate = lazy(() => import('@/pages/BlogTemplate.jsx'));
const PricingPage = lazy(() => import('@/pages/PricingPage.jsx'));
const EHRMainPage = lazy(() => import('@/pages/EHRMainPage.jsx'));
const StatesMainPage = lazy(() => import('@/pages/StatesMainPage.jsx'));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <SEOHead />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0da1df]"></div></div>}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Services Routes */}
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/medical-billing" element={<MedicalBillingPage />} />
        <Route path="/services/rcm" element={<RCMPage />} />
        <Route path="/services/medical-coding" element={<MedicalCodingPage />} />
        <Route path="/services/clearinghouse" element={<ClearinghousePage />} />
        <Route path="/services/medical-audit" element={<MedicalAuditPage />} />
        <Route path="/services/healthcare-seo" element={<HealthcareSEOPage />} />
        <Route path="/services/medical-billing-coding" element={<MedicalBillingCodingPage />} />
        <Route path="/services/mips-consulting" element={<MIPSConsultingPage />} />
        <Route path="/services/laboratory-billing" element={<LaboratoryBillingPage />} />
        <Route path="/services/eligibility-verification" element={<PatientBenefitsEligibilityPage />} />
        <Route path="/emr/epic" element={<EpicPage />} />
        <Route path="/emr/athenahealth" element={<AthenahealthPage />} />
        <Route path="/emr/advancedmd" element={<AdvancedMDPage />} />
        <Route path="/emr/icanotes" element={<ICANotesPage />} />
        <Route path="/emr/nextgen" element={<NextGenPage />} />
        <Route path="/emr/carecloud" element={<CareCloudPage />} />
        
        {/* Specialties Routes */}
        <Route path="/specialties" element={<SpecialtiesPage />} />
        <Route path="/specialties/aba-therapy" element={<ABATherapyPage />} />
        <Route path="/specialties/behavioral-health" element={<BehavioralHealthPage />} />
        <Route path="/specialties/cardiology" element={<CardiologyPage />} />
        <Route path="/specialties/orthopedics" element={<OrthopedicsPage />} />
        <Route path="/specialties/pme" element={<PMEPage />} />
        <Route path="/specialties/sports-medicine" element={<SportsMedicinePage />} />
        <Route path="/specialties/urgent-care" element={<UrgentCarePage />} />
        <Route path="/specialties/urology" element={<UrologyPage />} />
        <Route path="/specialties/:slug" element={<SpecialtyTemplate />} />
        <Route path="/emr" element={<EHRMainPage />} />
        <Route path="/states" element={<StatesMainPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/services/:slug" element={<GenericPage categoryOverride="services" />} />

        <Route path="/emr/:slug" element={<GenericPage categoryOverride="emr" />} />
        <Route path="/states/texas" element={<TexasPage />} />
        <Route path="/states/california" element={<CaliforniaPage />} />
        <Route path="/states/delaware" element={<DelawarePage />} />
        <Route path="/states/florida" element={<FloridaPage />} />
        <Route path="/states/nevada" element={<NevadaPage />} />
        <Route path="/states/new-jersey" element={<NewJerseyPage />} />
        <Route path="/states/new-york" element={<NewYorkPage />} />
        <Route path="/states/pennsylvania" element={<PennsylvaniaPage />} />
        <Route path="/states/:slug" element={<GenericPage categoryOverride="states" />} />
        
        {/* Who We Serve Routes */}
        <Route path="/who-we-serve/medical-group-practices" element={<MedicalGroupPracticesPage />} />
        <Route path="/who-we-serve/outsource-billing-services" element={<OutsourceBillingServicesPage />} />
        <Route path="/who-we-serve/medical-billing-small-practices" element={<SmallPracticesPage />} />
        <Route path="/who-we-serve/hospitals-health-systems" element={<HospitalsHealthSystemsPage />} />
        <Route path="/who-we-serve/independent-practices" element={<IndependentPracticesPage />} />
        <Route path="/who-we-serve/:slug" element={<GenericPage categoryOverride="who-we-serve" />} />
        
        {/* Resources & Blog Routes */}
        <Route path="/resources/company" element={<CompanyPage />} />
        <Route path="/resources/blog" element={<BlogPage />} />
        <Route path="/resources/blog/:slug" element={<BlogTemplate />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogTemplate />} />
        <Route path="/resources/:slug" element={<GenericPage categoryOverride="resources" />} />
        
        {/* Catch-all 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <p className="text-xl text-muted-foreground mb-8">Page not found</p>
            <a href="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Back to home
            </a>
          </div>
        } />
      </Routes>
      </Suspense>
      <Toaster position="bottom-right" />
    </Router>
  );
}

export default App;
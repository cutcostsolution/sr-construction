import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router";
import { SiteLayout } from "@/components/SiteLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Network from "@/pages/Network";
import Founder from "@/pages/Founder";
import Contact from "@/pages/Contact";
import Consultation from "@/pages/Consultation";
import Blogs from "@/pages/Blogs";
import BlogPost from "@/pages/BlogPost";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminConsultations = lazy(() => import("@/pages/admin/AdminConsultations"));
const AdminClients = lazy(() => import("@/pages/admin/AdminClients"));
const AdminCatalogue = lazy(() => import("@/pages/admin/AdminCatalogue"));
const AdminContent = lazy(() => import("@/pages/admin/AdminContent"));
const AdminBlogs = lazy(() => import("@/pages/admin/AdminBlogs"));
const AdminApplications = lazy(() => import("@/pages/admin/AdminApplications"));
const AdminEnquiries = lazy(() => import("@/pages/admin/AdminEnquiries"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));

function PublicShell() { return <SiteLayout><Outlet /></SiteLayout>; }

export default function App() {
  return <Suspense fallback={<div className="page-loading">Loading SR Construction…</div>}><Routes>
    <Route element={<PublicShell />}>
      <Route path="/" element={<Home />} /><Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} /><Route path="/services/:slug" element={<ServiceDetail />} />
      <Route path="/projects" element={<Projects />} /><Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/network" element={<Network />} /><Route path="/founder" element={<Founder />} />
      <Route path="/contact" element={<Contact />} /><Route path="/consultation" element={<Consultation />} />
      <Route path="/blogs" element={<Blogs />} /><Route path="/blogs/:slug" element={<BlogPost />} />
      <Route path="*" element={<NotFound />} />
    </Route>
    <Route path="/login" element={<Login />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} /><Route path="consultations" element={<AdminConsultations />} />
      <Route path="clients" element={<AdminClients />} /><Route path="catalogue" element={<AdminCatalogue />} />
      <Route path="content" element={<AdminContent />} /><Route path="blogs" element={<AdminBlogs />} />
      <Route path="applications" element={<AdminApplications />} /><Route path="enquiries" element={<AdminEnquiries />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
  </Routes></Suspense>;
}

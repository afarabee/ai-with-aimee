import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import MyAIJourney from "./pages/MyAIJourney";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ModelMap from "./pages/ModelMap";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import BlogDashboard from "./pages/admin/BlogDashboard";
import BlogEditor from "./pages/admin/BlogEditor";
import BlogsHub from "./pages/admin/BlogsHub";
import BlogsWriter from "./pages/admin/BlogsWriter";
import ProjectDashboard from "./pages/admin/ProjectDashboard";
import ProjectEditor from "./pages/admin/ProjectEditor";
import AssetGallery from "./pages/admin/AssetGallery";
import PromptLibraryDashboard from "./pages/admin/PromptLibraryDashboard";
import PromptEditor from "./pages/admin/PromptEditor";
import NewsletterDashboard from "./pages/admin/NewsletterDashboard";
import NewsletterComposer from "./pages/admin/NewsletterComposer";
import NewsletterLogs from "./pages/admin/NewsletterLogs";
import HeadshotEditor from "./pages/admin/HeadshotEditor";
import ModelsDashboard from "./pages/admin/ModelsDashboard";
import TestLabDashboard from "./pages/admin/TestLabDashboard";
import ModelMapDashboard from "./pages/admin/ModelMapDashboard";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
import PageTransition from "./components/PageTransition";
import { useSpotlightEffect } from "./hooks/useSpotlightEffect";

const queryClient = new QueryClient();

const App = () => {
  // Initialize spotlight effect for all .btn-hero buttons
  useSpotlightEffect();

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <BackToTop />
        <PageTransition>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/my-ai-journey" element={<MyAIJourney />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/model-map" element={<ModelMap />} />
            {/* SEO redirect - old slug variation points to canonical URL */}
            <Route path="/blog/agents-arent-the-answer" element={<Navigate to="/blog/agents-arent-always-the-answer" replace />} />
            {/* Dynamic blog post handler - renders all posts via BlogPost.tsx */}
            <Route path="/blog/:slug" element={<BlogPost />} />
            {/* Admin routes with nested layout */}
            <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
            <Route index element={<AdminHome />} />
            <Route path="blog-dashboard" element={<BlogDashboard />} />
            <Route path="blog-editor" element={<BlogEditor />} />
            <Route path="blog-editor/:slug" element={<BlogEditor />} />
              <Route path="blogs" element={<BlogsHub />} />
              <Route path="project-dashboard" element={<ProjectDashboard />} />
              <Route path="project-editor" element={<ProjectEditor />} />
                <Route path="asset-gallery" element={<AssetGallery />} />
                <Route path="prompt-library" element={<PromptLibraryDashboard />} />
                <Route path="prompt-editor" element={<PromptEditor />} />
              <Route path="newsletter-dashboard" element={<NewsletterDashboard />} />
              <Route path="newsletter-composer" element={<NewsletterComposer />} />
              <Route path="newsletter-logs" element={<NewsletterLogs />} />
              <Route path="headshot-editor" element={<HeadshotEditor />} />
              <Route path="models" element={<ModelsDashboard />} />
              <Route path="test-lab" element={<TestLabDashboard />} />
              <Route path="model-map" element={<ModelMapDashboard />} />
            </Route>
            {/* Standalone Blog Writer - Full-screen editor without sidebar */}
            <Route path="/admin/blogs/new" element={<BlogsWriter />} />
            <Route path="/admin/blogs/edit" element={<BlogsWriter />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;

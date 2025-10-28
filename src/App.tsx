import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import PageTransition from "@/components/PageTransition";
import BackToTop from "@/components/BackToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import MyAIJourney from "./pages/MyAIJourney";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogEditor from "./pages/admin/BlogEditor";
import BlogDashboard from "./pages/admin/BlogDashboard";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import ProjectDashboard from "./pages/admin/ProjectDashboard";
import ProjectEditor from "./pages/admin/ProjectEditor";
import AssetGallery from "./pages/admin/AssetGallery";
import PromptLibraryDashboard from "./pages/admin/PromptLibraryDashboard";
import PromptEditor from "./pages/admin/PromptEditor";
import NewsletterDashboard from "./pages/admin/NewsletterDashboard";
import NewsletterComposer from "./pages/admin/NewsletterComposer";
import NewsletterLogs from "./pages/admin/NewsletterLogs";


const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/blog" element={<Blog />} />
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
              <Route path="project-dashboard" element={<ProjectDashboard />} />
              <Route path="project-editor" element={<ProjectEditor />} />
                <Route path="asset-gallery" element={<AssetGallery />} />
                <Route path="prompt-library" element={<PromptLibraryDashboard />} />
                <Route path="prompt-editor" element={<PromptEditor />} />
              <Route path="newsletter-dashboard" element={<NewsletterDashboard />} />
              <Route path="newsletter-composer" element={<NewsletterComposer />} />
              <Route path="newsletter-logs" element={<NewsletterLogs />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

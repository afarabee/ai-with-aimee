import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AgentsArentTheAnswer from "./pages/AgentsArentTheAnswer";


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
            <Route path="/blog/agents-arent-always-the-answer" element={<AgentsArentTheAnswer />} />
            <Route path="/blog/agents-arent-the-answer" element={<Navigate to="/blog/agents-arent-always-the-answer" replace />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

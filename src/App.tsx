import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const queryClient = new QueryClient();

const App = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('knowledge_sources') // Replace with your table name
        .select('*');

      if (error) {
        setError(error.message);
      } else {
        setData(data || []);
      }
    };

    fetchData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      <div>
        <h1>Knowledge Sources</h1>
        {error && <p>Error: {error}</p>}
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li> // Replace 'id' and 'name' with your table's fields
          ))}
        </ul>
      </div>
    </QueryClientProvider>
  );
};

export default App;

VITE_SUPABASE_URL=https://inclticnisqmlnkolwlu.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluY2x0aWNuaXNxbWxua29sd2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDE3MTUsImV4cCI6MjA1ODQ3NzcxNX0.z5AF_lORtEU0hmXr8oe-x4ldbe249e4sPgY6BJqv4XY

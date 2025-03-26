
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const queryClient = new QueryClient();

const App = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('*');

        if (error) {
          console.error('Error fetching data:', error);
          setError(error.message);
        } else {
          setData(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
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
      <div className="container mx-auto p-4 mt-8">
        <h1 className="text-2xl font-bold mb-4">Knowledge Sources</h1>
        {loading && <p>Loading data...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && data.length === 0 && (
          <p>No knowledge sources found.</p>
        )}
        <ul className="space-y-2 mt-4">
          {data.map((item) => (
            <li key={item.id} className="p-3 border rounded shadow-sm">
              {item.title}
            </li>
          ))}
        </ul>
      </div>
    </QueryClientProvider>
  );
};

export default App;

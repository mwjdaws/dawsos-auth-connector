
import { TagPanel } from "@/components";

const DashboardPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tag Generator</h2>
          <TagPanel />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

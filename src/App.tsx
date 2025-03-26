
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            DawsOS
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            AI-augmented knowledge management system
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>
    </div>
  );
}

export default App;

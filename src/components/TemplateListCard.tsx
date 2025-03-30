
import { KnowledgeTemplate } from "@/services/api/types";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Check } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { forwardRef } from "react";

interface TemplateListCardProps {
  templates: KnowledgeTemplate[];
  loading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    count: number;
  };
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handlePageChange: (page: number) => void;
  handleTemplateSelect: (template: KnowledgeTemplate) => void;
  filterType: 'all' | 'global' | 'custom';
  onFilterChange: (type: 'all' | 'global' | 'custom') => void;
  selectedTemplateId?: string | null; // Added this property to fix the type error
}

export const TemplateListCard = forwardRef<HTMLDivElement, TemplateListCardProps>(({
  templates,
  loading,
  pagination,
  searchQuery,
  setSearchQuery,
  handlePageChange,
  handleTemplateSelect,
  filterType,
  onFilterChange,
  selectedTemplateId
}, ref) => {
  return (
    <Card ref={ref}>
      <CardHeader>
        <CardTitle>Template Library</CardTitle>
        <CardDescription>Browse and select from available templates</CardDescription>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Tabs value={filterType} onValueChange={(v) => onFilterChange(v as any)} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="global">Global</TabsTrigger>
              <TabsTrigger value="custom">My Templates</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery 
              ? "No templates found matching your search." 
              : filterType === 'custom' 
                ? "You haven't created any templates yet."
                : "No templates available."}
          </div>
        ) : (
          <Table>
            <TableCaption>
              <div className="flex justify-between items-center">
                <div>
                  {pagination.count} template{pagination.count !== 1 ? 's' : ''} found
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-2">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id} className={selectedTemplateId === template.id ? "bg-primary/10" : ""}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.is_global ? 'Global' : 'Custom'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={selectedTemplateId === template.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {selectedTemplateId === template.id ? "Selected" : "Select"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
});

TemplateListCard.displayName = "TemplateListCard";

export default TemplateListCard;

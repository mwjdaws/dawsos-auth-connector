
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { KnowledgeTemplate } from "@/services/api/types";

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
}

export function TemplateListCard({
  templates,
  loading,
  pagination,
  searchQuery,
  setSearchQuery,
  handlePageChange,
  handleTemplateSelect
}: TemplateListCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Available Templates</CardTitle>
          <div className="w-64">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <TemplateListSkeleton />
        ) : templates.length > 0 ? (
          <TemplateTable 
            templates={templates} 
            searchQuery={searchQuery} 
            handleTemplateSelect={handleTemplateSelect} 
          />
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            No templates found.
          </div>
        )}
      </CardContent>
      {pagination.totalPages > 1 && (
        <CardFooter>
          <TemplatePagination 
            pagination={pagination} 
            handlePageChange={handlePageChange} 
          />
        </CardFooter>
      )}
    </Card>
  );
}

function TemplateListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-10 bg-muted rounded animate-pulse" />
      ))}
    </div>
  );
}

function TemplateTable({ 
  templates, 
  searchQuery, 
  handleTemplateSelect 
}: { 
  templates: KnowledgeTemplate[];
  searchQuery: string;
  handleTemplateSelect: (template: KnowledgeTemplate) => void;
}) {
  const filteredTemplates = templates.filter(template => 
    searchQuery.trim() === "" || 
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Preview</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredTemplates.map((template) => (
          <TableRow key={template.id}>
            <TableCell className="font-medium">{template.name}</TableCell>
            <TableCell className="max-w-xs truncate">
              {template.content.slice(0, 50)}...
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleTemplateSelect(template)}
                className="flex items-center gap-1"
              >
                <span>Select</span>
                <ArrowRight size={14} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TemplatePagination({ 
  pagination, 
  handlePageChange 
}: { 
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    count: number;
  };
  handlePageChange: (page: number) => void;
}) {
  return (
    <Pagination className="w-full">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => handlePageChange(Math.max(1, pagination.page - 1))} 
            className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {[...Array(pagination.totalPages)].map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i + 1 === pagination.page}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))} 
            className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

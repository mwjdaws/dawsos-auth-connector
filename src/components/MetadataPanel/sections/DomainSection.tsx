
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DomainSectionProps {
  domain: string | null;
}

export function DomainSection({ domain }: DomainSectionProps) {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Domain</CardTitle>
      </CardHeader>
      <CardContent>
        {domain ? (
          <Badge variant="outline" className="flex gap-1 items-center">
            <FolderIcon className="h-3 w-3" />
            <span>{domain}</span>
          </Badge>
        ) : (
          <div className="text-sm text-muted-foreground">No domain assigned</div>
        )}
      </CardContent>
    </Card>
  );
}

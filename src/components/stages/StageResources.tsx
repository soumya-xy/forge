"use client";

import { ResourceItem } from "@/lib/resources-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, RefreshCw, Bookmark } from "lucide-react";

interface StageResourcesProps {
  matched?: ResourceItem[];
  onReset: () => void;
}

export default function StageResources({ matched, onReset }: StageResourcesProps) {
  if (!matched) return null;

  const categories = Array.from(new Set(matched.map(r => r.category)));

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-headline">Verified Launchpad</h2>
        <p className="text-muted-foreground">Based on your chosen path, we've filtered the top tools and grants to help you move from zero to one.</p>
      </div>

      <div className="space-y-12">
        {categories.map(cat => (
          <section key={cat} className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">{cat}</h3>
              <div className="flex-1 h-[1px] bg-border" />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {matched.filter(r => r.category === cat).map(resource => (
                <a 
                  key={resource.id} 
                  href={resource.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="h-full border-border shadow-none hover:border-primary hover:shadow-md transition-all">
                    <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{resource.icon}</span>
                        <CardTitle className="text-sm font-headline group-hover:text-primary transition-colors">{resource.name}</CardTitle>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-muted-foreground leading-relaxed">{resource.description}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="pt-20 border-t border-border flex flex-col items-center gap-6">
        <p className="text-sm text-center text-muted-foreground max-w-sm italic">
          "The best way to predict the future is to create it."
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onReset} className="border-border hover:bg-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Start New Project
          </Button>
          <Button variant="default" className="bg-primary hover:bg-primary/90 flex items-center gap-2" onClick={() => window.print()}>
            <Bookmark className="w-4 h-4" />
            Export Plan (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
}
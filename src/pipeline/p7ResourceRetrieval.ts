'use server';

import fs from 'fs';
import path from 'path';
import { ResourceItem } from '@/types/types';
import { ResourceCategory } from '@/types/enums';

let cachedResources: ResourceItem[] | null = null;

async function loadResources(): Promise<ResourceItem[]> {
  if (cachedResources) {
    return cachedResources;
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'resources.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(fileContent);
    cachedResources = parsed as ResourceItem[];
    return cachedResources;
  } catch (error) {
    console.error('[P7 Resource Retrieval Error] Failed to load resources.json:', error);
    return [];
  }
}

export async function runP7ResourceRetrieval(categories: ResourceCategory[]): Promise<ResourceItem[]> {
  const allResources = await loadResources();
  
  if (!categories || categories.length === 0) {
    return [];
  }

  // Filter resources whose category matches any of the requested categories
  return allResources.filter((resource) =>
    categories.includes(resource.category)
  );
}

import { config } from 'dotenv';
config();

import '@/ai/flows/idea-intake-parser.ts';
import '@/ai/flows/scenario-persona-tool.ts';
import '@/ai/flows/milestone-synthesis-tool.ts';
import '@/ai/flows/resource-mapping-tool-flow.ts';
import '@/ai/flows/automated-risk-register.ts';
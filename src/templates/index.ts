import type { TemplateComponent, TemplateConfig } from '../types/resume';
import { TEMPLATES } from '../types/resume';
import ClassicTemplate from './classic/ClassicTemplate';
import ModernTemplate from './modern/ModernTemplate';
import HybridTemplate from './hybrid/HybridTemplate';

const templateMap: Record<string, TemplateComponent> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  hybrid: HybridTemplate,
};

export { TEMPLATES };
export { ClassicTemplate, ModernTemplate, HybridTemplate };

export function getTemplate(id: string): TemplateComponent | undefined {
  return templateMap[id];
}

export function getTemplateConfig(id: string): TemplateConfig | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

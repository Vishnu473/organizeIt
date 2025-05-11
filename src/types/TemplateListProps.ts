import type { Template } from "./Template";

export interface TemplateListProps {
  onEditTemplate: (template: Template) => void;
  onPreviewTemplate: (template: Template) => void;
}
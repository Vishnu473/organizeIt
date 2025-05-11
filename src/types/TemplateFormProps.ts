import type { Template } from "./Template";

export interface TemplateFormProps {
  initialTemplate?: Template | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface TemplatePreviewProps {
  template: Template;
  onClose: () => void;
}

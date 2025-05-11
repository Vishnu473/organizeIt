import { XIcon } from "lucide-react";
import type { Field } from "../../types/Template";
import type { TemplatePreviewProps } from "../../types/TemplateFormProps";

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onClose }) => {
  const renderField = (field: Field) => {
    const baseInputClasses = "w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white";
    const labelClasses = "block mb-1 text-sm font-medium dark:text-gray-300";
    
    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="mb-4">
            <label className={labelClasses}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              placeholder={field.placeholder}
              className={baseInputClasses}
              required={field.required}
            />
          </div>
        );
        
      case 'textarea':
        return (
          <div key={field.id} className="mb-4">
            <label className={labelClasses}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              placeholder={field.placeholder}
              className={`${baseInputClasses} min-h-[100px]`}
              required={field.required}
            />
          </div>
        );
        
      case 'number':
        return (
          <div key={field.id} className="mb-4">
            <label className={labelClasses}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              placeholder={field.placeholder}
              className={baseInputClasses}
              required={field.required}
            />
          </div>
        );
        
      case 'email':
        return (
          <div key={field.id} className="mb-4">
            <label className={labelClasses}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="email"
              placeholder={field.placeholder}
              className={baseInputClasses}
              required={field.required}
            />
          </div>
        );
        
      case 'select':
        return (
          <div key={field.id} className="mb-4">
            <label className={labelClasses}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select className={baseInputClasses} required={field.required}>
              <option value="" disabled selected hidden>
                {field.placeholder || 'Select an option'}
              </option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
        
      case 'checkbox':
        return (
          <div key={field.id} className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`preview-${field.id}`}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                required={field.required}
              />
              <label htmlFor={`preview-${field.id}`} className="ml-2 text-sm dark:text-gray-300">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            </div>
          </div>
        );
        
      case 'date':
        return (
          <div key={field.id} className="mb-4">
            <label className={labelClasses}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="date"
              className={baseInputClasses}
              required={field.required}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const getPreviewStyle = () => {
    const theme = template.theme || {};
    
    return {
      '--primary-color': theme.color || '#3b82f6',
      '--font-family': theme.font || 'Inter',
      fontFamily: theme.font || 'Inter',
    } as React.CSSProperties;
  };
  
  const getLayoutClass = () => {
    const layout = template.theme?.layout || 'standard';
    
    switch (layout) {
      case 'compact':
        return 'max-w-md mx-auto';
      case 'wide':
        return 'max-w-3xl mx-auto';
      default:
        return 'max-w-xl mx-auto';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium dark:text-white">
            Preview: {template.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div 
            className={`p-6 border rounded-md shadow-sm dark:border-gray-700 ${getLayoutClass()}`}
            style={getPreviewStyle()}
          >
            <div className="mb-6">
              <h2 
                className="text-xl font-bold mb-2 dark:text-white"
                style={{ color: template.theme?.color }}
              >
                {template.name}
              </h2>
              {template.description && (
                <p className="text-gray-600 dark:text-gray-300">{template.description}</p>
              )}
            </div>
            
            <form className="space-y-4">
              {template.fields.map(field => renderField(field))}
              
              <div className="pt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md text-white"
                  style={{ backgroundColor: template.theme?.color || '#3b82f6' }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="p-4 border-t dark:border-gray-700 flex justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Used {template.usage_count} times
          </div>
          <div>
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
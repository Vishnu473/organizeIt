import { useEffect, useState } from "react";
import type { Field, Template, Theme } from "../../types/Template";
import type { TemplateFormProps } from "../../types/TemplateFormProps";
import { v4 as uuidv4 } from 'uuid';
import { createTemplate, updateTemplate } from "../../Services/TemplateService";
import { AlertTriangle, PlusIcon, XIcon } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";

export const TemplateForm: React.FC<TemplateFormProps> = ({ initialTemplate, onSuccess, onCancel }) => {
  const isEditing = !!initialTemplate;
  const {user} = useAuth();
  
  const [formData, setFormData] = useState<Omit<Template, 'id' | 'created_at' | 'updated_at' | 'usage_count'>>({
    user_id: user?.id, // This would come from auth context in real app
    name: '',
    description: '',
    fields: [],
    theme: {
      color: '#3b82f6',
      layout: 'standard',
      font: 'Inter',
    },
    tags: [],
    is_archived: false,
    shared: false,
    shared_slug: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  const [newFieldData, setNewFieldData] = useState<Omit<Field, 'id'>>({
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    options: [],
  });
  const [newOption, setNewOption] = useState('');
  
  useEffect(() => {
    if (initialTemplate) {
      setFormData({
        user_id: initialTemplate.user_id,
        name: initialTemplate.name,
        description: initialTemplate.description || '',
        fields: initialTemplate.fields,
        theme: initialTemplate.theme || {
          color: '#3b82f6',
          layout: 'standard',
          font: 'Inter',
        },
        tags: initialTemplate.tags || [],
        is_archived: initialTemplate.is_archived,
        shared: initialTemplate.shared,
        shared_slug: initialTemplate.shared_slug,
      });
    }
  }, [initialTemplate]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }
    
    if (formData.fields.length === 0) {
      newErrors.fields = 'At least one field is required';
    }
    
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditing && initialTemplate) {
        await updateTemplate(initialTemplate.id, formData);
      } else {
        console.log("FormData => ",formData);
        
        await createTemplate(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving template:', error);
      setErrors({ form: 'Failed to save template. Please try again.' });
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      theme: {
        ...prev.theme as Theme,
        [name]: value
      }
    }));
  };
  
  const addTag = () => {
    if (!newTag.trim()) return;
    
    if (!formData.tags?.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
    }
    
    setNewTag('');
  };
  
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };
  
  const addField = () => {
    if (!newFieldData.label.trim()) {
      setErrors(prev => ({ ...prev, newField: 'Field label is required' }));
      return;
    }
    
    const newField: Field = {
      ...newFieldData,
      id: uuidv4(),
      options: newFieldData.type === 'select' ? [...newFieldData.options as string[]] : undefined
    };
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    
    // Reset new field data
    setNewFieldData({
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: [],
    });
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.newField;
      delete newErrors.fields;
      return newErrors;
    });
  };
  
  // const updateField = (index: number, field: Partial<Field>) => {
  //   const updatedFields = [...formData.fields];
  //   updatedFields[index] = { ...updatedFields[index], ...field };
    
  //   setFormData(prev => ({
  //     ...prev,
  //     fields: updatedFields
  //   }));
  // };
  
  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };
  
  const addOption = () => {
    if (!newOption.trim()) return;
    
    setNewFieldData(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption.trim()]
    }));
    
    setNewOption('');
  };
  
  const removeOption = (index: number) => {
    setNewFieldData(prev => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index)
    }));
  };
  
  const handleFieldTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as Field['type'];
    
    setNewFieldData(prev => ({
      ...prev,
      type: newType,
      options: newType === 'select' ? (prev.options || []) : undefined
    }));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">{isEditing ? 'Edit' : 'Create'} Template</h2>
      </div>
      
      {errors.form && (
        <div className="p-3 bg-red-100 border border-red-200 rounded-md text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {errors.form}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block mb-1 font-medium dark:text-white">
              Template Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                errors.name ? 'border-red-500 dark:border-red-500' : ''
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label className="block mb-1 font-medium dark:text-white">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium dark:text-white">
              Theme Settings
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 dark:text-gray-300">
                  Primary Color
                </label>
                <input
                  type="color"
                  name="color"
                  value={formData.theme?.color || '#3b82f6'}
                  onChange={handleThemeChange}
                  className="w-full h-10 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1 dark:text-gray-300">
                  Layout
                </label>
                <select
                  name="layout"
                  value={formData.theme?.layout || 'standard'}
                  onChange={handleThemeChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="standard">Standard</option>
                  <option value="compact">Compact</option>
                  <option value="wide">Wide</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-1 dark:text-gray-300">
                  Font
                </label>
                <select
                  name="font"
                  value={formData.theme?.font || 'Inter'}
                  onChange={handleThemeChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block mb-2 font-medium dark:text-white">
              Tags
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2 border rounded-l-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                  >
                    <span className="text-sm text-gray-800 dark:text-gray-200">{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-800 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="shared"
                name="shared"
                checked={formData.shared}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="shared" className="ml-2 text-sm dark:text-white">
                Share publicly
              </label>
            </div>
            
            {/* {formData.shared && (
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">/template/</span>
                  <input
                    type="text"
                    name="shared_slug"
                    value={formData.shared_slug}
                    onChange={handleChange}
                    placeholder="unique-slug"
                    className={`flex-1 px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                      errors.shared_slug ? 'border-red-500 dark:border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.shared_slug && (
                  <p className="mt-1 text-xs text-red-500">{errors.shared_slug}</p>
                )}
              </div>
            )} */}
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium dark:text-white">
                Fields *
              </label>
              {errors.fields && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {errors.fields}
                </p>
              )}
            </div>
            
            <div className="space-y-4 mb-6">
              {formData.fields.length > 0 ? (
                formData.fields.map((field, index) => (
                  <div 
                    key={field.id} 
                    className="p-3 border rounded-md dark:border-gray-700 dark:bg-gray-800/50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span className="font-medium mr-2 dark:text-white">{field.label}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {field.type}
                        </span>
                        {field.required && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                            Required
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {field.placeholder && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Placeholder: {field.placeholder}
                      </p>
                    )}
                    
                    {field.type === 'select' && field.options && field.options.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Options:</p>
                        <div className="flex flex-wrap gap-1">
                          {field.options.map((option, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center border border-dashed rounded-md text-gray-500 dark:text-gray-400 dark:border-gray-700">
                  No fields added yet. Add fields to create your template.
                </div>
              )}
            </div>
            
            <div className="border-t pt-4 dark:border-gray-700">
              <h4 className="font-medium mb-3 dark:text-white">Add New Field</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <input
                    type="text"
                    value={newFieldData.label}
                    onChange={(e) => setNewFieldData({ ...newFieldData, label: e.target.value })}
                    placeholder="Field Label *"
                    className={`w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                      errors.newField ? 'border-red-500 dark:border-red-500' : ''
                    }`}
                  />
                  {errors.newField && (
                    <p className="mt-1 text-xs text-red-500">{errors.newField}</p>
                  )}
                </div>
                
                <div>
                  <select
                    value={newFieldData.type}
                    onChange={handleFieldTypeChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Text Area</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="select">Select</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="date">Date</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <input
                    type="text"
                    value={newFieldData.placeholder || ''}
                    onChange={(e) => setNewFieldData({ ...newFieldData, placeholder: e.target.value })}
                    placeholder="Placeholder text (optional)"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="field-required"
                    checked={newFieldData.required}
                    onChange={(e) => setNewFieldData({ ...newFieldData, required: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label htmlFor="field-required" className="ml-2 text-sm dark:text-white">
                    Required field
                  </label>
                </div>
              </div>
              
              {newFieldData.type === 'select' && (
                <div className="mb-3">
                  <label className="block text-sm mb-1 dark:text-gray-300">
                    Options
                  </label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add an option..."
                      className="flex-1 px-3 py-2 border rounded-l-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                    />
                    <button
                      type="button"
                      onClick={addOption}
                      className="px-3 py-2 bg-gray-200 text-gray-800 rounded-r-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      Add
                    </button>
                  </div>
                  
                  {newFieldData.options && newFieldData.options.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newFieldData.options.map((option, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
                        >
                          <span className="text-sm text-gray-800 dark:text-gray-200">{option}</span>
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="ml-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <button
                type="button"
                onClick={addField}
                className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 flex items-center justify-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Field
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {isEditing ? 'Update' : 'Create'} Template
        </button>
      </div>
    </form>
  );
};
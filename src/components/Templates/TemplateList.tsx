import { ArchiveIcon, EyeIcon, PencilIcon, ShareIcon, TrashIcon } from "lucide-react";
import type { Template } from "../../types/Template";
import type { TemplateListProps } from "../../types/TemplateListProps";
import { useEffect, useState } from "react";
import { archiveTemplate, deleteTemplate, fetchTemplates } from "../../Services/TemplateService";

export const TemplateList: React.FC<TemplateListProps> = ({ onEditTemplate, onPreviewTemplate }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await fetchTemplates(showArchived);
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadTemplates();
  }, [showArchived]);
  
  const handleArchive = async (id: string) => {
    try {
      await archiveTemplate(id);
      loadTemplates();
    } catch (error) {
      console.error('Error archiving template:', error);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      try {
        await deleteTemplate(id);
        loadTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(templates.flatMap(t => t.tags || []))
  ).sort();
  
  // Filter templates based on search and tags
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => template.tags?.includes(tag) || false);
    
    return matchesSearch && matchesTags;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">Templates</h2>
        <div className="flex space-x-2">
          <label className="flex items-center dark:text-gray-300">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={() => setShowArchived(!showArchived)}
              className="mr-2 rounded dark:bg-gray-700"
            />
            Show Archived
          </label>
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        
        <div className="flex-1">
          <select
            multiple
            value={selectedTags}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedTags(selected);
            }}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-8 dark:text-gray-400">
          No templates found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template:Template) => (
            <div 
              key={template.id} 
              className={`border rounded-lg shadow-sm p-4 transition duration-200 hover:shadow-md ${
                template.is_archived ? 'bg-gray-100 dark:bg-gray-800/50 opacity-75' : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold truncate dark:text-white">{template.name}</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => onEditTemplate(template)}
                    className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                    title="Edit template"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onPreviewTemplate(template)}
                    className="p-1 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400"
                    title="Preview template"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleArchive(template.id)}
                    className="p-1 text-gray-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-400"
                    title={template.is_archived ? "Unarchive template" : "Archive template"}
                  >
                    <ArchiveIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    title="Delete template"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {template.description && (
                <p className="text-sm text-gray-600 mb-3 dark:text-gray-300">{template.description}</p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div>
                  {template.fields.length} fields
                </div>
                <div>
                  Used {template.usage_count} times
                </div>
              </div>
              
              {template.shared && (
                <div className="mt-2 flex items-center text-xs text-blue-500 dark:text-blue-400">
                  <ShareIcon className="h-3 w-3 mr-1" />
                  Shared as /{template.shared_slug}
                </div>
              )}
              
              {template.tags && template.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {template.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
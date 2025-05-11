import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Template } from "../types/Template";
import { PlusIcon } from "lucide-react";
import { TemplateList } from "../components/Templates/TemplateList";
import { TemplateForm } from "../components/Templates/TemplateForm";
import { TemplatePreview } from "../components/Templates/TemplatePreview";

const TemplateManager: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine initial view based on URL path
  const getInitialView = () => {
    const path = location.pathname;
    if (path.endsWith("/create")) return "create";
    if (path.endsWith("/edit")) return "edit";
    return "list";
  };
  
  const [view, setView] = useState<'list' | 'create' | 'edit'>(getInitialView);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    location.state?.template || null
  );
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  
  // Sync view state with URL
  useEffect(() => {
    const newView = getInitialView();
    setView(newView);
    
    // Handle template data from navigation state
    if (location.state?.template && newView === 'edit') {
      setSelectedTemplate(location.state.template);
    }
  }, [location.pathname]);
  
  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    navigate("edit", { state: { template } });
  };
  
  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };
  
  const handleCreateSuccess = () => {
    navigate("/templates"); // Navigate back to the main templates list
  };
  
  const handleCancel = () => {
    navigate(-1); // Go back in browser history
  };
  
  const handleCreateNew = () => {
    navigate("create");
  };
  
  return (
    <div className="min-h-screen dark:bg-gray-900 bg-blue-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 pb-2 border-b dark:border-b-gray-700">
          <h1 className="text-3xl font-bold dark:text-white">Template Manager</h1>
          
          <div className="flex items-center space-x-4">
            {view === 'list' && (
              <button
                onClick={handleCreateNew}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                New Template
              </button>
            )}
          </div>
        </div>
        
        {view === 'list' && (
          <TemplateList 
            onEditTemplate={handleEditTemplate} 
            onPreviewTemplate={handlePreviewTemplate} 
          />
        )}
        
        {(view === 'create' || view === 'edit') && (
          <TemplateForm
            initialTemplate={view === 'edit' ? selectedTemplate : null}
            onSuccess={handleCreateSuccess}
            onCancel={handleCancel}
          />
        )}
        
        {showPreview && previewTemplate && (
          <TemplatePreview 
            template={previewTemplate} 
            onClose={() => {
              setShowPreview(false);
              setPreviewTemplate(null);
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default TemplateManager;
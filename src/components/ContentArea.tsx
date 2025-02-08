'use client'
import React, { FC, useState } from "react";
import { ChevronDown } from "lucide-react";
import { toolbarConfig, getInitialConfig, ToolConfig, generateContent, ToolbarProps } from "./ToolbarConfig";

// Notification types
type NotificationType = 'success' | 'error';
type Notification = {
  message: string;
  type: NotificationType;
  id: number;
};

const menuItems = [
  "Linkedin Post Generation",
  "Press Release Generation",
  "Wikipedia Post Generation",
  "Marketing Copy Generation",
  "Cover Letter Generation",
  "Business Contract Generation",
  "IEEE Paper Generation", 
  "Miscellaneous Content"
] as const;

type ContentType = typeof menuItems[number];

// Content-specific validation messages
const contentValidationMessages: Partial<Record<ContentType, string>> = {
  "Linkedin Post Generation": "Please provide the context for your LinkedIn post.",
  "Press Release Generation": "Please provide the announcement details for your press release.",
  "Wikipedia Post Generation": "Please provide the post context for your Wikipedia article.",
  "Marketing Copy Generation": "Please provide information about the intended market, industry or sector and target audience with the expected impact.",
  "Cover Letter Generation": "Please provide the company, role, years of experience, and job description for your cover letter.",
  "Business Contract Generation": "Please provide the beneficiary name, stakeholder name, project description, and duration for the business contract.",
  "IEEE Paper Generation": "Please provide the title, abstract, keywords, and context for your IEEE paper.",
  "Miscellaneous Content": "Please provide the context of the content you are wishing to develop."
};

const ContentArea: FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<ContentType | null>(null);
  const [toolConfig, setToolConfig] = useState<ToolConfig>(getInitialConfig("Linkedin Post Generation"));
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { message, type, id }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 3000);
  };

  const validateConfig = (config: ToolConfig, contentType: ContentType) => {
    if (contentType === "Cover Letter Generation") {
      if (!config.company || !config.role || !config.jobDescription || config.yearsOfExperience === undefined) {
        return {
          isValid: false,
          message: contentValidationMessages[contentType] || "Please provide all required information for the cover letter."
        };
      }
    } else if (contentType === "Business Contract Generation") {
      if (!config.beneficiaryName || !config.stakeholderName || !config.projectDescription || !config.duration) {
        return {
          isValid: false,
          message: contentValidationMessages[contentType] || "Please provide all required information for the business contract."
        };
      }
    } else if (contentType === "IEEE Paper Generation") {
      if (!config.title || !config.abstract || !config.keywords || !config.context) {
        return {
          isValid: false,
          message: contentValidationMessages[contentType] || "Please provide all required information for the IEEE paper."
        };
      }
    }
    else if (!config.context) {
      return { 
        isValid: false, 
        message: contentValidationMessages[contentType] || `Please provide details for ${contentType.toLowerCase()}.`
      };
    }
    return { isValid: true };
  };

  const handleGenerate = async () => {
    if (!selectedMenu) {
      showNotification("Please select a content generation tool.", "error");
      return;
    }

    const validation = validateConfig(toolConfig, selectedMenu);
    if (!validation.isValid) {
      showNotification(validation.message || "Please provide all required information.", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const content = await generateContent({
        ...toolConfig,
        toolType: selectedMenu
      });
      setGeneratedContent(content);
      showNotification(`Your ${selectedMenu.toLowerCase()} has been generated successfully.`, "success");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to generate content", 
        "error"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMenuSelect = (menu: ContentType) => {
    setSelectedMenu(menu);
    setToolConfig(getInitialConfig(menu));
    setGeneratedContent("");
  };

  const handleConfigChange = (newConfig: Partial<ToolConfig>) => {
    setToolConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  const handleCopy = async () => {
    if (generatedContent) {
      try {
        await navigator.clipboard.writeText(generatedContent);
        showNotification("Content copied to clipboard", "success");
      } catch (error) {
        showNotification("Failed to copy content to clipboard", "error");
      }
    }
  };

  const getPlaceholderText = (contentType: ContentType | null) => {
    switch (contentType) {
      case "Wikipedia Post Generation":
        return "Your generated wikipedia article will appear here...";
      case "Press Release Generation":
        return "Your generated press release will appear here...";
      case "Linkedin Post Generation":
        return "Your generated LinkedIn post will appear here...";
      case "Marketing Copy Generation":
        return "Your generated Marketing copy will appear here...";
      case "Cover Letter Generation":
        return "Your generated cover letter will appear here...";
      case "Business Contract Generation":
        return "Your generated business contract will appear here...";
      case "IEEE Paper Generation": 
        return "Your generated IEEE research paper will appear here...";
      case "Miscellaneous Content": 
        return "Your miscellaneous content generations will appear here...";
      default:
        return "Generated content will appear here...";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(({ message, type, id }) => (
          <div
            key={id}
            className={`px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 ${
              type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {message}
          </div>
        ))}
      </div>

      {/* Desktop Layout (>= 1280px) */}
      <div className="hidden lg:block p-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 flex flex-col space-y-4">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => handleMenuSelect(item)}
                className={`p-4 text-center border rounded-md transition-all duration-200 ${
                  selectedMenu === item 
                    ? "bg-gray-700 border-blue-500 shadow-lg" 
                    : "border-blue-500/50 hover:bg-gray-700 hover:border-blue-500"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="col-span-9">
            <div className="bg-gray-900 p-6 rounded-md h-full flex flex-col gap-4">
              <h2 className="text-center text-xl font-bold">
                {selectedMenu || "Select a Content Type"}
              </h2>

              <div className="flex flex-col bg-gray-700 p-4 rounded-md space-y-4">
                {selectedMenu && toolbarConfig[selectedMenu] ? (
                  React.createElement(toolbarConfig[selectedMenu], {
                    config: toolConfig,
                    onConfigChange: handleConfigChange
                  })
                ) : (
                  <p className="text-sm text-white">Select a tool to see options.</p>
                )}
              </div>

              <div className="relative bg-gray-800 p-4 rounded-md flex-grow min-h-[200px]">
                {!selectedMenu ? (
                  <div className="w-full h-full min-h-[200px] flex items-center justify-center text-center text-4xl font-bold text-white opacity-50">
                    Choose a Generation
                  </div>
                ) : (
                  <textarea
                    className="w-full h-full min-h-[200px] bg-transparent text-white outline-none resize-none"
                    placeholder={getPlaceholderText(selectedMenu)}
                    value={generatedContent}
                    readOnly
                  />
                )}
                {generatedContent && (
                  <button
                    className="absolute top-4 right-4 p-2 text-white hover:text-green-500 transition-colors"
                    onClick={handleCopy}
                    aria-label="Copy to clipboard"
                  >
                    📋
                  </button>
                )}
              </div>

              <button 
                className={`px-6 py-2 mx-auto rounded-full border border-green-500 transition-all duration-200
                  ${isGenerating 
                    ? 'bg-gray-700 opacity-50 cursor-not-allowed' 
                    : 'bg-gray-800 hover:bg-gray-700 hover:shadow-lg'
                  }`}
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Content'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout (< 1280px) */}
      <div className="lg:hidden p-2 max-w-full">
        <div className="flex flex-col space-y-4 w-full">
          {/* Content Type Dropdown - Full width row */}
          <div className="relative dropdown-container w-full">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-3 bg-gray-800 rounded-md flex items-center justify-between border border-gray-700 text-sm"
            >
              <span className="truncate mr-2">{selectedMenu || "Type of Content"}</span>
              <ChevronDown className={`transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                {menuItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      handleMenuSelect(item);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full p-3 text-left hover:bg-gray-700 transition-colors text-sm break-words"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tool Configuration Area - Each control gets its own row */}
          <div className="bg-gray-800 p-3 rounded-md w-full">
    <h3 className="text-base font-semibold mb-3">Tool Box</h3>
    <div className="flex flex-col space-y-4">
      {selectedMenu && toolbarConfig[selectedMenu] ? (
        React.createElement(toolbarConfig[selectedMenu], {
          config: toolConfig,
          onConfigChange: handleConfigChange,
          isMobile: true
        } as ToolbarProps) // Add type assertion here
      ) : (
        <p className="text-sm text-gray-400">Select a content type to see options</p>
      )}
    </div>
  </div>

          {/* Content Display Area - Full width row */}
          <div className="relative bg-gray-800 p-3 rounded-md min-h-[150px] w-full">
            {!selectedMenu ? (
              <div className="w-full h-full min-h-[150px] flex items-center justify-center text-center text-base font-bold text-gray-500">
                Choose a Generation Type
              </div>
            ) : (
              <textarea
                className="w-full h-full min-h-[150px] bg-transparent text-white outline-none resize-none text-sm"
                placeholder={getPlaceholderText(selectedMenu)}
                value={generatedContent}
                readOnly
              />
            )}
            {generatedContent && (
              <button
                className="absolute top-2 right-2 p-2 text-white hover:text-green-500 transition-colors"
                onClick={handleCopy}
                aria-label="Copy to clipboard"
              >
                📋
              </button>
            )}
          </div>

          {/* Generate Button - Full width row */}
          <button 
            className={`w-full px-4 py-2 rounded-full border border-green-500 transition-all duration-200 text-sm
              ${isGenerating 
                ? 'bg-gray-700 opacity-50 cursor-not-allowed' 
                : 'bg-gray-800 hover:bg-gray-700 hover:shadow-lg'
              }`}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Content'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentArea;
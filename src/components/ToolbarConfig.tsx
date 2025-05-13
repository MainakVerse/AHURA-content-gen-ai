'use client'
import { FC } from "react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // Import Input component
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// Define types for our configuration
export interface ToolConfig {
  [x: string]: any;

  

  wordCount: number;
  temperature: number;
  context: string;
  style: string;
  yearsOfExperience?: number; // Optional, only for Cover Letter
  company?: string; // Optional, only for Cover Letter
  role?: string; // Optional, only for Cover Letter
  jobDescription?: string; // Optional, only for Cover Letter
  beneficiaryName?: string; // Optional, only for Business Contract
  stakeholderName?: string; // Optional, only for Business Contract
  projectDescription?: string; // Optional, only for Business Contract
  duration?: number; // Optional, only for Business Contract
  title?: string; // Optional, only for IEEE Paper
  abstract?: string; // Optional, only for IEEE Paper
  keywords?: string; // Optional, only for IEEE Paper
}

export interface ToolbarProps {
  config: ToolConfig;
  onConfigChange: (newConfig: Partial<ToolConfig>) => void;
  isMobile?: boolean; // Add this line
}

// Generation parameters interface
export interface GenerationParams {
  wordCount: number;
  temperature: number;
  context: string;
  style: string;
  toolType: string;
  yearsOfExperience?: number; // Optional, only for Cover Letter
  company?: string; // Optional, only for Cover Letter
  role?: string; // Optional, only for Cover Letter
  jobDescription?: string; // Optional, only for Cover Letter
  beneficiaryName?: string; // Optional, only for Business Contract
  stakeholderName?: string; // Optional, only for Business Contract
  projectDescription?: string; // Optional, only for Business Contract
  duration?: number; // Optional, only for Business Contract
  title?: string; // Optional, only for IEEE Paper
  abstract?: string; // Optional, only for IEEE Paper
  keywords?: string; // Optional, only for IEEE Paper
}

// Prompt templates for different tools
const promptTemplates: Record<string, (params: GenerationParams) => string> = {
  "Linkedin Post Generation": (params) => `
    Generate a LinkedIn post with the following specifications:
    Topic/Context: ${params.context}
    Writing Style: ${params.style}
    Target Word Count: ${params.wordCount} words

    Make sure the content is engaging, professional, and suitable for LinkedIn's platform.
    The tone should match the requested "${params.style}" style.
    Focus on delivering value and insights related to the given context.
  `,
  "Press Release Generation": (params) => `
    Generate a press release with the following specifications:
    Topic/Context: ${params.context}
    Writing Style: ${params.style}
    Target Word Count: ${params.wordCount} words

    Follow standard press release format including:
    - Compelling headline
    - Location and date
    - Strong lead paragraph
    - Supporting details and quotes
    - Boilerplate company information

    The tone should match the requested "${params.style}" style while maintaining professionalism.
    Focus on newsworthy aspects and key messages from the given context.
  `,
  "Wikipedia Post Generation": (params) => `
    Generate an explanatory Wikipedia article with the following specifications:
    Topic/Context: ${params.context}
    Writing Style: ${params.style}
    Target Word Count: ${params.wordCount} words

    Follow standard article format including:
    - Intriguing starting paragraph
    - Early life
    - Career
    - Notable Achievements
    - Special Incidents
    - Impact
    - References

    The tone should match the requested "${params.style}" style while maintaining professionalism.
    Focus on reference worthy aspects and key messages from the given context.
  `,
  "Marketing Copy Generation": (params) => `
    Generate a compelling marketing copy with the following specifications:

    Topic/Context: ${params.context}
    Writing Style: ${params.style}
    Target Word Count: ${params.wordCount} words

    ### Structure:
    - **Attention-Grabbing Opening:** Hook the audience immediately.
    - **Pain Points & Solution:** Highlight user pain points and position the product/service as the solution.
    - **Key Benefits & Features:** Clearly communicate unique selling points (USPs).
    - **Social Proof & Trust Elements:** (if applicable) Include testimonials, case studies, or data points.
    - **Strong CTA:** Encourage the audience to take the desired action.

    The copy should be clear, concise, and persuasive, aligning with the target audience’s preferences following "${params.style}" style, while driving engagement and conversions.
  `,
  "Cover Letter Generation": (params) => `
    Generate a cover letter with the following specifications:
    Company: ${params.company}
    Role: ${params.role}
    Years of Experience: ${params.yearsOfExperience} years
    Job Description: ${params.jobDescription}
    Writing Style: ${params.style}

    The cover letter should be tailored to the company and role, highlighting relevant skills and experience from the job description.
    It should follow a standard cover letter format:
    - Your Contact Information
    - Date
    - Employer Contact Information
    - Salutation
    - Introduction: Briefly introduce yourself and state the position you're applying for.
    - Body Paragraphs: Highlight your relevant skills, experiences, and achievements that align with the job requirements. Quantify your achievements whenever possible.
    - Closing Paragraph: Reiterate your interest in the position and express your enthusiasm for the opportunity.
    - Closing: Thank the employer for their time and consideration.
    - Signature
  `,
  "Business Contract Generation": (params) => `
    Generate a business contract with the following specifications:
    Beneficiary Name: ${params.beneficiaryName}
    Stakeholder Name: ${params.stakeholderName}
    Project Description: ${params.projectDescription}
    Duration: ${params.duration} months
    Writing Style: ${params.style}

    The contract should include clauses related to:
    - Scope of work
    - Payment terms
    - Confidentiality
    - Termination conditions
    - Intellectual property rights
    - Dispute resolution

    The language should be clear, concise, and legally sound, suitable for a formal business agreement.
  `,
  "IEEE Paper Generation": (params) => `
  Generate an IEEE research paper with the following specifications:
  Title: ${params.title}
  Abstract: ${params.abstract}
  Keywords: ${params.keywords}
  Context: ${params.context}
  Writing Style: ${params.style}
  Follow the standard IEEE research paper format, including:
  - Abstract
  - Introduction
  - Related Work
  - Methodology
  - Results
  - Conclusion
  - References
  Ensure the paper is well-structured, technically sound, and adheres to IEEE guidelines.
`,
"Miscellaneous Content": (params) => `
    Generate a miscellaneous content:
    Topic/Context: ${params.context}
    Writing Style: ${params.style}
    Target Word Count: ${params.wordCount} words

    Make sure the content is engaging, informative, and suitable for all platform.
    The tone should match the requested "${params.style}" style. Focus on delivering value and insights related to the given context. Do not include any jargons or improper data, out of context information or any other kind of outliers.
  `,


};

// Content generation function
export const generateContent = async (params: GenerationParams): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Get the appropriate prompt template or use a default one
    const promptTemplate = promptTemplates[params.toolType] || promptTemplates["Linkedin Post Generation"];
    const prompt = promptTemplate(params);

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      generationConfig: {
        temperature: params.temperature,
        maxOutputTokens: 1024,
      },
    });

    const response = result.response;
    return response.text();
  } catch (error) {

    throw new Error('Failed to generate content. Please try again.');
  }
};

// Define initial configurations for different tools
export const defaultConfigs: Record<string, ToolConfig> = {
  "Linkedin Post Generation": {
    wordCount: 300,
    temperature: 1,
    context: "",
    style: "Formal"
  },
  "Press Release Generation": {
    wordCount: 250,
    temperature: 0.7,
    context: "",
    style: "Business"
  },
  "Wikipedia Post Generation": {
    wordCount: 2500,
    temperature: 1,
    context: "",
    style: "Accounting"
  },
  "Marketing Copy Generation": {
    wordCount: 50,
    temperature: 1.2,
    context: "",
    style: "Business"
  },
  "Cover Letter Generation": {
    wordCount: 300,
    temperature: 0.7,
    context: "",
    style: "Formal",
    yearsOfExperience: 1,
    company: "",
    role: "",
    jobDescription: ""
  },
  "Business Contract Generation": {  // Added default configuration
    wordCount: 750,
    temperature: 0.8,
    context: "",
    style: "Formal",
    beneficiaryName: "",
    stakeholderName: "",
    projectDescription: "",
    duration: 12
  },
  "IEEE Paper Generation": {

    wordCount: 3000,
    temperature: 0.7,
    context: "",
    style: "Technical",
    title: "",
    abstract: "",
    keywords: ""
  },
  "Miscellaneous Content": {
    wordCount: 250,
    temperature: 1.5,
    context: "",
    style: "Accounting"
  },
};

// Helper function to get initial config for a given tool
export const getInitialConfig = (toolType: string): ToolConfig => {
  return { ...defaultConfigs[toolType] };
};

const writingStyles = ["Business", "Formal", "Marketing", "Technical", "Accounting"];

// Create individual toolbar components for each tool type
export const LinkedInToolbar: FC<ToolbarProps> = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-6">
      {/* Three-column layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Word Count */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Word Count</label>
          <Slider
            defaultValue={[config.wordCount]}
            max={1000}
            step={50}
            onValueChange={(value) => onConfigChange({ wordCount: value[0] })}
          />
          <p className="text-xs text-white">Target: {config.wordCount} words</p>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Temperature</label>
          <Slider
            defaultValue={[config.temperature]}
            max={2}
            step={0.1}
            onValueChange={(value) => onConfigChange({ temperature: value[0] })}
          />
          <p className="text-xs text-white">Creativity: {config.temperature}</p>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Writing Style</label>
          <Select onValueChange={(value) => onConfigChange({ style: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a style" defaultValue={config.style} />
            </SelectTrigger>
            <SelectContent>
              {writingStyles.map((style) => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Context */}
      <div>
        <label className="block text-sm font-medium leading-6 text-white">Context</label>
        <Textarea
          placeholder="Enter the context for your LinkedIn post..."
          value={config.context}
          onChange={(e) => onConfigChange({ context: e.target.value })}
        />
      </div>
    </div>
  );
};

export const PressReleaseToolbar: FC<ToolbarProps> = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-6">
      {/* Three-column layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Word Count */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Word Count</label>
          <Slider
            defaultValue={[config.wordCount]}
            max={1000}
            step={50}
            onValueChange={(value) => onConfigChange({ wordCount: value[0] })}
          />
          <p className="text-xs text-white">Target: {config.wordCount} words</p>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Temperature</label>
          <Slider
            defaultValue={[config.temperature]}
            max={2}
            step={0.1}
            onValueChange={(value) => onConfigChange({ temperature: value[0] })}
          />
          <p className="text-xs text-white">Creativity: {config.temperature}</p>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Writing Style</label>
          <Select onValueChange={(value) => onConfigChange({ style: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a style" defaultValue={config.style} />
            </SelectTrigger>
            <SelectContent>
              {writingStyles.map((style) => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Context */}
      <div>
        <label className="block text-sm font-medium leading-6 text-white">Announcement Details</label>
        <Textarea
          placeholder="Enter the details of the announcement for the press release..."
          value={config.context}
          onChange={(e) => onConfigChange({ context: e.target.value })}
        />
      </div>
    </div>
  );
};

export const WikipediaToolbar: FC<ToolbarProps> = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-6">
      {/* Three-column layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Word Count */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Word Count</label>
          <Slider
            defaultValue={[config.wordCount]}
            max={5000}
            step={100}
            onValueChange={(value) => onConfigChange({ wordCount: value[0] })}
          />
          <p className="text-xs text-white">Target: {config.wordCount} words</p>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Temperature</label>
          <Slider
            defaultValue={[config.temperature]}
            max={2}
            step={0.1}
            onValueChange={(value) => onConfigChange({ temperature: value[0] })}
          />
          <p className="text-xs text-white">Creativity: {config.temperature}</p>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Writing Style</label>
          <Select onValueChange={(value) => onConfigChange({ style: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a style" defaultValue={config.style} />
            </SelectTrigger>
            <SelectContent>
              {writingStyles.map((style) => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Context */}
      <div>
        <label className="block text-sm font-medium leading-6 text-white">Post Context</label>
        <Textarea
          placeholder="Enter the context for your Wikipedia article..."
          value={config.context}
          onChange={(e) => onConfigChange({ context: e.target.value })}
        />
      </div>
    </div>
  );
};

export const MarketingToolbar: FC<ToolbarProps> = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-6">
      {/* Three-column layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Word Count */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Word Count</label>
          <Slider
            defaultValue={[config.wordCount]}
            max={500}
            step={25}
            onValueChange={(value) => onConfigChange({ wordCount: value[0] })}
          />
          <p className="text-xs text-white">Target: {config.wordCount} words</p>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Temperature</label>
          <Slider
            defaultValue={[config.temperature]}
            max={2}
            step={0.1}
            onValueChange={(value) => onConfigChange({ temperature: value[0] })}
          />
          <p className="text-xs text-white">Creativity: {config.temperature}</p>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Writing Style</label>
          <Select onValueChange={(value) => onConfigChange({ style: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a style" defaultValue={config.style} />
            </SelectTrigger>
            <SelectContent>
              {writingStyles.map((style) => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Context */}
      <div>
        <label className="block text-sm font-medium leading-6 text-white">Market Information</label>
        <Textarea
          placeholder="Enter the context of the market, industry or sector and target audience with the expected impact..."
          value={config.context}
          onChange={(e) => onConfigChange({ context: e.target.value })}
        />
      </div>
    </div>
  );
};

export const CoverLetterToolbar: FC<ToolbarProps> = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-6">
      {/* Four-column layout */}
      <div className="grid grid-cols-4 gap-4">
        {/* Word Count */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Word Count</label>
          <Slider
            defaultValue={[config.wordCount]}
            max={500}
            step={25}
            onValueChange={(value) => onConfigChange({ wordCount: value[0] })}
          />
          <p className="text-xs text-white">Target: {config.wordCount} words</p>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Temperature</label>
          <Slider
            defaultValue={[config.temperature]}
            max={2}
            step={0.1}
            onValueChange={(value) => onConfigChange({ temperature: value[0] })}
          />
          <p className="text-xs text-white">Creativity: {config.temperature}</p>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Writing Style</label>
          <Select onValueChange={(value) => onConfigChange({ style: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a style" defaultValue={config.style} />
            </SelectTrigger>
            <SelectContent>
              {writingStyles.map((style) => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Years of Experience</label>
          <Input
            type="number"
            value={config.yearsOfExperience}
            onChange={(e) => onConfigChange({ yearsOfExperience: parseInt(e.target.value) })}
            className="shadow-sm bg-gray-700 border border-gray-500 text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter years of experience"
          />
        </div>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Company */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Company</label>
          <Input
            type="text"
            value={config.company}
            onChange={(e) => onConfigChange({ company: e.target.value })}
            placeholder="Enter company name"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Role</label>
          <Input
            type="text"
            value={config.role}
            onChange={(e) => onConfigChange({ role: e.target.value })}
            placeholder="Enter role"
          />
        </div>
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-sm font-medium leading-6 text-white">Job Description</label>
        <Textarea
          placeholder="Enter job description..."
          value={config.jobDescription}
          onChange={(e) => onConfigChange({ jobDescription: e.target.value })}
        />
      </div>
    </div>
  );
};

// Business Contract Generation Toolbar
export const BusinessContractToolbar: FC<ToolbarProps> = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-6">
      {/* Four-column layout */}
      <div className="grid grid-cols-4 gap-4">
        {/* Word Count */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Word Count</label>
          <Slider
            defaultValue={[config.wordCount]}
            max={1000}
            step={50}
            onValueChange={(value) => onConfigChange({ wordCount: value[0] })}
          />
          <p className="text-xs text-white">Target: {config.wordCount} words</p>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Temperature</label>
          <Slider
            defaultValue={[config.temperature]}
            max={2}
            step={0.1}
            onValueChange={(value) => onConfigChange({ temperature: value[0] })}
          />
          <p className="text-xs text-white">Creativity: {config.temperature}</p>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Writing Style</label>
          <Select onValueChange={(value) => onConfigChange({ style: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a style" defaultValue={config.style} />
            </SelectTrigger>
            <SelectContent>
              {writingStyles.map((style) => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Duration (Months)</label>
          <Input
            type="number"
            value={config.duration}
            onChange={(e) => onConfigChange({ duration: parseInt(e.target.value) })}
            className="shadow-sm bg-gray-700 border border-gray-500 text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter duration in months"
          />
        </div>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Beneficiary Name */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Beneficiary Name</label>
          <Input
            type="text"
            value={config.beneficiaryName}
            onChange={(e) => onConfigChange({ beneficiaryName: e.target.value })}
            placeholder="Enter beneficiary name"
          />
        </div>

        {/* Stakeholder Name */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Stakeholder Name</label>
          <Input
            type="text"
            value={config.stakeholderName}
            onChange={(e) => onConfigChange({ stakeholderName: e.target.value })}
            placeholder="Enter stakeholder name"
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Project Description</label>
          <Textarea
            placeholder="Enter project description..."
            value={config.projectDescription}
            onChange={(e) => onConfigChange({ projectDescription: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

// IEEE Paper Generation Toolbar

export const IEEEToolbar: FC<ToolbarProps> = ({ config, onConfigChange }) => {

  return (

      <div className="space-y-6">

          {/* Two-column layout */}

          <div className="grid grid-cols-2 gap-4">

              {/* Title */}

              <div>

                  <label className="block text-sm font-medium leading-6 text-white">Title</label>

                  <Input

                      type="text"

                      value={config.title}

                      onChange={(e) => onConfigChange({ title: e.target.value })}

                      placeholder="Enter paper title"

                  />

              </div>



              {/* Keywords */}

              <div>

                  <label className="block text-sm font-medium leading-6 text-white">Keywords (comma-separated)</label>

                  <Input

                      type="text"

                      value={config.keywords}

                      onChange={(e) => onConfigChange({ keywords: e.target.value })}

                      placeholder="Enter keywords"

                  />

              </div>

          </div>



          {/* Abstract */}

          <div>

              <label className="block text-sm font-medium leading-6 text-white">Abstract</label>

              <Textarea

                  placeholder="Enter abstract..."

                  value={config.abstract}

                  onChange={(e) => onConfigChange({ abstract: e.target.value })}

              />

          </div>



          {/* Context */}

          <div>

              <label className="block text-sm font-medium leading-6 text-white">Context</label>

              <Textarea

                  placeholder="Enter the context for your IEEE paper..."

                  value={config.context}

                  onChange={(e) => onConfigChange({ context: e.target.value })}

              />

          </div>

      </div>

  );
};

export const MiscellaneousToolbar: FC<ToolbarProps> = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-6">
      {/* Three-column layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Word Count */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Word Count</label>
          <Slider
            defaultValue={[config.wordCount]}
            max={1000}
            step={50}
            onValueChange={(value) => onConfigChange({ wordCount: value[0] })}
          />
          <p className="text-xs text-white">Target: {config.wordCount} words</p>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Temperature</label>
          <Slider
            defaultValue={[config.temperature]}
            max={2}
            step={0.1}
            onValueChange={(value) => onConfigChange({ temperature: value[0] })}
          />
          <p className="text-xs text-white">Creativity: {config.temperature}</p>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium leading-6 text-white">Writing Style</label>
          <Select onValueChange={(value) => onConfigChange({ style: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a style" defaultValue={config.style} />
            </SelectTrigger>
            <SelectContent>
              {writingStyles.map((style) => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Context */}
      <div>
        <label className="block text-sm font-medium leading-6 text-white">Context</label>
        <Textarea
          placeholder="Enter the context for your LinkedIn post..."
          value={config.context}
          onChange={(e) => onConfigChange({ context: e.target.value })}
        />
      </div>
    </div>
  );
};

// Map each content type to its toolbar component
export const toolbarConfig: Record<string, FC<ToolbarProps>> = {
  "Linkedin Post Generation": LinkedInToolbar,
  "Press Release Generation": PressReleaseToolbar,
  "Wikipedia Post Generation": WikipediaToolbar,
  "Marketing Copy Generation": MarketingToolbar,
  "Cover Letter Generation": CoverLetterToolbar,
  "Business Contract Generation": BusinessContractToolbar,  
  "IEEE Paper Generation": IEEEToolbar,
  "Miscellaneous Content":MiscellaneousToolbar
};

# RT Inventory Project - Good Practices Guide

This document outlines the agreed practices and standards for the RT Inventory project to ensure consistency, clarity, and efficiency.

## Documentation Practices

### File Organization
- Keep documentation in the `/docs` folder
- Use descriptive filenames with underscores (e.g., `project_requirements_document.md`)
- Group related documents in subfolders when appropriate (e.g., `/docs/conversations/`)

### Document Cross-Referencing
- Link related documents using markdown links: `[Document Name](relative_path.md)`
- When referencing another document in text, use the @ symbol: `@document_name.md`
- Add navigation links at the top of complex documents (table of contents)

### Content Standards
- Begin each document with a clear title and brief introduction
- Use consistent section heading levels (# for title, ## for main sections, ### for subsections)
- Include the last updated date on living documents
- Keep one topic per document when possible

### Task Tracking
- Use `- [ ]` for pending tasks and `- [x]` for completed tasks
- Track detailed tasks in [RT_Inventory_Task_List.md](RT_Inventory_Task_List.md)
- Track timeline and phases in [Development_Roadmap.md](Development_Roadmap.md)

## Collaboration Preferences

### Communication Style
- Present information in concise bullet points (INTJ/INTP friendly)
- Prioritize clarity and directness over comprehensiveness
- Explain technical concepts in non-technical terms
- Provide visual representations where possible

### Solution Approach
- Always opt for "simple yet genius solutions" over complex ones
- Present options with clear trade-offs rather than single recommendations
- Wait for explicit approval before implementing significant changes
- Focus on practical outcomes rather than theoretical ideals

### Decision Making
- Make clear recommendations with rationale
- Obtain approval before proceeding with implementation
- Document decisions and their reasoning
- Present alternatives when appropriate

## Development Practices

### UI Development
- Use Onlook for visual UI editing (https://onlook.com/)
- Save UI component screenshots in the `/design` folder
- Follow the design system specified in [design_guidelines.md](design_guidelines.md)

### Code Structure
- Keep components focused on a single responsibility
- Document complex logic with clear comments
- Include type definitions for all data structures
- Follow frontend guidelines in [frontend_guidelines_document.md](frontend_guidelines_document.md)

### Database Approach
- Initial implementation using MCP in Cursor
- Document data models before implementation
- Follow the database strategy in [supabase_thoughts.md](supabase_thoughts.md)

## Collaboration Workflow

### Communication
- Document important conversations in `/docs/conversations/`
- Summarize key decisions and action items from meetings
- Create a summary document for lengthy discussions like `niffo_chat_001_summary.md`

### Feature Implementation
- Focus on one functional area at a time
- Complete core inventory features before starting reservation system
- Get frequent feedback from stakeholders
- Demo new features every two weeks

### Version Control
- Commit changes with descriptive messages
- Create feature branches for major new functionality
- Document branch strategy and naming conventions

## Backend Integration

### API Development
- Document all API endpoints and parameters
- Follow the structure in [backend_structure_document.md](backend_structure_document.md)
- Implement proper error handling and validation
- Include authentication and access control from the start

### Email Integration
- Use secure, unique links for confirmations
- Document email templates and triggers
- Implement a system for tracking email status
- Ensure all email communications maintain thread context

## Testing and Quality

### Testing Approach
- Test core functionality across different devices
- Document edge cases for reservation system
- Implement proper error handling
- Create test scenarios based on real user workflows

### Deployment Process
- Focus on Lagos VI branch first
- Document deployment steps for repeatability
- Plan for data migration from existing systems
- Include rollback procedures

---

This document is a living reference. As the project evolves, update these practices to reflect new learnings and requirements. 
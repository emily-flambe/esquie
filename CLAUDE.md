# Claude Assistant Behavior Modes

This document outlines three distinct modes of operation for Claude when working on this project. Each mode has specific goals and behaviors optimized for different phases of development.

## Research Mode

When operating in research mode, Claude should:

- **Primary Goal**: Gather comprehensive information to inform decisions
- **Key Behaviors**:
  - Perform extensive web searches to understand best practices, technologies, and solutions
  - Think more carefully and deeply about problems before proposing solutions
  - Compare multiple approaches and evaluate trade-offs
  - Document findings and insights for future reference
  - Consider edge cases and potential issues proactively
- **Output Focus**: Detailed analysis, pros/cons lists, and well-researched recommendations
- **Tools to Prioritize**: WebSearch, WebFetch, Read (for documentation)

## Planning Mode

When operating in planning mode, Claude should:

- **Primary Goal**: Design and architect solutions without implementation
- **Key Behaviors**:
  - Do NOT write any code - focus entirely on design and architecture
  - Think carefully about system design, data flow, and component interactions
  - Ask clarifying questions to ensure complete understanding of requirements
  - Create detailed technical specifications and implementation plans
  - Consider scalability, maintainability, and future extensibility
  - Break down complex tasks into manageable components
- **Output Focus**: Technical specifications, architecture diagrams (in text), task breakdowns, and clarifying questions
- **Tools to Prioritize**: TodoWrite, Read (for understanding existing code structure)

## Coding Mode

When operating in coding mode, Claude should:

- **Primary Goal**: Implement solutions efficiently and correctly
- **Key Behaviors**:
  - Write clean, well-structured code following project conventions
  - Focus on implementation rather than extensive planning
  - Test code thoroughly and handle edge cases
  - Follow existing patterns and coding standards in the project
  - Optimize for readability and maintainability
  - Run linting and type checking before considering tasks complete
- **Output Focus**: Working code, test implementations, and brief implementation notes
- **Tools to Prioritize**: Edit, MultiEdit, Write, Bash (for testing), TodoWrite (for tracking progress)

## Mode Selection Guidelines

- **Use Research Mode** when:
  - Starting a new feature requiring technology decisions
  - Encountering unfamiliar problems or technologies
  - Evaluating different architectural approaches
  
- **Use Planning Mode** when:
  - Beginning a complex feature implementation
  - Refactoring existing code
  - Designing APIs or system interfaces
  - User explicitly requests planning or design work
  
- **Use Coding Mode** when:
  - Implementation path is clear
  - Making specific bug fixes
  - Adding well-defined features
  - User provides clear implementation requirements

## Planning and Research Mode

When working in planning and research mode, all documentation should be:
- **Read from**: The `docs/` folder
- **Written to**: The `docs/` folder

This ensures all planning documents, research notes, and design documentation are organized in a centralized location.

## Code writing mode

While in code writing mode, spend a little more time thinking before taking action when implementing changes to the frontend (and even longer when modifying CSS).

Whenever possible, delegate tasks that can be run in parallel to subagents. Always display a colorful message when you are doing this, because it is fun.

## Development Server Management

**IMPORTANT**: Claude should NOT run the development server directly.

When a development server needs to be started:
- Pause and provide the exact command to run
- Wait for the user to start the server
- Continue with any subsequent tasks after confirmation

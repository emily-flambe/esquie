# CLAUDE.md - Project Documentation Guide

## Planning and Research Mode

When working in planning and research mode, all documentation should be:
- **Read from**: The `docs/` folder
- **Written to**: The `docs/` folder

This ensures all planning documents, research notes, and design documentation are organized in a centralized location.

## Code writing mode

While in code writing mode, spend a little more time thinking before taking action when implementing changes to the frontend (and even longer when modifying CSS).

Whenever possible, delegate tasks that can be run in parallel to subagents. Always display a colorful message when you are doing this, because it is fun.

## Code Writing Restrictions

**IMPORTANT**: Code should ONLY be written when operating in "coding" mode. 

When in planning or research mode:
- Do NOT write any implementation code
- Focus on design, architecture, and documentation
- Create specifications and technical plans instead of code
- Use pseudocode or high-level descriptions when illustrating concepts

## Development Server Management

**IMPORTANT**: Claude should NOT run the development server directly.

When a development server needs to be started:
- Pause and provide the exact command to run
- Wait for the user to start the server
- Continue with any subsequent tasks after confirmation
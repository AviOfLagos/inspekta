# Task Master AI - Claude Code Integration Guide

## Essential Commands

### Core Workflow Commands

```bash
# Project Setup
task-master init                                    # Initialize Task Master in current project
task-master parse-prd .taskmaster/docs/prd.txt      # Generate tasks from PRD document
task-master models --setup                        # Configure AI models interactively

# Daily Development Workflow
task-master list                                   # Show all tasks with status
task-master next                                   # Get next available task to work on
task-master show <id>                             # View detailed task information (e.g., task-master show 1.2)
task-master set-status --id=<id> --status=done    # Mark task complete

# Task Management
task-master add-task --prompt="description" --research        # Add new task with AI assistance
task-master expand --id=<id> --research --force              # Break task into subtasks
task-master update-task --id=<id> --prompt="changes"         # Update specific task
task-master update --from=<id> --prompt="changes"            # Update multiple tasks from ID onwards
task-master update-subtask --id=<id> --prompt="notes"        # Add implementation notes to subtask

# Analysis & Planning
task-master analyze-complexity --research          # Analyze task complexity
task-master complexity-report                      # View complexity analysis
task-master expand --all --research               # Expand all eligible tasks

# Dependencies & Organization
task-master add-dependency --id=<id> --depends-on=<id>       # Add task dependency
task-master move --from=<id> --to=<id>                       # Reorganize task hierarchy
task-master validate-dependencies                            # Check for dependency issues
task-master generate                                         # Update task markdown files (usually auto-called)
```

## Key Files & Project Structure

### Core Files

- `.taskmaster/tasks/tasks.json` - Main task data file (auto-managed)
- `.taskmaster/config.json` - AI model configuration (use `task-master models` to modify)
- `.taskmaster/docs/prd.txt` - Product Requirements Document for parsing
- `.taskmaster/tasks/*.txt` - Individual task files (auto-generated from tasks.json)
- `.env` - API keys for CLI usage

### Claude Code Integration Files

- `CLAUDE.md` - Auto-loaded context for Claude Code (this file)
- `.claude/settings.json` - Claude Code tool allowlist and preferences
- `.claude/commands/` - Custom slash commands for repeated workflows
- `.mcp.json` - MCP server configuration (project-specific)

### Directory Structure

```
project/
├── .taskmaster/
│   ├── tasks/              # Task files directory
│   │   ├── tasks.json      # Main task database
│   │   ├── task-1.md      # Individual task files
│   │   └── task-2.md
│   ├── docs/              # Documentation directory
│   │   ├── prd.txt        # Product requirements
│   ├── reports/           # Analysis reports directory
│   │   └── task-complexity-report.json
│   ├── templates/         # Template files
│   │   └── example_prd.txt  # Example PRD template
│   └── config.json        # AI models & settings
├── .claude/
│   ├── settings.json      # Claude Code configuration
│   └── commands/         # Custom slash commands
├── .env                  # API keys
├── .env.example         # Environment variables template
├── .mcp.json            # MCP configuration
├── API_DOCUMENTATION.md # Complete API reference guide
└── CLAUDE.md            # This file - auto-loaded by Claude Code
```

## MCP Integration

Task Master provides an MCP server that Claude Code can connect to. Configure in `.mcp.json`:

```json
{
  "mcpServers": {
    "task-master-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "your_key_here",
        "PERPLEXITY_API_KEY": "your_key_here",
        "OPENAI_API_KEY": "OPENAI_API_KEY_HERE",
        "GOOGLE_API_KEY": "GOOGLE_API_KEY_HERE",
        "XAI_API_KEY": "XAI_API_KEY_HERE",
        "OPENROUTER_API_KEY": "OPENROUTER_API_KEY_HERE",
        "MISTRAL_API_KEY": "MISTRAL_API_KEY_HERE",
        "AZURE_OPENAI_API_KEY": "AZURE_OPENAI_API_KEY_HERE",
        "OLLAMA_API_KEY": "OLLAMA_API_KEY_HERE"
      }
    }
  }
}
```

### Essential MCP Tools

```javascript
help; // = shows available taskmaster commands
// Project setup
initialize_project; // = task-master init
parse_prd; // = task-master parse-prd

// Daily workflow
get_tasks; // = task-master list
next_task; // = task-master next
get_task; // = task-master show <id>
set_task_status; // = task-master set-status

// Task management
add_task; // = task-master add-task
expand_task; // = task-master expand
update_task; // = task-master update-task
update_subtask; // = task-master update-subtask
update; // = task-master update

// Analysis
analyze_project_complexity; // = task-master analyze-complexity
complexity_report; // = task-master complexity-report
```

## Claude Code Workflow Integration

### Standard Development Workflow

#### 1. Project Initialization

```bash
# Initialize Task Master
task-master init

# Create or obtain PRD, then parse it
task-master parse-prd .taskmaster/docs/prd.txt

# Analyze complexity and expand tasks
task-master analyze-complexity --research
task-master expand --all --research
```

If tasks already exist, another PRD can be parsed (with new information only!) using parse-prd with --append flag. This will add the generated tasks to the existing list of tasks..

#### 2. Daily Development Loop

```bash
# Start each session
task-master next                           # Find next available task
task-master show <id>                     # Review task details

# During implementation, check in code context into the tasks and subtasks
task-master update-subtask --id=<id> --prompt="implementation notes..."

# Complete tasks
task-master set-status --id=<id> --status=done
```

#### 3. Multi-Claude Workflows

For complex projects, use multiple Claude Code sessions:

```bash
# Terminal 1: Main implementation
cd project && claude

# Terminal 2: Testing and validation
cd project-test-worktree && claude

# Terminal 3: Documentation updates
cd project-docs-worktree && claude
```

### Custom Slash Commands

Create `.claude/commands/taskmaster-next.md`:

```markdown
Find the next available Task Master task and show its details.

Steps:

1. Run `task-master next` to get the next task
2. If a task is available, run `task-master show <id>` for full details
3. Provide a summary of what needs to be implemented
4. Suggest the first implementation step
```

Create `.claude/commands/taskmaster-complete.md`:

```markdown
Complete a Task Master task: $ARGUMENTS

Steps:

1. Review the current task with `task-master show $ARGUMENTS`
2. Verify all implementation is complete
3. Run any tests related to this task
4. Mark as complete: `task-master set-status --id=$ARGUMENTS --status=done`
5. Show the next available task with `task-master next`
```

## Tool Allowlist Recommendations

Add to `.claude/settings.json`:

```json
{
  "allowedTools": [
    "Edit",
    "Bash(task-master *)",
    "Bash(git commit:*)",
    "Bash(git add:*)",
    "Bash(npm run *)",
    "mcp__task_master_ai__*"
  ]
}
```

## Configuration & Setup

### API Keys Required

At least **one** of these API keys must be configured:

- `ANTHROPIC_API_KEY` (Claude models) - **Recommended**
- `PERPLEXITY_API_KEY` (Research features) - **Highly recommended**
- `OPENAI_API_KEY` (GPT models)
- `GOOGLE_API_KEY` (Gemini models)
- `MISTRAL_API_KEY` (Mistral models)
- `OPENROUTER_API_KEY` (Multiple models)
- `XAI_API_KEY` (Grok models)

An API key is required for any provider used across any of the 3 roles defined in the `models` command.

### Model Configuration

```bash
# Interactive setup (recommended)
task-master models --setup

# Set specific models
task-master models --set-main claude-3-5-sonnet-20241022
task-master models --set-research perplexity-llama-3.1-sonar-large-128k-online
task-master models --set-fallback gpt-4o-mini
```

## Task Structure & IDs

### Task ID Format

- Main tasks: `1`, `2`, `3`, etc.
- Subtasks: `1.1`, `1.2`, `2.1`, etc.
- Sub-subtasks: `1.1.1`, `1.1.2`, etc.

### Task Status Values

- `pending` - Ready to work on
- `in-progress` - Currently being worked on
- `done` - Completed and verified
- `deferred` - Postponed
- `cancelled` - No longer needed
- `blocked` - Waiting on external factors

### Task Fields

```json
{
  "id": "1.2",
  "title": "Implement user authentication",
  "description": "Set up JWT-based auth system",
  "status": "pending",
  "priority": "high",
  "dependencies": ["1.1"],
  "details": "Use bcrypt for hashing, JWT for tokens...",
  "testStrategy": "Unit tests for auth functions, integration tests for login flow",
  "subtasks": []
}
```

## Claude Code Best Practices with Task Master

### Context Management

- Use `/clear` between different tasks to maintain focus
- This CLAUDE.md file is automatically loaded for context
- Use `task-master show <id>` to pull specific task context when needed

### Iterative Implementation

1. `task-master show <subtask-id>` - Understand requirements
2. Explore codebase and plan implementation
3. `task-master update-subtask --id=<id> --prompt="detailed plan"` - Log plan
4. `task-master set-status --id=<id> --status=in-progress` - Start work
5. Implement code following logged plan
6. `task-master update-subtask --id=<id> --prompt="what worked/didn't work"` - Log progress
7. `task-master set-status --id=<id> --status=done` - Complete task

### Complex Workflows with Checklists

For large migrations or multi-step processes:

1. Create a markdown PRD file describing the new changes: `touch task-migration-checklist.md` (prds can be .txt or .md)
2. Use Taskmaster to parse the new prd with `task-master parse-prd --append` (also available in MCP)
3. Use Taskmaster to expand the newly generated tasks into subtasks. Consdier using `analyze-complexity` with the correct --to and --from IDs (the new ids) to identify the ideal subtask amounts for each task. Then expand them.
4. Work through items systematically, checking them off as completed
5. Use `task-master update-subtask` to log progress on each task/subtask and/or updating/researching them before/during implementation if getting stuck

### Git Integration

Task Master works well with `gh` CLI:

```bash
# Create PR for completed task
gh pr create --title "Complete task 1.2: User authentication" --body "Implements JWT auth system as specified in task 1.2"

# Reference task in commits
git commit -m "feat: implement JWT auth (task 1.2)"
```

### Parallel Development with Git Worktrees

```bash
# Create worktrees for parallel task development
git worktree add ../project-auth feature/auth-system
git worktree add ../project-api feature/api-refactor

# Run Claude Code in each worktree
cd ../project-auth && claude    # Terminal 1: Auth work
cd ../project-api && claude     # Terminal 2: API work
```

## Troubleshooting

### AI Commands Failing

```bash
# Check API keys are configured
cat .env                           # For CLI usage

# Verify model configuration
task-master models

# Test with different model
task-master models --set-fallback gpt-4o-mini
```

### MCP Connection Issues

- Check `.mcp.json` configuration
- Verify Node.js installation
- Use `--mcp-debug` flag when starting Claude Code
- Use CLI as fallback if MCP unavailable

### Task File Sync Issues

```bash
# Regenerate task files from tasks.json
task-master generate

# Fix dependency issues
task-master fix-dependencies
```

DO NOT RE-INITIALIZE. That will not do anything beyond re-adding the same Taskmaster core files.

## Important Notes

### AI-Powered Operations

These commands make AI calls and may take up to a minute:

- `parse_prd` / `task-master parse-prd`
- `analyze_project_complexity` / `task-master analyze-complexity`
- `expand_task` / `task-master expand`
- `expand_all` / `task-master expand --all`
- `add_task` / `task-master add-task`
- `update` / `task-master update`
- `update_task` / `task-master update-task`
- `update_subtask` / `task-master update-subtask`

### File Management

- Never manually edit `tasks.json` - use commands instead
- Never manually edit `.taskmaster/config.json` - use `task-master models`
- Task markdown files in `tasks/` are auto-generated
- Run `task-master generate` after manual changes to tasks.json

### Claude Code Session Management

- Use `/clear` frequently to maintain focused context
- Create custom slash commands for repeated Task Master workflows
- Configure tool allowlist to streamline permissions
- Use headless mode for automation: `claude -p "task-master next"`

### Multi-Task Updates

- Use `update --from=<id>` to update multiple future tasks
- Use `update-task --id=<id>` for single task updates
- Use `update-subtask --id=<id>` for implementation logging

### Research Mode

- Add `--research` flag for research-based AI enhancement
- Requires a research model API key like Perplexity (`PERPLEXITY_API_KEY`) in environment
- Provides more informed task creation and updates
- Recommended for complex technical tasks

---

_This guide ensures Claude Code has immediate access to Task Master's essential functionality for agentic development workflows._


# Inspekta Platform - Real Estate Marketplace & Inspection System

## Project Overview

Inspekta is a comprehensive multi-tenant real estate marketplace platform that connects property listings with professional inspection services. The platform serves multiple user types with role-based dashboards and features.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Database**: Prisma ORM
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components built with Radix UI primitives
- **Authentication**: Custom JWT auth system with role-based access
- **Email Service**: SendGrid for transactional emails
- **Icons**: Lucide React

## Key Documentation Files

- **`API_DOCUMENTATION.md`** - Complete API reference with all endpoints, examples, and integration guides
- **`PROJECT_TRACKER.md`** - Development progress tracking and milestone management
- **`.env.example`** - Environment variables template for setup
- **`CLAUDE.md`** - This file with project context and Task Master integration

## Package Manager Commands

**Important**: This project uses `pnpm`, not `npm`.

```bash
# Development
pnpm dev                         # Start development server with turbopack
pnpm build                       # Build for production
pnpm start                       # Start production server

# Code Quality
pnpm lint                        # Run ESLint
pnpm type-check                  # TypeScript compilation check

# Database
pnpm db:seed                     # Seed database with sample data
pnpm db:reset                    # Reset and reseed database
```

## Current Implementation Status

### ✅ Completed Features

1. **Authentication System** - Complete JWT-based auth with email verification
2. **Multi-tenant Database Schema** - Support for companies with subdomains
3. **Property Listing System** - CRUD operations with image support
4. **Role-based Navigation** - Top navigation with role-based menus
5. **Email Integration** - SendGrid for verification, password reset, welcome emails
6. **User Dashboards** - Client, Agent, Inspector, Admin dashboards
7. **Property Detail Pages** - Comprehensive property information with galleries
8. **Agent Profile Pages** - Agent information and listings (username-based URLs)

### 🔐 **Authentication System Features**

- **User Registration** with role selection (CLIENT, AGENT, INSPECTOR, COMPANY_ADMIN, PLATFORM_ADMIN)
- **Email Verification** with professional HTML templates
- **Password Reset** with secure 15-minute expiring tokens
- **JWT Session Management** with HTTP-only cookies
- **Route Protection** middleware with role-based access control
- **Resend Verification** endpoint for users who missed initial email

### 📋 Core User Roles & Access

#### Client Dashboard (`/client`)
- Browse properties with search/filter functionality
- Schedule inspections and track saved properties
- View inspection history and property details

#### Agent Dashboard (`/agent`) 
- Manage property listings (create, view, edit)
- Track earnings and inspection metrics
- View client inquiries and communications

#### Inspector Dashboard (`/inspector`)
- Accept available inspection jobs
- Manage assigned inspections (virtual/physical)
- Track earnings and performance metrics

#### Admin Dashboard (`/admin`)
- User management across all roles
- Platform analytics and reporting
- System configuration and settings

### 🌐 **API Endpoints Reference**

#### **Interactive Documentation** 
- **Swagger UI**: Visit `/docs` for interactive API testing and exploration
- **OpenAPI JSON**: Available at `/api/docs` for programmatic access

See **`API_DOCUMENTATION.md`** for complete endpoint documentation including:

#### Authentication APIs
- `POST /api/auth/register` - User registration with email verification
- `POST /api/auth/login` - User login with session creation
- `POST /api/auth/logout` - Session destruction
- `GET /api/auth/me` - Current user information
- `POST /api/auth/verify-email` - Email verification with welcome email
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset with token

#### Property APIs
- `GET /api/listings` - Get all property listings with filters
- `POST /api/listings` - Create new listing (Agent role required)
- `GET /api/listings/[id]` - Get detailed listing information

### 🚀 **Environment Setup**

Required environment variables (see `.env.example`):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/inspekta"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# SendGrid Email
SENDGRID_API_KEY="SG.your_sendgrid_api_key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
SENDGRID_FROM_NAME="Inspekta Platform"
```

### 🛠️ **Development Workflow**

1. **Database Changes**: Use `npx prisma db push` followed by `pnpm db:seed`
2. **Code Quality**: Always run `pnpm type-check` and `pnpm lint` before committing
3. **API Testing**: Use the endpoints documented in `API_DOCUMENTATION.md`
4. **Email Testing**: Emails are logged to console when SENDGRID_API_KEY not configured

### 📊 **Database Schema Highlights**

Key entities:
- **User**: Role-based users with verification status
- **Company**: Multi-tenant support with subdomains
- **Listing**: Property listings with agent association
- **VerificationToken**: Email verification and password reset tokens
- **UserProfile/AgentProfile/InspectorProfile**: Role-specific profile data

### 🔄 **Next Development Priorities**

1. **Inspection Booking System** - Complete booking and management
2. **Payment Integration** - Paystack/Flutterwave for Nigerian market
3. **WhatsApp Integration** - Business API for notifications
4. **Advanced Search** - Geographic and criteria-based filtering
5. **Real-time Features** - Live chat and notifications

### 📱 **Multi-tenant Architecture**

- **Subdomain routing**: Each company gets `company.inspekta.com`
- **Data isolation**: Company-specific users and listings
- **Shared inspectors**: Inspectors work across companies
- **Centralized admin**: Platform-wide administration

## Development Notes

- **Build Status**: ✅ Production-ready with all tests passing
- **TypeScript**: Strict typing enabled, all files type-safe
- **Security**: JWT tokens, password hashing, CSRF protection
- **Email Templates**: Professional HTML emails with responsive design
- **Role Protection**: Middleware enforces role-based access on all routes

## Troubleshooting

### Common Issues
1. **TypeScript Errors**: Run `pnpm type-check` to identify issues
2. **Build Failures**: Check for missing dependencies or type errors
3. **Email Issues**: Verify SENDGRID_API_KEY format starts with "SG."
4. **Database Issues**: Use `pnpm db:reset` to reset schema and reseed

### Quick Setup
```bash
# Clone and setup
pnpm install
npx prisma db push
pnpm db:seed
pnpm dev
```

For complete API documentation, integration examples, and endpoint specifications, refer to **`API_DOCUMENTATION.md`**.

---

**Current Status**: ✅ **Authentication & Email System Complete - Production Ready**  
**Last Updated**: January 28, 2025  
**Next Phase**: Inspection Booking System Implementation

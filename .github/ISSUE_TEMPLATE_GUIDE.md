# GitHub Issue Templates Guide

This repository includes structured issue templates to help organize work with sub-tasks and hierarchical issues.

## Available Templates

### 🐛 Bug Report
Use this template to report bugs or issues with the application.

**Key Features:**
- Structured bug reporting with severity levels
- Browser and device information
- Built-in sub-task checklist for bug resolution
- Support for screenshots and videos

**Sub-task Template Included:**
```markdown
- [ ] Investigate root cause
- [ ] Write failing test
- [ ] Implement fix
- [ ] Update documentation
- [ ] Deploy to production
```

### ✨ Feature Request
Use this template to suggest new features for the application.

**Key Features:**
- Problem statement and proposed solution fields
- Priority and area categorization
- Acceptance criteria section
- Implementation sub-tasks breakdown

**Sub-task Template Included:**
```markdown
- [ ] Design database schema
- [ ] Create API endpoints
- [ ] Build UI components
- [ ] Add validation
- [ ] Write tests
- [ ] Update documentation
- [ ] Add analytics tracking
```

### 🔧 Enhancement
Use this template for improving existing functionality.

**Key Features:**
- Current vs. proposed behavior comparison
- Benefits analysis
- Technical implementation notes
- Area-specific categorization (UI/UX, Performance, etc.)

**Sub-task Template Included:**
```markdown
- [ ] Research and design
- [ ] Update components
- [ ] Add/update tests
- [ ] Update documentation
- [ ] Performance testing
- [ ] Deploy and monitor
```

### 📊 Epic / Large Feature
Use this template for tracking large initiatives with multiple sub-issues.

**Key Features:**
- Business value and user stories
- Success metrics definition
- Dependency tracking
- Risk assessment
- Multi-phase implementation planning

**Sub-task Structure:**
- Links to related issues
- Phase-based breakdown
- Comprehensive tracking of large features

**Example Sub-Issue Structure:**
```markdown
## Phase 1: Planning & Design
- [ ] Requirements gathering
- [ ] Technical design
- [ ] UI/UX mockups

## Phase 2: Development
- [ ] Backend implementation
- [ ] Frontend implementation
- [ ] Integration

## Phase 3: Testing & Launch
- [ ] QA testing
- [ ] Bug fixes
- [ ] Deployment
- [ ] Monitoring
```

## How to Use

### Creating an Issue

1. Go to the [Issues](https://github.com/Asper-Beauty-Shop/asperbeauty/issues) page
2. Click "New Issue"
3. Select the appropriate template
4. Fill out all required fields
5. Use the sub-tasks section to break down work
6. Submit the issue

### Working with Sub-Tasks

**Markdown Task Lists:**
GitHub supports task lists in issue descriptions. Simply use the following syntax:

```markdown
- [ ] Incomplete task
- [x] Completed task
```

**Benefits:**
- Track progress visually in the issue
- See completion percentage
- Convert sub-tasks to separate issues if needed

### Converting Sub-Tasks to Issues

For complex sub-tasks, you can convert them to full issues:

1. Create a new issue for the sub-task
2. Reference the parent issue using `#issue-number`
3. Update the parent issue task list with the new issue number:
   ```markdown
   - [ ] #123 - Implementation of feature X
   ```

### Best Practices

1. **Be Specific:** Provide detailed descriptions and clear acceptance criteria
2. **Break Down Work:** Use sub-tasks to make large issues manageable
3. **Link Related Issues:** Use `#issue-number` to reference related work
4. **Update Progress:** Check off sub-tasks as they're completed
5. **Use Labels:** Add appropriate labels for better organization
6. **Set Priorities:** Indicate priority levels to help with planning

## Template Customization

The templates can be customized by editing the YAML files in `.github/ISSUE_TEMPLATE/`:

- `bug_report.yml` - Bug report template
- `feature_request.yml` - Feature request template
- `enhancement.yml` - Enhancement template
- `epic.yml` - Epic/large feature template
- `config.yml` - Template configuration

## Example Workflow

### Example 1: Bug Fix with Sub-Tasks

1. Create bug report: "Shopping cart not updating on mobile"
2. Fill in browser, device, and steps to reproduce
3. Use sub-tasks:
   ```markdown
   - [x] Investigate root cause
   - [x] Write failing test
   - [x] Implement fix
   - [ ] Update documentation
   - [ ] Deploy to production
   ```
4. Check off tasks as you complete them
5. Close issue when all tasks are done

### Example 2: Large Feature Epic

1. Create epic: "Multi-currency Support"
2. Define business value and success metrics
3. Break down into phases:
   ```markdown
   ## Phase 1: Planning
   - [ ] #150 - Research currency conversion APIs
   - [ ] #151 - Design database schema
   
   ## Phase 2: Implementation
   - [ ] #152 - Backend currency service
   - [ ] #153 - Frontend currency selector
   - [ ] #154 - Update product pricing display
   ```
4. Create separate issues for each sub-task
5. Link back to the epic issue
6. Track overall progress in the epic

## Additional Resources

- [GitHub Issues Documentation](https://docs.github.com/en/issues)
- [About Task Lists](https://docs.github.com/en/issues/tracking-your-work-with-issues/about-task-lists)
- [About Issue Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates)

## Support

For questions or issues with the templates themselves, please create an issue or discussion in the repository.

# Contributing to Depanku.id

Thank you for your interest in contributing to Depanku.id! This document provides guidelines for contributing to the project.

## 🌟 Ways to Contribute

1. **Report Bugs** - Found a bug? Open an issue
2. **Suggest Features** - Have an idea? We'd love to hear it
3. **Improve Documentation** - Help make our docs better
4. **Submit Code** - Fix bugs or implement features

## 🔧 Development Setup

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete setup instructions.

## 📝 Code Style Guidelines

### TypeScript/React

- Use functional components with hooks
- Prefer `const` over `let`
- Use TypeScript strict mode
- Follow existing naming conventions:
  - Components: PascalCase
  - Functions/variables: camelCase
  - Constants: UPPER_SNAKE_CASE

### Python/Flask

- Follow PEP 8 style guide
- Use type hints where applicable
- Keep functions focused and small
- Document complex logic with comments

### Tailwind CSS

- Use utility classes first
- Custom components go in `@layer components`
- Maintain the OKLCH color system
- Use the defined shadow system

## 🔀 Pull Request Process

1. **Fork the repository**
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Write clear, concise commit messages
   - Follow the code style guidelines
   - Add comments for complex logic
4. **Test your changes**
   - Ensure frontend builds: `npm run build`
   - Test all affected features
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request**
   - Describe what changed and why
   - Reference any related issues
   - Add screenshots for UI changes

## 🧪 Testing Checklist

Before submitting a PR, verify:

- [ ] Frontend builds without errors
- [ ] Backend runs without errors
- [ ] Search functionality works
- [ ] AI chat responds correctly
- [ ] Authentication flow works
- [ ] Responsive design is maintained
- [ ] No console errors in browser
- [ ] New features are documented

## 📋 Commit Message Format

Use clear, descriptive commit messages:

```
type: brief description

Longer explanation if needed

Fixes #issue-number
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat: add filter by location functionality

fix: resolve Algolia search timeout issue

docs: update setup guide with Firestore instructions
```

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Description** - What happened?
2. **Steps to Reproduce** - How can we reproduce it?
3. **Expected Behavior** - What should happen?
4. **Screenshots** - If applicable
5. **Environment** - OS, browser, Node/Python versions

## 💡 Suggesting Features

Feature requests should include:

1. **Problem Statement** - What problem does this solve?
2. **Proposed Solution** - How should it work?
3. **Alternatives Considered** - Other approaches?
4. **User Impact** - Who benefits and how?

## 🎨 Design Guidelines

When adding UI components:

- Maintain the calm, warm aesthetic
- Use the OKLCH color palette
- Apply the two-part shadow system
- Ensure smooth transitions (300ms ease-out)
- Test on mobile devices
- Consider accessibility (ARIA labels, keyboard navigation)

## 🔐 Security

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Report security vulnerabilities privately
- Keep dependencies updated

## 📚 Documentation

When adding features:

- Update README.md if needed
- Add comments for complex code
- Update SETUP_GUIDE.md for new dependencies
- Document new API endpoints

## ⚖️ Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Collaborate openly

## 🙋 Questions?

Feel free to open an issue for:
- Clarification on contribution process
- Help with setup
- Feature discussions
- General questions

---

Thank you for contributing to Depanku.id! 🚀


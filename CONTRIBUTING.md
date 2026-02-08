# Contributing to Ocean Paradise

First off, thank you for considering contributing to Ocean Paradise! It's people like you that make this project a great learning resource and useful tool.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project and everyone participating in it is governed by a commitment to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/your-username/ocean-paradise.git
   cd ocean-paradise
   ```
3. **Set up the development environment**
   - Follow the setup instructions in [README.md](README.md)
   - For backend: See [Backend/README.md](Backend/README.md)
   - For frontend: See [Frontend/README.md](Frontend/README.md)

4. **Create a branch** for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected
- **Include screenshots or GIFs** if applicable
- **Include your environment details** (OS, Go version, Node version, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternative solutions** you've considered

### 🔨 Code Contributions

Want to contribute code? Great! Here are some areas where you can help:

- **Bug fixes** - Fix reported issues
- **New features** - Implement feature requests
- **Documentation** - Improve docs and examples
- **Tests** - Add or improve test coverage
- **Performance** - Optimize existing code
- **Refactoring** - Improve code quality

## 🔄 Development Workflow

### Backend (Go)

1. **Make your changes** in the `Backend/` directory
2. **Follow Go conventions** and idioms
3. **Write or update tests**
   ```bash
   go test ./...
   ```
4. **Format your code**
   ```bash
   go fmt ./...
   ```
5. **Run the linter** (if configured)
   ```bash
   golangci-lint run
   ```
6. **Test your changes** locally
   ```bash
   go run main.go
   ```

### Frontend (React/TypeScript)

1. **Make your changes** in the `Frontend/` directory
2. **Follow TypeScript and React best practices**
3. **Write or update tests** (if applicable)
   ```bash
   npm run test
   ```
4. **Run the linter**
   ```bash
   npm run lint
   ```
5. **Test your changes** in the browser
   ```bash
   npm run dev
   ```
6. **Build to ensure no errors**
   ```bash
   npm run build
   ```

## 🎨 Style Guidelines

### Go Code Style

- Follow the [Effective Go](https://golang.org/doc/effective_go) guidelines
- Use `gofmt` for formatting
- Use meaningful variable and function names
- Add comments for exported functions and complex logic
- Keep functions small and focused
- Follow the hexagonal architecture pattern used in the project

Example:
```go
// GetGuestByID retrieves a guest by their unique identifier.
// Returns an error if the guest is not found or database error occurs.
func (r *GuestRepository) GetGuestByID(ctx context.Context, id string) (*domain.Guest, error) {
    var guest domain.Guest
    err := r.db.GetContext(ctx, &guest, "SELECT * FROM guests WHERE id = $1", id)
    if err != nil {
        return nil, fmt.Errorf("failed to get guest: %w", err)
    }
    return &guest, nil
}
```

### TypeScript/React Code Style

- Use TypeScript for type safety
- Follow the [React documentation](https://react.dev/) best practices
- Use functional components with hooks
- Use meaningful component and variable names
- Add proper TypeScript types and interfaces
- Keep components small and focused
- Use Tailwind CSS utility classes for styling

Example:
```typescript
interface RoomCardProps {
  room: Room;
  onBook: (roomId: string) => void;
}

export function RoomCard({ room, onBook }: RoomCardProps) {
  return (
    <div className="rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold">{room.room_number}</h3>
      <p className="text-gray-600">{room.room_type}</p>
      <button
        onClick={() => onBook(room.id)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Book Now
      </button>
    </div>
  );
}
```

### SQL Migrations

- Use descriptive migration file names: `NNN_description.sql`
- Include both UP and DOWN migrations (if applicable)
- Test migrations on a fresh database
- Don't modify existing migrations

## 📝 Commit Messages

Write clear, concise commit messages that explain what and why:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(guest): add check-out functionality

Implement guest check-out with invoice generation and room status update.
Includes validation for outstanding payments.

Closes #123
```

```
fix(housekeeping): resolve task assignment bug

Fixed issue where tasks were not properly assigned to staff members
due to incorrect foreign key reference.

Fixes #456
```

```
docs(readme): update setup instructions

Added detailed environment variable descriptions and troubleshooting section.
```

## 🔀 Pull Request Process

1. **Ensure your code follows the style guidelines**
2. **Update documentation** if you've made changes that require it
3. **Add tests** for new features or bug fixes
4. **Ensure all tests pass** locally
5. **Update the README.md** or relevant documentation with details of changes if applicable
6. **Write a clear PR description**:
   - What changes did you make?
   - Why did you make them?
   - How did you test them?
   - Any breaking changes?

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests for new features
- [ ] Tested manually in browser/API

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests that prove fix/feature works
```

## 🧪 Testing

### Backend Testing

```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run tests for specific package
go test ./guest/...

# Run with verbose output
go test -v ./...
```

### Frontend Testing

```bash
# Run tests (when configured)
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 🔍 Code Review Process

All submissions require review. We use GitHub pull requests for this purpose:

1. Maintainers will review your code
2. They may request changes
3. Make requested changes and push to your branch
4. Once approved, a maintainer will merge your PR

## 🎯 Project Structure

Please maintain the existing project structure:

- Keep domain logic in the domain layer
- Use ports (interfaces) for dependencies
- Implement services for business logic
- Keep handlers thin
- Follow the hexagonal architecture pattern

## 📚 Resources

- [Go Documentation](https://golang.org/doc/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

## ❓ Questions?

Feel free to open an issue with your question, or reach out to the maintainers.

## 🙏 Recognition

Contributors will be recognized in the project's README.md. Thank you for your contributions!

---

Happy coding! 🚀

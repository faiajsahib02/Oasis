# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously and appreciate the open source community's efforts to discover and report security vulnerabilities responsibly.

### How to Report

**Do not** open a public GitHub issue for security vulnerabilities. Instead, please follow these steps:

1. **Email** security@ocean-paradise.dev with the subject line starting with `[SECURITY]`
2. **Include** detailed information about the vulnerability:
   - Type of vulnerability
   - Location in codebase (if known)
   - Potential impact
   - Steps to reproduce (if possible)
   - Your name and contact information

### What to Expect

- We will acknowledge receipt of your report within 48 hours
- We will investigate and determine the severity of the issue
- We will work on a fix and prepare a security advisory
- We will release a patched version as soon as possible
- We will credit you in the release notes (unless you prefer to remain anonymous)

## Security Best Practices

### For Users

- Keep your installation up to date
- Use strong, unique passwords
- Never hardcode secrets in environment files you share
- Keep your `.env` files secure and never commit them
- Use HTTPS for all connections in production
- Regularly rotate JWT secrets

### For Developers

- Never commit secrets or credentials
- Always use HTTPS for data transmission
- Validate all user inputs
- Use prepared statements for database queries
- Keep dependencies updated
- Run security scans regularly
- Follow the principle of least privilege

## Known Issues

Currently, there are no known security vulnerabilities.

## Security Headers

When deploying to production, ensure these security headers are set:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## Dependency Security

We use automated tools to scan dependencies for vulnerabilities:

- **Backend**: Go Module vulnerabilities scanning
- **Frontend**: npm audit and Snyk integration

These tools run on every pull request and scheduled weekly scans.

## Compliance

This project aims to follow security best practices outlined by:

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Go Security Guidelines](https://golang.org/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Contact

For security concerns, please contact the maintainers at: **security@ocean-paradise.dev**

Thank you for helping keep Ocean Paradise secure! 🔒

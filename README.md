<div align="center">

# 🛡️ Aryasec - Security Tools Dashboard

*A comprehensive cybersecurity tools dashboard for security professionals and ethical hackers*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

[🚀 Live Demo](https://aryasec.vercel.app) • [📖 Documentation](https://github.com/Arya182-ui/Aryasec/wiki) • [🐛 Report Bug](https://github.com/Arya182-ui/Aryasec/issues) • [✨ Request Feature](https://github.com/Arya182-ui/Aryasec/issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)

- [🚀 Quick Start](#-quick-start)
- [🔧 Installation](#-installation)
- [💡 Usage](#-usage)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔒 Security](#-security)
- [🎯 Use Cases](#-use-cases)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)
- [☕ Support](#-support)

---

## 🌟 Overview

Aryasec is a modern, web-based cybersecurity tools dashboard that provides security professionals, penetration testers, and ethical hackers with a comprehensive suite of security testing and analysis tools. Built with cutting-edge web technologies, it offers a user-friendly interface for performing various security assessments, vulnerability testing, and threat intelligence gathering.

### 🎯 Key Highlights

- 🔒 **Privacy-First**: All processing happens locally in your browser
- 🚀 **Performance**: Lightning-fast, optimized for speed
- 📱 **Responsive**: Works seamlessly across all devices
- 🎨 **Modern UI**: Clean, professional interface with dark theme
- 🔧 **Extensible**: Modular architecture for easy customization
- 📊 **Comprehensive**: Complete security testing toolkit

## 🛡️ Features

### 🔍 Reconnaissance Arsenal
Gather intelligence and map attack surfaces with Arya's reconnaissance tools

- **Arya Subdomain Finder**: Discover subdomains and attack surface
- **Arya Network Mapper**: Visualize network topology and devices
- **Arya Port Scanner**: Scan for open ports and services

### 📊 Security Analysis Tools
Analyze configurations and security posture with comprehensive assessment tools

- **Arya Header Analyzer**: Analyze security headers and misconfigurations
- **Arya SSL/TLS Analyzer**: Test SSL/TLS configuration and certificates
- **Arya Hash Analyzer**: Calculate and verify file integrity hashes
- **Arya CVE Dashboard**: Real-time CVE monitoring and alerts

### 🎯 Vulnerability Testing Suite
Identify and exploit security weaknesses using advanced testing methodologies

- **Arya CORS Tester**: Test CORS policies and identify misconfigurations
- **Arya SQL Injection Tester**: Test for SQL injection vulnerabilities
- **Arya XSS Scanner**: Scan for Cross-Site Scripting vulnerabilities

### 🛠️ Solutions & Remediation
Fix vulnerabilities with guided remediation and automated security solutions

- **Arya Security Solutions**: Remediation guides and security fixes

### 🧠 Threat Intelligence
Stay informed with the latest cybersecurity research and threat intelligence

- **Security Intelligence Hub**: Latest cybersecurity insights and research

---

## 🚀 Quick Start

Get Aryasec running locally in just a few minutes!

```bash
# Clone the repository
git clone https://github.com/Arya182-ui/Aryasec.git

# Navigate to project directory
cd Aryasec

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:5173
```

---

## 🔧 Installation

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)

### 🛠️ Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arya182-ui/Aryasec.git
   cd Aryasec
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using yarn
   yarn install
   ```

3. **Environment setup**
   ```bash
   # Copy environment template (if applicable)
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173` to see the application running.

### 🚢 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Serve the built files
npx serve dist
```

The optimized production files will be generated in the `dist/` directory.

### 🐳 Docker Setup (Optional)

```bash
# Build Docker image
docker build -t aryasec .

# Run container
docker run -p 3000:3000 aryasec
```

---

## 💡 Usage

### 🎯 Getting Started

1. **Access the Dashboard**: Open your browser and navigate to the running application
2. **Choose a Tool**: Select from the comprehensive suite of security tools
3. **Configure Settings**: Adjust tool parameters according to your testing needs
4. **Run Analysis**: Execute security tests and analyze results
5. **Export Reports**: Download detailed reports for documentation

### 🔍 Tool-Specific Guides

<details>
<summary><strong>Subdomain Discovery</strong></summary>

1. Enter target domain
2. Select discovery techniques
3. Configure scan intensity
4. Review discovered subdomains
5. Export results in various formats

</details>

<details>
<summary><strong>Security Header Analysis</strong></summary>

1. Input target URL
2. Initiate header scan
3. Review security recommendations
4. Generate compliance report
5. Implement suggested fixes

</details>

<details>
<summary><strong>Vulnerability Testing</strong></summary>

1. Define target scope
2. Select test categories
3. Configure test parameters
4. Execute security tests
5. Analyze findings and remediation steps

</details>

## 🛠️ Tech Stack

<div align="center">

### Frontend Technologies
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

### Development Tools
[![ESLint](https://img.shields.io/badge/ESLint-9.9.1-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)
[![PostCSS](https://img.shields.io/badge/PostCSS-8.4.35-DD3A0A?style=flat&logo=postcss&logoColor=white)](https://postcss.org/)
[![Autoprefixer](https://img.shields.io/badge/Autoprefixer-10.4.18-DD3735?style=flat&logo=autoprefixer&logoColor=white)](https://autoprefixer.github.io/)

</div>


### 🔧 Key Dependencies

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React | 18.3.1 | UI Library |
| **Language** | TypeScript | 5.5.3 | Type Safety |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-First CSS |
| **Build Tool** | Vite | 5.4.2 | Fast Development |
| **Icons** | Lucide React | 0.344.0 | Icon Library |
| **HTTP Client** | Axios | 1.6.0 | API Requests |
| **Linting** | ESLint | 9.9.1 | Code Quality |

## 🔒 Security

### 🛡️ Security Features

- **🔐 Privacy-First Design**: All security analysis runs locally in your browser
- **🚫 Zero Data Collection**: No user data is transmitted to external servers
- **🔒 Secure Defaults**: Built following OWASP security guidelines
- **🎓 Educational Focus**: Designed for learning and ethical security testing
- **✅ CSP Compliant**: Content Security Policy implementation
- **🔍 Input Validation**: Comprehensive input sanitization

### � Security Headers Supported

| Header | Purpose | Status |
|--------|---------|--------|
| **Content-Security-Policy (CSP)** | XSS Protection | ✅ Analyzed |
| **Strict-Transport-Security (HSTS)** | HTTPS Enforcement | ✅ Analyzed |
| **X-Frame-Options** | Clickjacking Protection | ✅ Analyzed |
| **X-Content-Type-Options** | MIME Type Sniffing | ✅ Analyzed |
| **X-XSS-Protection** | XSS Filter | ✅ Analyzed |
| **Referrer-Policy** | Referrer Information | ✅ Analyzed |
| **Permissions-Policy** | Feature Policy | ✅ Analyzed |

### 🎯 CORS Testing Capabilities

- ✅ **Origin Validation**: Test cross-origin request policies
- ✅ **Method Restrictions**: Verify allowed HTTP methods
- ✅ **Credential Handling**: Check credential inclusion policies
- ✅ **Preflight Analysis**: CORS preflight request validation
- ✅ **Wildcard Detection**: Identify overly permissive configurations

### 📊 CVE Analysis Features

- **🎯 CVSS Scoring**: Comprehensive vulnerability severity analysis
- **📈 Risk Classification**: Automated risk level determination
- **🏢 Vendor Tracking**: Vendor-specific vulnerability monitoring
- **🔔 Advisory Alerts**: Latest security advisory notifications

---

## 🎯 Use Cases

<div align="center">

### 👥 Target Audience

</div>

| User Type | Use Cases | Benefits |
|-----------|-----------|----------|
| **🔒 Security Professionals** | Comprehensive security testing toolkit | Streamlined workflow, professional reporting |
| **🎯 Penetration Testers** | Quick vulnerability assessment tools | Efficient reconnaissance, detailed analysis |
| **👨‍💻 Developers** | Security header validation, CORS testing | Secure development practices, compliance checking |
| **🎓 Students & Researchers** | Educational cybersecurity platform | Hands-on learning, practical experience |
| **🐛 Bug Bounty Hunters** | Initial reconnaissance and analysis | Fast target assessment, vulnerability discovery |
| **🏢 Enterprise Teams** | Security posture assessment | Risk management, compliance reporting |

### 🌟 Real-World Applications

- **🔍 Pre-Engagement Reconnaissance**: Gather intelligence before security assessments
- **🛡️ Security Audits**: Comprehensive security posture evaluation
- **📊 Compliance Testing**: Verify adherence to security standards
- **🎓 Training & Education**: Hands-on cybersecurity learning platform
- **🚨 Incident Response**: Quick security analysis during investigations
- **📈 Continuous Monitoring**: Regular security health checks

---

## 🤝 Contributing

We welcome contributions from the cybersecurity community! Here's how you can help:

### 🚀 Getting Started

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow our coding standards
4. **Test thoroughly**: Ensure all tests pass
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes

### 📋 Contribution Guidelines

- **Code Quality**: Follow TypeScript best practices
- **Testing**: Add tests for new features
- **Documentation**: Update docs for any changes
- **Security**: Follow secure coding practices
- **Compatibility**: Ensure cross-browser compatibility

### � Reporting Bugs

Found a bug? Please create an issue with:
- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected vs actual** behavior
- **Environment details** (OS, browser, version)

### 💡 Feature Requests

Have an idea? We'd love to hear it! Open an issue with:
- **Detailed description** of the feature
- **Use case scenarios** where it would be helpful
- **Mockups or examples** if applicable

### 🏆 Contributors

<a href="https://github.com/Arya182-ui/Aryasec/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Arya182-ui/Aryasec" />
</a>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

### 📋 License Summary

- ✅ **Commercial Use**: Use for commercial projects
- ✅ **Modification**: Modify and distribute
- ✅ **Distribution**: Share and redistribute
- ✅ **Private Use**: Use in private projects
- ⚠️ **Limitation**: No liability or warranty
- ❗ **Condition**: Include license and copyright notice

---

## 👨‍💻 Author

<div align="center">

### Arya Gangwar

**Cybersecurity Enthusiast & Full-Stack Developer**

[![GitHub](https://img.shields.io/badge/GitHub-Arya182--ui-181717?style=for-the-badge&logo=github)](https://github.com/Arya182-ui)
[![Email](https://img.shields.io/badge/Email-arya119000%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:arya119000@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ayush-gangwar-cyber/)

*"Building secure digital solutions for a safer cyber world"*

</div>

### 🎯 About the Developer

- 🔒 **Cybersecurity Specialist** with expertise in penetration testing and vulnerability assessment
- 💻 **Full-Stack Developer** proficient in modern web technologies
- 🎓 **Security Researcher** contributing to the cybersecurity community
- 🌟 **Open Source Advocate** passionate about sharing knowledge and tools
- 🧠 **AI** Learning Cybersecurity with AI 
---

## ☕ Support

If you find this project helpful, consider supporting my work:

<div align="center">

[![Buy Me a Coffee](https://img.shields.io/badge/☕%20Buy%20Me%20a%20Coffee-Support%20Development-FF6B35?style=for-the-badge&logo=buy-me-a-coffee&logoColor=white)](https://arya182-ui.github.io/buy-a-coffee-for-me/)
[![GitHub Sponsors](https://img.shields.io/badge/💖%20GitHub%20Sponsors-Sponsor-EA4AAA?style=for-the-badge&logo=github-sponsors)](https://github.com/sponsors/Arya182-ui)
[![Star Repository](https://img.shields.io/badge/⭐%20Star%20Repository-Support%20Project-yellow?style=for-the-badge&logo=github)](https://github.com/Arya182-ui/buy-a-coffee-for-me)

</div>

### 🙏 Why Support?

Your support helps me:
- 🔧 **Maintain and improve** existing tools
- ✨ **Develop new features** and security tools
- 📚 **Create educational content** for the community
- 🌟 **Keep projects open source** and free for everyone

---


### 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/Arya182-ui/Aryasec?style=social)
![GitHub forks](https://img.shields.io/github/forks/Arya182-ui/Aryasec?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/Arya182-ui/Aryasec?style=social)

---

**Built with ❤️ for the cybersecurity community**

*Perfect for security professionals, developers, and anyone interested in web application security testing and analysis.*

---

<sub>⭐ **Star this repository** if you find it helpful! It motivates me to create more awesome security tools.</sub>

</div>

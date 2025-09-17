# Enhanced Case Management System v2.0

A comprehensive legal case management system with GitHub integration for secure data persistence and real-time synchronization across devices.

## 🚀 Features

### Core Functionality
- **Case Management**: Complete case lifecycle management with detailed case information
- **Task Management**: Assign and track tasks with due dates and status updates
- **User Management**: Role-based access control (Admin, Restricted Admin, Viewer)
- **Invoice Management**: Request, approve, and track financial transactions
- **Office Copy Management**: Upload and manage legal documents
- **Reports & Analytics**: Comprehensive reporting with charts and visualizations
- **Messaging System**: Internal communication between users
- **Reminder System**: Automated notifications for important deadlines

### Enhanced Features in v2.0
- **GitHub Integration**: Automatic data synchronization with GitHub repositories
- **File Upload to GitHub**: Documents are uploaded as assets to your GitHub repo
- **Real-time Sync**: Data synchronization across multiple devices and sessions
- **Secure Authentication**: Enhanced login system without exposed demo credentials
- **Responsive Design**: Mobile-friendly interface with touch-optimized controls

## 🔐 Security Features

### Secure Default Admin Login
- **Default admin credentials**: `admin` / `Admin123!`
- **No visible credentials**: Demo credentials removed from UI for security
- **First-time setup**: System initializes with secure admin account
- **Password protection**: All user data is password-protected

### GitHub Data Persistence
- **Encrypted storage**: Tokens stored securely in localStorage
- **Private repositories**: Supports private GitHub repositories
- **Access control**: Repository-level access control for data security

## 📋 Prerequisites

1. **GitHub Account**: Required for data persistence
2. **GitHub Repository**: Create a private repository for data storage
3. **Personal Access Token**: GitHub token with repository permissions
4. **Modern Web Browser**: Chrome, Firefox, Safari, or Edge

## 🛠 Setup Instructions

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. **Repository Name**: `case-management-data` (or your preferred name)
3. **Visibility**: Private (recommended for security)
4. **Initialize**: ✅ Add README file

### 2. Generate Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. **Scopes required**:
   - `repo` (Full control of private repositories)
   - `contents:write` (Write access to repository contents)
4. Copy and save your token securely

### 3. Configure the System

1. Open the application in your web browser
2. Login with default admin credentials:
   - **Username**: `admin`
   - **Password**: `Admin123!`
3. Navigate to **Exports** page
4. Fill in GitHub settings:
   - **GitHub Owner**: Your GitHub username
   - **Repository Name**: `case-management-data`
   - **Branch**: `main`
   - **Personal Access Token**: Your generated token
5. Click **Save Settings** and **Test Connection**

## 🚀 Quick Start

### First Login
1. Open `index.html` in your web browser
2. Login with: `admin` / `Admin123!`
3. Configure GitHub integration in Exports section
4. Start adding cases and users

### Adding Cases
1. Go to **Cases** page
2. Click **Add New Case**
3. Fill in case details (all sections preserved):
   - Basic Information
   - Party Information
   - Case Details
   - Important Dates
   - Prayer
   - Petitioners/Respondents
   - IA Details
   - Lower Court Details
   - Documents (will upload to GitHub)
   - Orders
4. Click **Save Case** (automatically syncs to GitHub)

### Managing Users
1. Go to **User Management** (Admin only)
2. Click **Add New User**
3. Set username, password, email, phone, and role
4. User data automatically syncs to GitHub

### File Management
1. Go to **Office Copy** page
2. Click **Upload File**
3. Files are automatically uploaded to GitHub repository
4. Accessible via generated GitHub URLs

## 📁 Data Structure

### GitHub Repository Structure
```
case-management-data/
├── data.json                 # Main data file
├── documents/
│   ├── case-files/          # Case-related documents
│   ├── disposal-orders/     # Disposal order files
│   └── invoices/            # Invoice supporting documents
├── office-copy/             # Office copy uploads
└── uploads/                 # General file uploads
```

### Data.json Schema
```json
{
  "users": [...],
  "cases": [...],
  "tasks": [...],
  "invoices": [...],
  "officeFiles": [...],
  "notifications": [...],
  "reminders": [...],
  "messages": [...],
  "lastUpdated": "2025-09-17T20:41:21Z",
  "version": "2.0"
}
```

## 🔄 Data Synchronization

### Automatic Sync
- **On Save**: Every save operation (cases, tasks, users, etc.) triggers GitHub sync
- **On Load**: Application loads latest data from GitHub on startup
- **Fallback**: If GitHub sync fails, data is saved to localStorage
- **Status Indicator**: Sync status visible in navigation and exports page

### Manual Sync
- Use **Sync Now** button in Exports page
- **Test Connection** to verify GitHub settings
- **Last Sync** timestamp shows recent synchronization

## 👥 User Roles

### Admin
- Full access to all features
- User management capabilities
- Invoice approval authority
- File download/delete permissions
- GitHub sync configuration

### Restricted Admin
- Case and task management
- Invoice request (approval required)
- File upload capabilities
- Reports and analytics access
- No user management access

### Viewer
- Read-only access to cases and tasks
- Cannot modify data
- Can view reports
- Cannot access user management or exports

## 📱 Mobile Compatibility

- **Responsive Design**: Optimized for mobile devices
- **Touch Controls**: Mobile-friendly buttons and navigation
- **Sidebar Navigation**: Collapsible sidebar for mobile screens
- **Form Optimization**: Mobile-optimized form inputs

## 🔧 Customization

### Styling
- Modify `styles.css` for custom themes
- Case detail styling preserved exactly as requested
- Bootstrap 5 framework for consistent design

### Functionality
- Extend `script.js` for additional features
- GitHub sync utility in `github-sync.js`
- Modular design for easy customization

## 🚨 Troubleshooting

### GitHub Sync Issues
1. **Connection Failed**: Check token permissions and repository access
2. **Upload Failed**: Verify repository exists and token has write access
3. **Sync Status**: Check sync indicator in navigation

### Authentication Issues
1. **Login Failed**: Verify username/password combination
2. **Access Denied**: Check user role permissions
3. **Session Expired**: Re-login to refresh session

### File Upload Issues
1. **Upload Failed**: Check GitHub configuration and token
2. **File Too Large**: GitHub has file size limits (100MB)
3. **Unsupported Format**: Verify file format compatibility

## 📈 Data Migration

### From Previous Version
1. Export existing data using old system
2. Configure GitHub integration
3. Import data manually or use migration scripts

### Backup Strategy
1. **GitHub Repository**: Primary backup
2. **Local Export**: Use PDF/CSV export features
3. **Repository Clone**: Clone GitHub repository for offline backup

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Implement changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check troubleshooting section
2. Review GitHub repository issues
3. Contact system administrator

## 🔄 Version History

### v2.0 (Current)
- GitHub integration for data persistence
- File upload to GitHub repositories
- Enhanced security (removed demo credentials)
- Real-time data synchronization
- Mobile responsive improvements

### v1.0
- Basic case management functionality
- Local data storage
- User authentication
- Task and invoice management

---

**MiniMax Agent** - Case Management System v2.0
Built with modern web technologies for secure, efficient legal case management.

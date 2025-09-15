// Enhanced Case Management System - Main JavaScript File
let currentUser = null;
let currentPage = 'dashboard';
let githubSync = null;

// Authentication check
let isAuthenticated = false;

// Default data
const defaultUsers = [
    { id: 1, username: 'admin', password: 'Admin123!', role: 'admin', email: 'admin@example.com', phone: '+1234567890' },
    { id: 2, username: 'manager', password: 'Manager123!', role: 'restricted_admin', email: 'manager@example.com', phone: '+1234567891' },
    { id: 3, username: 'viewer', password: 'Viewer123!', role: 'viewer', email: 'viewer@example.com', phone: '+1234567892' }
];

const defaultCases = [
    { 
        id: 1, 
        caseNumber: 'CRLP 13925/2024', 
        srNumber: 'CRLPSR 16259/2024', 
        status: 'closed', 
        filingDate: '2024-11-13', 
        registrationDate: '2024-11-16', 
        primaryPetitioner: 'Preethi Sivaraman', 
        primaryRespondent: 'The State of Telangana', 
        purpose: 'ADMISSION', 
        cnr: 'HBHC010619412024', 
        petitionerAdv: 'MD FASIUDDIN', 
        respondentAdv: 'PUBLIC PROSECUTOR', 
        category: 'CRLP', 
        subCategory: 'CRIMINAL PETITION', 
        subSubCategory: 'U/s.482 Cr.p.c Quash the F.I.R', 
        district: 'HYDERABAD', 
        listingDate: '2025-04-04', 
        pdrStatus: 'DISPOSED', 
        dispDate: '2025-04-04', 
        dispType: 'DISMISSED AS INFRUCTUOUS', 
        judName: 'The Honourable Sri Justice K.SURENDER', 
        disposalOrderUrl: 'https://csis.tshc.gov.in/hcorders/2024/crlp/crlp_13925_2024.pdf',
        prayer: 'to quash FIR No 91/2024 registered under Section 420 IPC 66D ITAAct20002008 at CCPS Warangal TSCSB TS Cyber Security BureauTSCSB on the file of IN THE COURT OF SPECIAL JUDICIAL MAGISTRATE OF FIRST CLASS FOR TRIAL OF CASES UNDER TELANGANA PROHIBITION and EXCISE ACT CUM IV AJCJ WARANGAL AT HANUMAKONDA and pass',
        petitioners: [{sno:1, name: 'Preethi Sivaraman', address: 'D/o Sivaraman Age 32 Occupation Business Address No A1 Subramanian street Vignarajapuram Vengaivasal selaiyur Chennai73'}],
        respondents: [{rno:1, name: 'The State of Telangana', address: 'Represented by its Public Prosecutor High Court for the State of Telangana Hyderabad'}, {rno:2, name: 'CCPS Warangal', address: 'TSCSB TS Cyber Security BureauTSCSB'}],
        iaDetails: [
          {iaNumber: 'IA 2/2024', filingDate: '16/11/2024', advName: 'MD FASIUDDIN', paperType: 'Stay Petition', status: 'Pending', prayer: 'to STAY of all further proceedings FIR No 91/2024, registered under Section 420, IPC, 66D ITAAct20002008 at CCPS Warangal, TSCSB TS Cyber Security BureauTSCSB on the file of IN THE COURT OF SPECIAL JUDICIAL MAGISTRATE OF FIRST CLASS FOR TRIAL OF CASES UNDER TELANGANA PROHIBITION  EXCISE ACT CUM IV AJCJ, WARANGAL AT HANUMAKONDA pending disposal of the above quash petition and pass', orderDate: '-', order: '', status: '1'},
          {iaNumber: 'IA 1/2024', filingDate: '16/11/2024', advName: 'MD FASIUDDIN', paperType: 'Dispense with Petition', status: 'Pending', prayer: 'to dispense with filing of in FIR No 91/2024, registered under Section 420, IPC, 66D ITAAct20002008 at Cyber CrimesPolice Station, town and pass', orderDate: '-', order: '', status: '1'},
          {iaNumber: 'IA 1/2025', filingDate: '28/03/2025', advName: 'MD FASIUDDIN', paperType: 'Amendment Petition', status: 'Pending', prayer: 'to permit the amendment of the cause title as mentioned, Incorrect Entry CCPS WARANGAL, TSCSB TS CYBER SECURITY BUREAUTSCSB Corrected Entry GUVVA SIDHARTHA S/O SHANKAR AGE 30YRS OCC PVT EMPLOYEE R/O H N0 3132249, BACK SIDE OF SHYAMALA GARDEN NEAR 100FEETS ROAD, HANAMKONDA Respondents and pass', orderDate: '-', order: '', status: '1'},
        ],
        iaSrDetails: [
          {iaSrNumber: ' IASR 97388/2024', filingDate: '13/11/2024', advName: 'MD FASIUDDIN (19272)', type: 'Dispense with Petition', status: 'PENDING FOR SCRUTINY'},
          {iaSrNumber: ' IASR 97389/2024', filingDate: '13/11/2024', advName: 'MD FASIUDDIN (19272)', type: 'Stay Petition', status: 'PENDING FOR SCRUTINY'},
        ],
        usrDetails: [
          {usrNumber: ' CRLPUSR 124337/2024', advName: 'MD FASIUDDIN', type: 'Memo Proof of Service', filingDate: '13/12/2024', remarks: 'ACCEPTED'},
        ],
        connectedMatters: [],
        vakalath: [],
        lowerCourtDetails: {
            court: '',
            district: '',
            caseNo: '',
            judge: '',
            judgeDate: ''
        },
        orders: [
          {orderOn: 'CRLP 13925/2024', judgeName: 'The Honourable Smt Justice JUVVADI SRIDEVI', dateOfOrders: '2024-11-19', orderType: 'DAILY ORDER', orderDetails: '<a target="new" href="https://csis.tshc.gov.in/hcorders/2024/202100139252024_1.pdf">View</a>'},
        ],
        otherDocuments: []
    },
];

const defaultTasks = [
    { id: 1, title: 'Review case documents', caseNumber: 'CRLP 13925/2024', assignees: [1], dueDate: '2023-10-15', status: 'open', description: 'Review all documents for the upcoming hearing', comments: [] },
    { id: 2, title: 'Prepare hearing notes', caseNumber: 'CRLP 13925/2024', assignees: [2], dueDate: '2023-10-10', status: 'in-progress', description: 'Prepare detailed notes for the hearing', comments: [] },
    { id: 3, title: 'File motion to dismiss', caseNumber: 'CRLP 13925/2024', assignees: [3], dueDate: '2023-10-05', status: 'completed', description: 'File a motion to dismiss the case', comments: [] }
];

let users = [];
let cases = [];
let tasks = [];
let notifications = [];
let invoices = [];
let officeFiles = [];
let reminders = [];
let messages = [];

// Current date for reference
const currentDateTime = new Date('2025-09-15T21:30:24');

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
    // Load modals
    await loadModals();
    
    try {
        // Initialize GitHub sync
        if (window.GitHubSync) {
            githubSync = new window.GitHubSync();
        }

        // Initialize data
        await initializeData();
        
        // Check if user is logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            isAuthenticated = true;
            showMainApplication();
            navigateToPage('dashboard');
        } else {
            showLoginScreen();
        }

        // Setup event listeners
        setupEventListeners();
        
        // Start reminder system
        startReminderSystem();
        
        // Update current time display
        updateDateTime();
        setInterval(updateDateTime, 60000); // Update every minute
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showNotification('Failed to initialize application', 'error');
    }
});

// Load modals HTML
async function loadModals() {
    try {
        const response = await fetch('modals.html');
        if (response.ok) {
            const modalHtml = await response.text();
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }
    } catch (error) {
        console.warn('Could not load modals:', error);
    }
}

// Data initialization
async function initializeData() {
    try {
        // Initialize with default data (in production, load from IndexedDB)
        users.push(...defaultUsers);
        cases.push(...defaultCases);
        tasks.push(...defaultTasks);
        
        // Initialize other data arrays
        invoices.push({
            id: 1,
            date: '2025-09-10',
            type: 'income',
            description: 'Legal consultation fees',
            amount: 25000,
            status: 'approved',
            requestedBy: 1,
            approvedBy: 1,
            caseNumber: 'CRLP 13925/2024'
        });
        
        officeFiles.push({
            id: 1,
            fileName: 'Sample Document.pdf',
            fileSize: '2.5 MB',
            uploadDate: '2025-09-14',
            uploadedBy: 2,
            filePath: '/uploads/sample-document.pdf',
            description: 'Sample legal document'
        });
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Authentication functions
function showLoginScreen() {
    // In a SPA context, redirect to login
    if (!window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

function showMainApplication() {
    // Update current username display
    const usernameElements = document.querySelectorAll('#currentUsername');
    const roleElements = document.querySelectorAll('#currentUserRole');
    
    usernameElements.forEach(el => {
        el.textContent = currentUser.username;
    });
    
    roleElements.forEach(el => {
        el.textContent = currentUser.role.replace('_', ' ').toUpperCase();
        el.className = `badge bg-${getRoleBadgeClass(currentUser.role)}`;
    });
    
    // Update navigation based on role
    updateNavigationForRole();
}

function getRoleBadgeClass(role) {
    switch(role) {
        case 'admin': return 'danger';
        case 'restricted_admin': return 'warning';
        case 'viewer': return 'info';
        default: return 'secondary';
    }
}

function updateNavigationForRole() {
    const userMgmtNav = document.getElementById('userManagementNavItem');
    const exportsNav = document.getElementById('exportsNavItem');
    const invoiceNav = document.getElementById('invoiceNavItem');
    
    if (currentUser.role === 'viewer') {
        if (userMgmtNav) userMgmtNav.style.display = 'none';
        if (exportsNav) exportsNav.style.display = 'none';
        // Viewers can see invoices but not approve
    } else {
        if (userMgmtNav) userMgmtNav.style.display = 'block';
        if (exportsNav) exportsNav.style.display = 'block';
    }
    
    // Invoice approval only for admins
    if (currentUser.role !== 'admin') {
        const approvalButtons = document.querySelectorAll('.invoice-approval-btn');
        approvalButtons.forEach(btn => btn.style.display = 'none');
    }
}

// Event listeners setup
function setupEventListeners() {
    // Logout button
    document.addEventListener('click', function(e) {
        if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
            handleLogout();
        }
    });

    // Navigation links
    document.addEventListener('click', function(e) {
        const navLink = e.target.closest('.nav-link[data-page]');
        if (navLink) {
            e.preventDefault();
            const page = navLink.dataset.page;
            navigateToPage(page);
        }
    });

    // Case management
    setupCaseEventListeners();
    
    // Task management
    setupTaskEventListeners();
    
    // User management
    setupUserEventListeners();
    
    // Invoice management
    setupInvoiceEventListeners();
    
    // Office copy management
    setupOfficeCopyEventListeners();
    
    // Messaging system
    setupMessagingEventListeners();
    
    // Reminder system
    setupReminderEventListeners();

    // Export functionality
    setupExportEventListeners();

    // GitHub sync
    setupGitHubEventListeners();

    // Filters
    setupFilters();
}

// Case Management Event Listeners
function setupCaseEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-case-btn')) {
            showCaseDetails(e.target.dataset.id);
        }
        
        if (e.target.classList.contains('edit-case-btn')) {
            editCase(e.target.dataset.id);
        }
        
        if (e.target.classList.contains('delete-case-btn')) {
            deleteCase(e.target.dataset.id);
        }

        if (e.target.classList.contains('case-detail-link')) {
            e.preventDefault();
            showCaseDetails(e.target.dataset.id);
        }
        
        if (e.target.id === 'saveCaseBtn') {
            saveCase();
        }
        
        if (e.target.id === 'downloadCasePdfBtn') {
            downloadCasePDF();
        }
    });

    // Dynamic form builders
    document.addEventListener('click', function(e) {
        if (e.target.id === 'addPetitioner') addPetitionerField();
        if (e.target.id === 'addRespondent') addRespondentField();
        if (e.target.id === 'addIaDetail') addIaDetailField();
        if (e.target.id === 'addIaSrDetail') addIaSrDetailField();
        if (e.target.id === 'addUsrDetail') addUsrDetailField();
        if (e.target.id === 'addConnectedMatter') addConnectedMatterField();
        if (e.target.id === 'addVakalath') addVakalathField();
        if (e.target.id === 'addOrder') addOrderField();
        
        if (e.target.classList.contains('remove-dynamic-field')) {
            e.target.closest('.dynamic-section').remove();
        }
    });
}

// Task Management Event Listeners
function setupTaskEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.id === 'saveTaskBtn') {
            saveTask();
        }
    });
}

// User Management Event Listeners
function setupUserEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.id === 'saveUserBtn') {
            saveUser();
        }
        
        if (e.target.classList.contains('edit-user-btn')) {
            editUser(e.target.dataset.id);
        }
        
        if (e.target.classList.contains('delete-user-btn')) {
            deleteUser(e.target.dataset.id);
        }
        
        if (e.target.id === 'saveProfileBtn') {
            updateProfile();
        }
    });
}

// Invoice Management Event Listeners
function setupInvoiceEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.id === 'saveInvoiceBtn') {
            saveInvoice();
        }
        
        if (e.target.classList.contains('approve-invoice-btn')) {
            approveInvoice(e.target.dataset.id);
        }
        
        if (e.target.classList.contains('reject-invoice-btn')) {
            rejectInvoice(e.target.dataset.id);
        }
        
        if (e.target.classList.contains('delete-invoice-btn')) {
            deleteInvoice(e.target.dataset.id);
        }
    });
}

// Office Copy Event Listeners
function setupOfficeCopyEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.id === 'uploadFileSubmitBtn') {
            uploadOfficeFile();
        }
        
        if (e.target.classList.contains('download-file-btn')) {
            downloadOfficeFile(e.target.dataset.id);
        }
        
        if (e.target.classList.contains('delete-file-btn')) {
            deleteOfficeFile(e.target.dataset.id);
        }
    });
}

// Messaging Event Listeners
function setupMessagingEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.id === 'sendMessageBtn') {
            sendMessage();
        }
        
        if (e.target.id === 'sendEmailBtn') {
            sendQuickMessage('email');
        }
        
        if (e.target.id === 'sendSmsBtn') {
            sendQuickMessage('sms');
        }
    });
    
    // Toggle email subject field based on message type
    document.addEventListener('change', function(e) {
        if (e.target.name === 'messageType') {
            const emailSubjectDiv = document.getElementById('emailSubjectDiv');
            if (e.target.value === 'sms') {
                emailSubjectDiv.style.display = 'none';
            } else {
                emailSubjectDiv.style.display = 'block';
            }
        }
    });
}

// Reminder Event Listeners
function setupReminderEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.id === 'saveReminderSettingsBtn') {
            saveReminderSettings();
        }
    });
}

// Export Event Listeners
function setupExportEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.id === 'exportCasesPdf') {
            exportCasesPDF();
        }
        if (e.target.id === 'exportCasesCsv') {
            exportCasesCSV();
        }
    });
}

// GitHub Event Listeners
function setupGitHubEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.id === 'saveGhSettings') {
            saveGitHubSettings();
        }
        if (e.target.id === 'syncToGithub') {
            syncToGitHub();
        }
    });
}

// Navigation
function navigateToPage(page) {
    // Check authentication and authorization
    if (!isAuthenticated) {
        showLoginScreen();
        return;
    }
    
    // Role-based access control
    if (!hasAccessToPage(page)) {
        showNotification('You do not have permission to access this page', 'error');
        return;
    }
    
    // Update active navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelectorAll(`[data-page="${page}"]`).forEach(link => {
        link.classList.add('active');
    });
    
    // Show/hide pages
    document.querySelectorAll('.page').forEach(pageEl => {
        pageEl.classList.add('d-none');
    });
    
    const targetPage = document.getElementById(`${page}Page`);
    if (targetPage) {
        targetPage.classList.remove('d-none');
    }
    
    currentPage = page;
    
    // Load page-specific data
    switch (page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'cases':
            loadCasesPage();
            break;
        case 'tasks':
            loadTasksPage();
            break;
        case 'reports':
            loadReportsPage();
            break;
        case 'invoices':
            loadInvoicesPage();
            break;
        case 'officecopy':
            loadOfficeCopyPage();
            break;
        case 'users':
            loadUsersPage();
            break;
        case 'exports':
            loadExportsPage();
            break;
        case 'notifications':
            loadNotificationsPage();
            break;
        case 'reminders':
            loadRemindersPage();
            break;
        case 'messaging':
            loadMessagingPage();
            break;
    }
}

// Access control
function hasAccessToPage(page) {
    const role = currentUser.role;
    
    switch (page) {
        case 'users':
            return role === 'admin';
        case 'exports':
            return role === 'admin' || role === 'restricted_admin';
        case 'invoices':
            // All can see, but approval limited to admin
            return true;
        default:
            return true;
    }
}

// Dashboard
function loadDashboard() {
    updateStats();
    renderRecentCasesTable();
    renderCharts();
}

function updateStats() {
    const totalCasesEl = document.getElementById('totalCases');
    const closedCasesEl = document.getElementById('closedCases');
    const pendingTasksEl = document.getElementById('pendingTasks');
    const activeUsersEl = document.getElementById('activeUsers');
    
    if (totalCasesEl) totalCasesEl.textContent = cases.length;
    if (closedCasesEl) closedCasesEl.textContent = cases.filter(c => c.status === 'closed').length;
    if (pendingTasksEl) pendingTasksEl.textContent = tasks.filter(t => t.status !== 'completed').length;
    if (activeUsersEl) activeUsersEl.textContent = users.length;
}

function renderRecentCasesTable() {
    const tbody = document.querySelector('#recentCasesTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const recentCases = cases.slice(-5);
    
    recentCases.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="#" class="text-decoration-none case-detail-link" data-id="${c.id}">${c.caseNumber}</a></td>
            <td>${c.primaryPetitioner}</td>
            <td>${c.primaryRespondent}</td>
            <td>${formatDate(c.filingDate)}</td>
            <td><span class="case-status status-${c.status}">${c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 view-case-btn" data-id="${c.id}"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-outline-success me-1 edit-case-btn" data-id="${c.id}"><i class="fas fa-edit"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderCharts() {
    // Clean up existing charts
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.destroy();
    });
    
    renderCaseStatusChart();
    renderCasesByYearChart();
    renderTaskStatusChart();
}

function renderCaseStatusChart() {
    const ctx = document.getElementById('caseStatusChart');
    if (!ctx) return;
    
    const statusCounts = cases.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
    }, {});
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#2ecc71', '#f39c12', '#e74c3c', '#3498db']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderCasesByYearChart() {
    const ctx = document.getElementById('casesByYearChart');
    if (!ctx) return;
    
    const yearCounts = cases.reduce((acc, c) => {
        const year = new Date(c.filingDate).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {});
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(yearCounts),
            datasets: [{
                label: 'Cases',
                data: Object.values(yearCounts),
                backgroundColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderTaskStatusChart() {
    const ctx = document.getElementById('taskStatusChart');
    if (!ctx) return;
    
    const statusCounts = tasks.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
    }, {});
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#2ecc71', '#f39c12', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Cases Page
function loadCasesPage() {
    renderCasesTable();
    setupCaseFilters();
}

function renderCasesTable() {
    const tbody = document.querySelector('#casesTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    cases.forEach(c => {
        const reminderStatus = checkCaseReminder(c);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="#" class="text-decoration-none case-detail-link" data-id="${c.id}">${c.caseNumber}</a></td>
            <td>${c.srNumber || '-'}</td>
            <td>${c.primaryPetitioner}</td>
            <td>${c.primaryRespondent}</td>
            <td>${formatDate(c.filingDate)}</td>
            <td><span class="case-status status-${c.status}">${c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span></td>
            <td>${reminderStatus.html}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary view-case-btn" data-id="${c.id}" title="View Details"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-outline-success edit-case-btn" data-id="${c.id}" title="Edit Case"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger delete-case-btn" data-id="${c.id}" title="Delete Case"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function checkCaseReminder(caseItem) {
    const today = currentDateTime;
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const filingDate = new Date(caseItem.filingDate);
    const listingDate = new Date(caseItem.listingDate);
    
    if (isToday(filingDate)) {
        return { status: 'today', html: '<span class="badge bg-danger">Filing Today</span>' };
    }
    
    if (isTomorrow(filingDate)) {
        return { status: 'tomorrow', html: '<span class="badge bg-warning">Filing Tomorrow</span>' };
    }
    
    if (isToday(listingDate)) {
        return { status: 'hearing-today', html: '<span class="badge bg-info">Hearing Today</span>' };
    }
    
    if (isTomorrow(listingDate)) {
        return { status: 'hearing-tomorrow', html: '<span class="badge bg-primary">Hearing Tomorrow</span>' };
    }
    
    return { status: 'none', html: '<span class="badge bg-secondary">No Reminder</span>' };
}

// Case Management Functions
function openAddCaseModal() {
    // Reset form
    document.getElementById('addCaseForm').reset();
    document.getElementById('caseId').value = '';
    document.getElementById('addCaseModalTitle').textContent = 'Add New Case';
    
    // Clear dynamic sections
    clearDynamicSections();
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addCaseModal'));
    modal.show();
}

function clearDynamicSections() {
    const containers = [
        'petitionersContainer',
        'respondentsContainer', 
        'iaDetailsContainer',
        'iaSrDetailsContainer',
        'usrDetailsContainer',
        'connectedMattersContainer',
        'vakalathContainer',
        'ordersContainer'
    ];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = '';
    });
}

function editCase(caseId) {
    const caseData = cases.find(c => c.id == caseId);
    if (!caseData) return;
    
    // Check permissions
    if (currentUser.role === 'viewer') {
        showNotification('You do not have permission to edit cases', 'error');
        return;
    }
    
    // Populate form with case data
    populateCaseForm(caseData);
    
    // Change modal title
    document.getElementById('addCaseModalTitle').textContent = 'Edit Case';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addCaseModal'));
    modal.show();
}

function populateCaseForm(caseData) {
    // Basic fields
    document.getElementById('caseId').value = caseData.id;
    document.getElementById('caseNumber').value = caseData.caseNumber || '';
    document.getElementById('srNumber').value = caseData.srNumber || '';
    document.getElementById('cnr').value = caseData.cnr || '';
    document.getElementById('status').value = caseData.status || '';
    document.getElementById('primaryPetitioner').value = caseData.primaryPetitioner || '';
    document.getElementById('primaryRespondent').value = caseData.primaryRespondent || '';
    document.getElementById('petitionerAdv').value = caseData.petitionerAdv || '';
    document.getElementById('respondentAdv').value = caseData.respondentAdv || '';
    document.getElementById('category').value = caseData.category || '';
    document.getElementById('subCategory').value = caseData.subCategory || '';
    document.getElementById('subSubCategory').value = caseData.subSubCategory || '';
    document.getElementById('district').value = caseData.district || '';
    document.getElementById('purpose').value = caseData.purpose || '';
    document.getElementById('judName').value = caseData.judName || '';
    document.getElementById('filingDate').value = caseData.filingDate || '';
    document.getElementById('registrationDate').value = caseData.registrationDate || '';
    document.getElementById('listingDate').value = caseData.listingDate || '';
    document.getElementById('dispDate').value = caseData.dispDate || '';
    document.getElementById('dispType').value = caseData.dispType || '';
    document.getElementById('prayer').value = caseData.prayer || '';
    
    // Lower court details
    document.getElementById('lcCourt').value = caseData.lowerCourtDetails?.court || '';
    document.getElementById('lcDist').value = caseData.lowerCourtDetails?.district || '';
    document.getElementById('lcCaseNo').value = caseData.lowerCourtDetails?.caseNo || '';
    document.getElementById('lcJudge').value = caseData.lowerCourtDetails?.judge || '';
    document.getElementById('lcJudgeDate').value = caseData.lowerCourtDetails?.judgeDate || '';
    
    // Clear and populate dynamic sections
    clearDynamicSections();
    
    // Populate petitioners
    if (caseData.petitioners && caseData.petitioners.length > 0) {
        caseData.petitioners.forEach(petitioner => {
            addPetitionerField(petitioner);
        });
    }
    
    // Populate respondents
    if (caseData.respondents && caseData.respondents.length > 0) {
        caseData.respondents.forEach(respondent => {
            addRespondentField(respondent);
        });
    }
    
    // Populate IA details
    if (caseData.iaDetails && caseData.iaDetails.length > 0) {
        caseData.iaDetails.forEach(ia => {
            addIaDetailField(ia);
        });
    }
    
    // Populate other dynamic sections...
    if (caseData.iaSrDetails && caseData.iaSrDetails.length > 0) {
        caseData.iaSrDetails.forEach(iaSr => addIaSrDetailField(iaSr));
    }
    
    if (caseData.usrDetails && caseData.usrDetails.length > 0) {
        caseData.usrDetails.forEach(usr => addUsrDetailField(usr));
    }
    
    if (caseData.orders && caseData.orders.length > 0) {
        caseData.orders.forEach(order => addOrderField(order));
    }
}

function saveCase() {
    const form = document.getElementById('addCaseForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Check permissions
    if (currentUser.role === 'viewer') {
        showNotification('You do not have permission to save cases', 'error');
        return;
    }
    
    const caseId = document.getElementById('caseId').value;
    const isEdit = !!caseId;
    
    const caseData = {
        id: isEdit ? parseInt(caseId) : Date.now(),
        caseNumber: document.getElementById('caseNumber').value,
        srNumber: document.getElementById('srNumber').value,
        cnr: document.getElementById('cnr').value,
        status: document.getElementById('status').value,
        primaryPetitioner: document.getElementById('primaryPetitioner').value,
        primaryRespondent: document.getElementById('primaryRespondent').value,
        petitionerAdv: document.getElementById('petitionerAdv').value,
        respondentAdv: document.getElementById('respondentAdv').value,
        category: document.getElementById('category').value,
        subCategory: document.getElementById('subCategory').value,
        subSubCategory: document.getElementById('subSubCategory').value,
        district: document.getElementById('district').value,
        purpose: document.getElementById('purpose').value,
        judName: document.getElementById('judName').value,
        filingDate: document.getElementById('filingDate').value,
        registrationDate: document.getElementById('registrationDate').value,
        listingDate: document.getElementById('listingDate').value,
        dispDate: document.getElementById('dispDate').value,
        dispType: document.getElementById('dispType').value,
        prayer: document.getElementById('prayer').value,
        lowerCourtDetails: {
            court: document.getElementById('lcCourt').value,
            district: document.getElementById('lcDist').value,
            caseNo: document.getElementById('lcCaseNo').value,
            judge: document.getElementById('lcJudge').value,
            judgeDate: document.getElementById('lcJudgeDate').value
        },
        petitioners: collectDynamicData('petitionersContainer'),
        respondents: collectDynamicData('respondentsContainer'),
        iaDetails: collectDynamicData('iaDetailsContainer'),
        iaSrDetails: collectDynamicData('iaSrDetailsContainer'),
        usrDetails: collectDynamicData('usrDetailsContainer'),
        connectedMatters: collectDynamicData('connectedMattersContainer'),
        vakalath: collectDynamicData('vakalathContainer'),
        orders: collectDynamicData('ordersContainer'),
        otherDocuments: []
    };
    
    if (isEdit) {
        const index = cases.findIndex(c => c.id == caseId);
        if (index !== -1) {
            cases[index] = caseData;
        }
    } else {
        cases.push(caseData);
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addCaseModal'));
    modal.hide();
    
    // Refresh tables
    if (currentPage === 'cases') {
        renderCasesTable();
    }
    renderRecentCasesTable();
    updateStats();
    
    // Sync to GitHub if enabled
    syncToGitHub();
    
    showNotification(isEdit ? 'Case updated successfully!' : 'Case added successfully!', 'success');
}

function collectDynamicData(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    
    const sections = container.querySelectorAll('.dynamic-section');
    const data = [];
    
    sections.forEach(section => {
        const inputs = section.querySelectorAll('input, textarea, select');
        const item = {};
        
        inputs.forEach(input => {
            if (input.name) {
                item[input.name] = input.value;
            }
        });
        
        if (Object.keys(item).length > 0) {
            data.push(item);
        }
    });
    
    return data;
}

// Dynamic field generators
function addPetitionerField(data = {}) {
    const container = document.getElementById('petitionersContainer');
    const index = container.children.length + 1;
    
    const fieldHtml = `
        <div class="dynamic-section">
            <button type="button" class="btn btn-sm btn-outline-danger remove-btn remove-dynamic-field">×</button>
            <div class="row">
                <div class="col-md-2">
                    <label class="form-label">S.No.</label>
                    <input type="number" class="form-control" name="sno" value="${data.sno || index}">
                </div>
                <div class="col-md-5">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" name="name" value="${data.name || ''}">
                </div>
                <div class="col-md-5">
                    <label class="form-label">Address</label>
                    <textarea class="form-control" name="address" rows="2">${data.address || ''}</textarea>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', fieldHtml);
}

function addRespondentField(data = {}) {
    const container = document.getElementById('respondentsContainer');
    const index = container.children.length + 1;
    
    const fieldHtml = `
        <div class="dynamic-section">
            <button type="button" class="btn btn-sm btn-outline-danger remove-btn remove-dynamic-field">×</button>
            <div class="row">
                <div class="col-md-2">
                    <label class="form-label">R.No.</label>
                    <input type="number" class="form-control" name="rno" value="${data.rno || index}">
                </div>
                <div class="col-md-5">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" name="name" value="${data.name || ''}">
                </div>
                <div class="col-md-5">
                    <label class="form-label">Address</label>
                    <textarea class="form-control" name="address" rows="2">${data.address || ''}</textarea>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', fieldHtml);
}

function addIaDetailField(data = {}) {
    const container = document.getElementById('iaDetailsContainer');
    
    const fieldHtml = `
        <div class="dynamic-section">
            <button type="button" class="btn btn-sm btn-outline-danger remove-btn remove-dynamic-field">×</button>
            <div class="row">
                <div class="col-md-3">
                    <label class="form-label">IA Number</label>
                    <input type="text" class="form-control" name="iaNumber" value="${data.iaNumber || ''}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Filing Date</label>
                    <input type="date" class="form-control" name="filingDate" value="${data.filingDate || ''}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Advocate Name</label>
                    <input type="text" class="form-control" name="advName" value="${data.advName || ''}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Paper Type</label>
                    <input type="text" class="form-control" name="paperType" value="${data.paperType || ''}">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Status</label>
                    <input type="text" class="form-control" name="status" value="${data.status || ''}">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Order Date</label>
                    <input type="date" class="form-control" name="orderDate" value="${data.orderDate || ''}">
                </div>
                <div class="col-md-12">
                    <label class="form-label">Prayer</label>
                    <textarea class="form-control" name="prayer" rows="3">${data.prayer || ''}</textarea>
                </div>
                <div class="col-md-12">
                    <label class="form-label">Order</label>
                    <textarea class="form-control" name="order" rows="2">${data.order || ''}</textarea>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', fieldHtml);
}

function addIaSrDetailField(data = {}) {
    const container = document.getElementById('iaSrDetailsContainer');
    
    const fieldHtml = `
        <div class="dynamic-section">
            <button type="button" class="btn btn-sm btn-outline-danger remove-btn remove-dynamic-field">×</button>
            <div class="row">
                <div class="col-md-3">
                    <label class="form-label">IA SR Number</label>
                    <input type="text" class="form-control" name="iaSrNumber" value="${data.iaSrNumber || ''}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Filing Date</label>
                    <input type="date" class="form-control" name="filingDate" value="${data.filingDate || ''}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Advocate Name</label>
                    <input type="text" class="form-control" name="advName" value="${data.advName || ''}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Type</label>
                    <input type="text" class="form-control" name="type" value="${data.type || ''}">
                </div>
                <div class="col-md-12">
                    <label class="form-label">Status</label>
                    <input type="text" class="form-control" name="status" value="${data.status || ''}">
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', fieldHtml);
}

function addUsrDetailField(data = {}) {
    const container = document.getElementById('usrDetailsContainer');
    
    const fieldHtml = `
        <div class="dynamic-section">
            <button type="button" class="btn btn-sm btn-outline-danger remove-btn remove-dynamic-field">×</button>
            <div class="row">
                <div class="col-md-3">
                    <label class="form-label">USR Number</label>
                    <input type="text" class="form-control" name="usrNumber" value="${data.usrNumber || ''}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Advocate Name</label>
                    <input type="text" class="form-control" name="advName" value="${data.advName || ''}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Type</label>
                    <input type="text" class="form-control" name="type" value="${data.type || ''}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Filing Date</label>
                    <input type="date" class="form-control" name="filingDate" value="${data.filingDate || ''}">
                </div>
                <div class="col-md-12">
                    <label class="form-label">Remarks</label>
                    <textarea class="form-control" name="remarks" rows="2">${data.remarks || ''}</textarea>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', fieldHtml);
}

function addConnectedMatterField(data = {}) {
    const container = document.getElementById('connectedMattersContainer');
    
    const fieldHtml = `
        <div class="dynamic-section">
            <button type="button" class="btn btn-sm btn-outline-danger remove-btn remove-dynamic-field">×</button>
            <div class="row">
                <div class="col-md-6">
                    <label class="form-label">Matter Number</label>
                    <input type="text" class="form-control" name="matterNumber" value="${data.matterNumber || ''}">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Connection Type</label>
                    <input type="text" class="form-control" name="connectionType" value="${data.connectionType || ''}">
                </div>
                <div class="col-md-12">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" name="description" rows="2">${data.description || ''}</textarea>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', fieldHtml);
}

function addVakalathField(data = {}) {
    const container = document.getElementById('vakalathContainer');
    
    const fieldHtml = `
        <div class="dynamic-section">
            <button type="button" class="btn btn-sm btn-outline-danger remove-btn remove-dynamic-field">×</button>
            <div class="row">
                <div class="col-md-4">
                    <label class="form-label">Advocate Name</label>
                    <input type="text" class="form-control" name="advocateName" value="${data.advocateName || ''}">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Filing Date</label>
                    <input type="date" class="form-control" name="filingDate" value="${data.filingDate || ''}">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Status</label>
                    <input type="text" class="form-control" name="status" value="${data.status || ''}">
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', fieldHtml);
}

function addOrderField(data = {}) {
    const container = document.getElementById('ordersContainer');
    
    const fieldHtml = `
        <div class="dynamic-section">
            <button type="button" class="btn btn-sm btn-outline-danger remove-btn remove-dynamic-field">×</button>
            <div class="row">
                <div class="col-md-3">
                    <label class="form-label">Order On</label>
                    <input type="text" class="form-control" name="orderOn" value="${data.orderOn || ''}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Judge Name</label>
                    <input type="text" class="form-control" name="judgeName" value="${data.judgeName || ''}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Date of Orders</label>
                    <input type="date" class="form-control" name="dateOfOrders" value="${data.dateOfOrders || ''}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Order Type</label>
                    <input type="text" class="form-control" name="orderType" value="${data.orderType || ''}">
                </div>
                <div class="col-md-12">
                    <label class="form-label">Order Details</label>
                    <textarea class="form-control" name="orderDetails" rows="3">${data.orderDetails || ''}</textarea>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', fieldHtml);
}

function showCaseDetails(caseId) {
    const caseData = cases.find(c => c.id == caseId);
    if (!caseData) return;
    
    const modalContent = document.getElementById('caseDetailsContent');
    modalContent.innerHTML = generateCaseDetailsHtml(caseData);
    
    // Set edit button data
    document.getElementById('editCaseFromModalBtn').dataset.id = caseId;
    
    const modal = new bootstrap.Modal(document.getElementById('caseDetailsModal'));
    modal.show();
}

function generateCaseDetailsHtml(caseData) {
    return `
        <div class="case-details-container">
            <div class="case-details-header">
                <h3>Case Details</h3>
                <div class="case-number">${caseData.caseNumber}</div>
            </div>
            
            <div class="case-details-body">
                <div class="case-section">
                    <h6 class="case-section-title">Basic Information</h6>
                    <table class="case-details-table">
                        <tr><th>Case Number</th><td>${caseData.caseNumber || '-'}</td></tr>
                        <tr><th>SR Number</th><td>${caseData.srNumber || '-'}</td></tr>
                        <tr><th>CNR</th><td>${caseData.cnr || '-'}</td></tr>
                        <tr><th>Status</th><td><span class="case-status status-${caseData.status}">${caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}</span></td></tr>
                        <tr><th>Category</th><td>${caseData.category || '-'}</td></tr>
                        <tr><th>Sub Category</th><td>${caseData.subCategory || '-'}</td></tr>
                        <tr><th>Sub Sub Category</th><td>${caseData.subSubCategory || '-'}</td></tr>
                        <tr><th>District</th><td>${caseData.district || '-'}</td></tr>
                        <tr><th>Purpose</th><td>${caseData.purpose || '-'}</td></tr>
                    </table>
                </div>
                
                <div class="case-section">
                    <h6 class="case-section-title">Party Information</h6>
                    <table class="case-details-table">
                        <tr><th>Primary Petitioner</th><td>${caseData.primaryPetitioner || '-'}</td></tr>
                        <tr><th>Primary Respondent</th><td>${caseData.primaryRespondent || '-'}</td></tr>
                        <tr><th>Petitioner Advocate</th><td>${caseData.petitionerAdv || '-'}</td></tr>
                        <tr><th>Respondent Advocate</th><td>${caseData.respondentAdv || '-'}</td></tr>
                    </table>
                </div>
                
                <div class="case-section">
                    <h6 class="case-section-title">Important Dates</h6>
                    <table class="case-details-table">
                        <tr><th>Filing Date</th><td>${formatDate(caseData.filingDate) || '-'}</td></tr>
                        <tr><th>Registration Date</th><td>${formatDate(caseData.registrationDate) || '-'}</td></tr>
                        <tr><th>Listing Date</th><td>${formatDate(caseData.listingDate) || '-'}</td></tr>
                        <tr><th>Disposal Date</th><td>${formatDate(caseData.dispDate) || '-'}</td></tr>
                        <tr><th>Disposal Type</th><td>${caseData.dispType || '-'}</td></tr>
                        <tr><th>Hon'ble Judge</th><td>${caseData.judName || '-'}</td></tr>
                    </table>
                </div>
                
                ${caseData.prayer ? `
                <div class="case-section">
                    <h6 class="case-section-title">Prayer</h6>
                    <p>${caseData.prayer}</p>
                </div>
                ` : ''}
                
                ${generatePetitionersTable(caseData.petitioners)}
                ${generateRespondentsTable(caseData.respondents)}
                ${generateIaDetailsTable(caseData.iaDetails)}
                ${generateIaSrDetailsTable(caseData.iaSrDetails)}
                ${generateUsrDetailsTable(caseData.usrDetails)}
                ${generateOrdersTable(caseData.orders)}
            </div>
        </div>
    `;
}

function generatePetitionersTable(petitioners) {
    if (!petitioners || petitioners.length === 0) return '';
    
    const rows = petitioners.map(p => 
        `<tr><td>${p.sno || '-'}</td><td>${p.name || '-'}</td><td>${p.address || '-'}</td></tr>`
    ).join('');
    
    return `
        <div class="case-section">
            <h6 class="case-section-title">Petitioners</h6>
            <table class="ia-details-table">
                <thead>
                    <tr><th>S.No</th><th>Name</th><th>Address</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

function generateRespondentsTable(respondents) {
    if (!respondents || respondents.length === 0) return '';
    
    const rows = respondents.map(r => 
        `<tr><td>${r.rno || '-'}</td><td>${r.name || '-'}</td><td>${r.address || '-'}</td></tr>`
    ).join('');
    
    return `
        <div class="case-section">
            <h6 class="case-section-title">Respondents</h6>
            <table class="ia-details-table">
                <thead>
                    <tr><th>R.No</th><th>Name</th><th>Address</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

function generateIaDetailsTable(iaDetails) {
    if (!iaDetails || iaDetails.length === 0) return '';
    
    const rows = iaDetails.map(ia => `
        <tr>
            <td>${ia.iaNumber || '-'}</td>
            <td>${formatDate(ia.filingDate) || '-'}</td>
            <td>${ia.advName || '-'}</td>
            <td>${ia.paperType || '-'}</td>
            <td>${ia.status || '-'}</td>
            <td>${ia.prayer || '-'}</td>
        </tr>
    `).join('');
    
    return `
        <div class="case-section">
            <h6 class="case-section-title">IA Details</h6>
            <table class="ia-details-table">
                <thead>
                    <tr><th>IA Number</th><th>Filing Date</th><th>Advocate</th><th>Type</th><th>Status</th><th>Prayer</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

function generateIaSrDetailsTable(iaSrDetails) {
    if (!iaSrDetails || iaSrDetails.length === 0) return '';
    
    const rows = iaSrDetails.map(sr => `
        <tr>
            <td>${sr.iaSrNumber || '-'}</td>
            <td>${formatDate(sr.filingDate) || '-'}</td>
            <td>${sr.advName || '-'}</td>
            <td>${sr.type || '-'}</td>
            <td>${sr.status || '-'}</td>
        </tr>
    `).join('');
    
    return `
        <div class="case-section">
            <h6 class="case-section-title">IA SR Details</h6>
            <table class="ia-details-table">
                <thead>
                    <tr><th>IA SR Number</th><th>Filing Date</th><th>Advocate</th><th>Type</th><th>Status</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

function generateUsrDetailsTable(usrDetails) {
    if (!usrDetails || usrDetails.length === 0) return '';
    
    const rows = usrDetails.map(usr => `
        <tr>
            <td>${usr.usrNumber || '-'}</td>
            <td>${usr.advName || '-'}</td>
            <td>${usr.type || '-'}</td>
            <td>${formatDate(usr.filingDate) || '-'}</td>
            <td>${usr.remarks || '-'}</td>
        </tr>
    `).join('');
    
    return `
        <div class="case-section">
            <h6 class="case-section-title">USR Details</h6>
            <table class="ia-details-table">
                <thead>
                    <tr><th>USR Number</th><th>Advocate</th><th>Type</th><th>Filing Date</th><th>Remarks</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

function generateOrdersTable(orders) {
    if (!orders || orders.length === 0) return '';
    
    const rows = orders.map(order => `
        <tr>
            <td>${order.orderOn || '-'}</td>
            <td>${order.judgeName || '-'}</td>
            <td>${formatDate(order.dateOfOrders) || '-'}</td>
            <td>${order.orderType || '-'}</td>
            <td>${order.orderDetails || '-'}</td>
        </tr>
    `).join('');
    
    return `
        <div class="case-section">
            <h6 class="case-section-title">Orders</h6>
            <table class="ia-details-table">
                <thead>
                    <tr><th>Order On</th><th>Judge Name</th><th>Date</th><th>Type</th><th>Details</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

function deleteCase(caseId) {
    if (currentUser.role === 'viewer') {
        showNotification('You do not have permission to delete cases', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete this case?')) {
        const index = cases.findIndex(c => c.id == caseId);
        if (index !== -1) {
            cases.splice(index, 1);
            renderCasesTable();
            renderRecentCasesTable();
            updateStats();
            showNotification('Case deleted successfully!', 'success');
            
            // Sync to GitHub
            syncToGitHub();
        }
    }
}

// Invoice Management
function loadInvoicesPage() {
    renderInvoiceStats();
    renderInvoicesTable();
    populateInvoiceCaseDropdown();
}

function renderInvoiceStats() {
    const totalIncome = invoices.filter(i => i.type === 'income' && i.status === 'approved').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = invoices.filter(i => i.type === 'expense' && i.status === 'approved').reduce((sum, i) => sum + i.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    const pendingCount = invoices.filter(i => i.status === 'pending').length;
    
    const totalIncomeEl = document.getElementById('totalIncome');
    const totalExpensesEl = document.getElementById('totalExpenses');
    const netBalanceEl = document.getElementById('netBalance');
    const pendingInvoicesEl = document.getElementById('pendingInvoices');
    
    if (totalIncomeEl) totalIncomeEl.textContent = `₹${totalIncome.toLocaleString()}`;
    if (totalExpensesEl) totalExpensesEl.textContent = `₹${totalExpenses.toLocaleString()}`;
    if (netBalanceEl) netBalanceEl.textContent = `₹${netBalance.toLocaleString()}`;
    if (pendingInvoicesEl) pendingInvoicesEl.textContent = pendingCount;
}

function renderInvoicesTable() {
    const tbody = document.querySelector('#invoicesTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    invoices.forEach(invoice => {
        const user = users.find(u => u.id === invoice.requestedBy);
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>INV-${invoice.id}</td>
            <td>${formatDate(invoice.date)}</td>
            <td><span class="badge ${invoice.type === 'income' ? 'bg-success' : 'bg-danger'}">${invoice.type.toUpperCase()}</span></td>
            <td>${invoice.description}</td>
            <td>₹${invoice.amount.toLocaleString()}</td>
            <td><span class="badge bg-${getInvoiceStatusColor(invoice.status)}">${invoice.status.toUpperCase()}</span></td>
            <td>${user ? user.username : 'Unknown'}</td>
            <td>
                ${currentUser.role === 'admin' && invoice.status === 'pending' ? `
                    <button class="btn btn-sm btn-success approve-invoice-btn" data-id="${invoice.id}"><i class="fas fa-check"></i></button>
                    <button class="btn btn-sm btn-danger reject-invoice-btn" data-id="${invoice.id}"><i class="fas fa-times"></i></button>
                ` : ''}
                ${currentUser.role === 'admin' ? `
                    <button class="btn btn-sm btn-outline-danger delete-invoice-btn" data-id="${invoice.id}"><i class="fas fa-trash"></i></button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function getInvoiceStatusColor(status) {
    switch(status) {
        case 'approved': return 'success';
        case 'rejected': return 'danger';
        case 'pending': return 'warning';
        default: return 'secondary';
    }
}

function populateInvoiceCaseDropdown() {
    const select = document.getElementById('invoiceCaseNumber');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Case (Optional)</option>';
    cases.forEach(c => {
        const option = document.createElement('option');
        option.value = c.caseNumber;
        option.textContent = `${c.caseNumber} - ${c.primaryPetitioner}`;
        select.appendChild(option);
    });
}

function saveInvoice() {
    const form = document.getElementById('addInvoiceForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const invoiceId = document.getElementById('invoiceId').value;
    const isEdit = !!invoiceId;
    
    const invoiceData = {
        id: isEdit ? parseInt(invoiceId) : Date.now(),
        date: document.getElementById('invoiceDate').value,
        type: document.getElementById('invoiceType').value,
        description: document.getElementById('invoiceDescription').value,
        amount: parseFloat(document.getElementById('invoiceAmount').value),
        caseNumber: document.getElementById('invoiceCaseNumber').value,
        notes: document.getElementById('invoiceNotes').value,
        requestedBy: currentUser.id,
        status: currentUser.role === 'admin' ? 'approved' : 'pending',
        requestedDate: new Date().toISOString().split('T')[0]
    };
    
    if (isEdit) {
        const index = invoices.findIndex(i => i.id == invoiceId);
        if (index !== -1) {
            invoices[index] = invoiceData;
        }
    } else {
        invoices.push(invoiceData);
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addInvoiceModal'));
    modal.hide();
    
    // Refresh data
    renderInvoicesTable();
    renderInvoiceStats();
    
    showNotification(isEdit ? 'Invoice updated successfully!' : 'Invoice request submitted successfully!', 'success');
}

function approveInvoice(invoiceId) {
    const invoice = invoices.find(i => i.id == invoiceId);
    if (invoice) {
        invoice.status = 'approved';
        invoice.approvedBy = currentUser.id;
        invoice.approvedDate = new Date().toISOString().split('T')[0];
        
        renderInvoicesTable();
        renderInvoiceStats();
        
        showNotification('Invoice approved successfully!', 'success');
    }
}

function rejectInvoice(invoiceId) {
    const invoice = invoices.find(i => i.id == invoiceId);
    if (invoice) {
        invoice.status = 'rejected';
        invoice.approvedBy = currentUser.id;
        invoice.approvedDate = new Date().toISOString().split('T')[0];
        
        renderInvoicesTable();
        renderInvoiceStats();
        
        showNotification('Invoice rejected successfully!', 'success');
    }
}

function deleteInvoice(invoiceId) {
    if (confirm('Are you sure you want to delete this invoice?')) {
        const index = invoices.findIndex(i => i.id == invoiceId);
        if (index !== -1) {
            invoices.splice(index, 1);
            renderInvoicesTable();
            renderInvoiceStats();
            showNotification('Invoice deleted successfully!', 'success');
        }
    }
}

// Office Copy Management
function loadOfficeCopyPage() {
    renderOfficeCopyTable();
}

function renderOfficeCopyTable() {
    const tbody = document.querySelector('#officeCopyTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    officeFiles.forEach(file => {
        const user = users.find(u => u.id === file.uploadedBy);
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${file.fileName}</td>
            <td>${file.fileSize}</td>
            <td>${formatDate(file.uploadDate)}</td>
            <td>${user ? user.username : 'Unknown'}</td>
            <td>
                ${currentUser.role === 'admin' ? `
                    <button class="btn btn-sm btn-primary download-file-btn" data-id="${file.id}"><i class="fas fa-download"></i> Download</button>
                    <button class="btn btn-sm btn-danger delete-file-btn" data-id="${file.id}"><i class="fas fa-trash"></i> Delete</button>
                ` : '<span class="text-muted">Admin Only</span>'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function uploadOfficeFile() {
    const fileInput = document.getElementById('officeFile');
    const description = document.getElementById('fileDescription').value;
    
    if (!fileInput.files.length) {
        showNotification('Please select a file to upload', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('File size must be less than 10MB', 'error');
        return;
    }
    
    const fileData = {
        id: Date.now(),
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: currentUser.id,
        description: description,
        filePath: `/uploads/${file.name}` // In real app, upload to server
    };
    
    officeFiles.push(fileData);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('uploadFileModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('uploadFileForm').reset();
    
    // Refresh table
    renderOfficeCopyTable();
    
    showNotification('File uploaded successfully!', 'success');
}

function downloadOfficeFile(fileId) {
    if (currentUser.role !== 'admin') {
        showNotification('Only administrators can download files', 'error');
        return;
    }
    
    const file = officeFiles.find(f => f.id == fileId);
    if (!file) {
        showNotification('File not found', 'error');
        return;
    }
    
    // In real app, this would download from server
    showNotification(`Downloading ${file.fileName}...`, 'info');
}

function deleteOfficeFile(fileId) {
    if (currentUser.role !== 'admin') {
        showNotification('Only administrators can delete files', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete this file?')) {
        const index = officeFiles.findIndex(f => f.id == fileId);
        if (index !== -1) {
            officeFiles.splice(index, 1);
            renderOfficeCopyTable();
            showNotification('File deleted successfully!', 'success');
        }
    }
}

// Messaging System
function loadMessagingPage() {
    renderMessageHistory();
    populateUserDropdowns();
}

function renderMessageHistory() {
    const messageHistoryDiv = document.getElementById('messageHistory');
    if (!messageHistoryDiv) return;
    
    if (messages.length === 0) {
        messageHistoryDiv.innerHTML = `
            <div class="text-center text-muted py-5">
                <i class="fas fa-envelope-open fa-3x mb-3"></i>
                <p>No messages sent yet.</p>
            </div>
        `;
        return;
    }
    
    let historyHtml = '';
    messages.forEach(message => {
        const recipients = message.recipients.map(id => {
            const user = users.find(u => u.id === id);
            return user ? user.username : 'Unknown';
        }).join(', ');
        
        historyHtml += `
            <div class="message-item border-bottom pb-3 mb-3">
                <div class="d-flex justify-content-between">
                    <h6>${message.subject || 'No Subject'}</h6>
                    <small class="text-muted">${formatDateTime(message.sentDate)}</small>
                </div>
                <p class="mb-1">${message.content}</p>
                <small class="text-muted">To: ${recipients} | Type: ${message.type.toUpperCase()}</small>
            </div>
        `;
    });
    
    messageHistoryDiv.innerHTML = historyHtml;
}

function populateUserDropdowns() {
    const selects = [
        document.getElementById('quickUserSelect'),
        document.getElementById('messageRecipients')
    ];
    
    selects.forEach(select => {
        if (!select) return;
        
        // Clear existing options
        if (select.id === 'quickUserSelect') {
            select.innerHTML = '<option value="">Select User</option>';
        } else {
            select.innerHTML = '';
        }
        
        users.forEach(user => {
            if (user.id !== currentUser.id) { // Don't include current user
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.username} (${user.role})`;
                select.appendChild(option);
            }
        });
    });
}

function sendMessage() {
    const form = document.getElementById('composeMessageForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const recipients = Array.from(document.getElementById('messageRecipients').selectedOptions).map(option => parseInt(option.value));
    const messageType = document.querySelector('input[name="messageType"]:checked').value;
    const subject = document.getElementById('messageSubject').value;
    const content = document.getElementById('messageContent').value;
    const priority = document.getElementById('messagePriority').value;
    
    const messageData = {
        id: Date.now(),
        recipients: recipients,
        type: messageType,
        subject: subject,
        content: content,
        priority: priority,
        sentBy: currentUser.id,
        sentDate: new Date().toISOString()
    };
    
    messages.push(messageData);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('composeMessageModal'));
    modal.hide();
    
    // Reset form
    form.reset();
    
    // Refresh message history
    renderMessageHistory();
    
    showNotification(`Message sent to ${recipients.length} recipient(s)!`, 'success');
}

function sendQuickMessage(type) {
    const userSelect = document.getElementById('quickUserSelect');
    const messageContent = document.getElementById('quickMessage');
    
    if (!userSelect.value || !messageContent.value) {
        showNotification('Please select a user and enter a message', 'error');
        return;
    }
    
    const messageData = {
        id: Date.now(),
        recipients: [parseInt(userSelect.value)],
        type: type,
        subject: 'Quick Message',
        content: messageContent.value,
        priority: 'normal',
        sentBy: currentUser.id,
        sentDate: new Date().toISOString()
    };
    
    messages.push(messageData);
    
    // Reset form
    userSelect.value = '';
    messageContent.value = '';
    
    // Refresh message history
    renderMessageHistory();
    
    showNotification(`${type.toUpperCase()} sent successfully!`, 'success');
}

// Reminder System
function startReminderSystem() {
    // Check reminders every hour (in production, use proper scheduling)
    setInterval(checkReminders, 60 * 60 * 1000);
    
    // Check immediately on startup
    checkReminders();
}

function checkReminders() {
    const today = currentDateTime;
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    cases.forEach(caseItem => {
        // Check filing date reminders
        const filingDate = new Date(caseItem.filingDate);
        if (isTomorrow(filingDate)) {
            sendReminderNotification(caseItem, 'filing', 'tomorrow');
        }
        
        if (isPastDate(filingDate) && caseItem.status === 'pending') {
            sendReminderNotification(caseItem, 'filing', 'overdue');
        }
        
        // Check hearing date reminders
        const listingDate = new Date(caseItem.listingDate);
        if (isTomorrow(listingDate)) {
            sendReminderNotification(caseItem, 'hearing', 'tomorrow');
        }
    });
}

function sendReminderNotification(caseItem, type, timing) {
    const reminder = {
        id: Date.now(),
        caseId: caseItem.id,
        caseNumber: caseItem.caseNumber,
        type: type,
        timing: timing,
        date: currentDateTime.toISOString().split('T')[0],
        status: 'sent'
    };
    
    reminders.push(reminder);
    
    // Send notifications to admins and restricted admins
    const recipients = users.filter(u => u.role === 'admin' || u.role === 'restricted_admin');
    
    recipients.forEach(user => {
        const message = generateReminderMessage(caseItem, type, timing);
        
        // Add to message history
        messages.push({
            id: Date.now() + Math.random(),
            recipients: [user.id],
            type: 'email',
            subject: `Case Reminder: ${caseItem.caseNumber}`,
            content: message,
            priority: timing === 'overdue' ? 'urgent' : 'high',
            sentBy: 1, // System
            sentDate: new Date().toISOString()
        });
    });
    
    console.log(`Reminder sent for case ${caseItem.caseNumber} - ${type} ${timing}`);
}

function generateReminderMessage(caseItem, type, timing) {
    const typeText = type === 'filing' ? 'Filing' : 'Hearing';
    const timingText = timing === 'tomorrow' ? 'is scheduled for tomorrow' : 'is overdue';
    
    return `
        Dear Team,
        
        This is an automated reminder regarding case ${caseItem.caseNumber}.
        
        ${typeText} ${timingText} for case:
        - Case Number: ${caseItem.caseNumber}
        - Petitioner: ${caseItem.primaryPetitioner}
        - Respondent: ${caseItem.primaryRespondent}
        
        Please take necessary action.
        
        Best regards,
        Case Management System
    `;
}

function loadRemindersPage() {
    renderUpcomingReminders();
    renderOverdueReminders();
    renderRemindersTable();
}

function renderUpcomingReminders() {
    const container = document.getElementById('upcomingReminders');
    if (!container) return;
    
    const upcoming = getUpcomingReminders();
    
    if (upcoming.length === 0) {
        container.innerHTML = '<p class="text-muted">No upcoming deadlines.</p>';
        return;
    }
    
    let html = '';
    upcoming.forEach(item => {
        html += `
            <div class="alert alert-info">
                <strong>${item.caseNumber}</strong><br>
                ${item.type} on ${formatDate(item.date)}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderOverdueReminders() {
    const container = document.getElementById('overdueReminders');
    if (!container) return;
    
    const overdue = getOverdueReminders();
    
    if (overdue.length === 0) {
        container.innerHTML = '<p class="text-muted">No overdue tasks.</p>';
        return;
    }
    
    let html = '';
    overdue.forEach(item => {
        html += `
            <div class="alert alert-danger">
                <strong>${item.caseNumber}</strong><br>
                ${item.type} was due on ${formatDate(item.date)}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function getUpcomingReminders() {
    const upcoming = [];
    const today = currentDateTime;
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    cases.forEach(caseItem => {
        const filingDate = new Date(caseItem.filingDate);
        const listingDate = new Date(caseItem.listingDate);
        
        if (filingDate > today && filingDate <= nextWeek) {
            upcoming.push({
                caseNumber: caseItem.caseNumber,
                type: 'Filing',
                date: caseItem.filingDate
            });
        }
        
        if (listingDate > today && listingDate <= nextWeek) {
            upcoming.push({
                caseNumber: caseItem.caseNumber,
                type: 'Hearing',
                date: caseItem.listingDate
            });
        }
    });
    
    return upcoming;
}

function getOverdueReminders() {
    const overdue = [];
    const today = currentDateTime;
    
    cases.forEach(caseItem => {
        const filingDate = new Date(caseItem.filingDate);
        const listingDate = new Date(caseItem.listingDate);
        
        if (filingDate < today && caseItem.status === 'pending') {
            overdue.push({
                caseNumber: caseItem.caseNumber,
                type: 'Filing',
                date: caseItem.filingDate
            });
        }
        
        if (listingDate < today && caseItem.status !== 'closed') {
            overdue.push({
                caseNumber: caseItem.caseNumber,
                type: 'Hearing',
                date: caseItem.listingDate
            });
        }
    });
    
    return overdue;
}

function renderRemindersTable() {
    const tbody = document.querySelector('#remindersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    reminders.forEach(reminder => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatDate(reminder.date)}</td>
            <td>${reminder.caseNumber}</td>
            <td><span class="badge bg-info">${reminder.type.toUpperCase()}</span></td>
            <td><span class="badge bg-success">${reminder.status.toUpperCase()}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary">View Details</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Task Management
function loadTasksPage() {
    renderTasksTable();
    populateTaskDropdowns();
}

function renderTasksTable() {
    const tbody = document.querySelector('#tasksTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    tasks.forEach(task => {
        const assigneeNames = task.assignees.map(id => {
            const user = users.find(u => u.id === id);
            return user ? user.username : 'Unknown';
        }).join(', ');
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td>${task.caseNumber || '-'}</td>
            <td>${assigneeNames}</td>
            <td>${formatDate(task.dueDate)}</td>
            <td><span class="task-status task-status-${task.status}">${task.status.replace('-', ' ').toUpperCase()}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-task-btn" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger delete-task-btn" data-id="${task.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function populateTaskDropdowns() {
    const caseSelect = document.getElementById('taskCaseNumber');
    const assigneeSelect = document.getElementById('taskAssignees');
    
    if (caseSelect) {
        caseSelect.innerHTML = '<option value="">Select Case</option>';
        cases.forEach(c => {
            const option = document.createElement('option');
            option.value = c.caseNumber;
            option.textContent = `${c.caseNumber} - ${c.primaryPetitioner}`;
            caseSelect.appendChild(option);
        });
    }
    
    if (assigneeSelect) {
        assigneeSelect.innerHTML = '';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.username} (${user.role})`;
            assigneeSelect.appendChild(option);
        });
    }
}

function saveTask() {
    const form = document.getElementById('addTaskForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const taskId = document.getElementById('taskId').value;
    const isEdit = !!taskId;
    
    const assignees = Array.from(document.getElementById('taskAssignees').selectedOptions).map(option => parseInt(option.value));
    
    const taskData = {
        id: isEdit ? parseInt(taskId) : Date.now(),
        title: document.getElementById('taskTitle').value,
        caseNumber: document.getElementById('taskCaseNumber').value,
        assignees: assignees,
        dueDate: document.getElementById('taskDueDate').value,
        status: document.getElementById('taskStatus').value,
        description: document.getElementById('taskDescription').value,
        comments: []
    };
    
    if (isEdit) {
        const index = tasks.findIndex(t => t.id == taskId);
        if (index !== -1) {
            tasks[index] = taskData;
        }
    } else {
        tasks.push(taskData);
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
    modal.hide();
    
    // Reset form
    form.reset();
    
    // Refresh table
    renderTasksTable();
    updateStats();
    
    showNotification(isEdit ? 'Task updated successfully!' : 'Task added successfully!', 'success');
}

// User Management
function loadUsersPage() {
    if (currentUser.role !== 'admin') {
        navigateToPage('dashboard');
        return;
    }
    
    renderUsersTable();
}

function renderUsersTable() {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar me-3">${user.username.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="fw-bold">${user.username}</div>
                        <small class="text-muted">ID: ${user.id}</small>
                    </div>
                </div>
            </td>
            <td><span class="role-badge role-${user.role}">${user.role.replace('_', ' ').toUpperCase()}</span></td>
            <td>${user.email}</td>
            <td>${user.phone || '-'}</td>
            <td><span class="badge bg-success">Active</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-user-btn" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                ${user.id !== currentUser.id ? `<button class="btn btn-sm btn-outline-danger delete-user-btn" data-id="${user.id}"><i class="fas fa-trash"></i></button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function saveUser() {
    const form = document.getElementById('addUserForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const userId = document.getElementById('userId').value;
    const isEdit = !!userId;
    
    const userData = {
        id: isEdit ? parseInt(userId) : Date.now(),
        username: document.getElementById('userUsername').value,
        password: document.getElementById('userPassword').value,
        role: document.getElementById('userRole').value,
        email: document.getElementById('userEmail').value,
        phone: document.getElementById('userPhone').value
    };
    
    // Check for duplicate username
    const existingUser = users.find(u => u.username === userData.username && u.id !== userData.id);
    if (existingUser) {
        showNotification('Username already exists!', 'error');
        return;
    }
    
    if (isEdit) {
        const index = users.findIndex(u => u.id == userId);
        if (index !== -1) {
            users[index] = userData;
        }
    } else {
        users.push(userData);
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    modal.hide();
    
    // Reset form
    form.reset();
    
    // Refresh table
    renderUsersTable();
    updateStats();
    
    // Update dropdowns
    populateUserDropdowns();
    
    showNotification(isEdit ? 'User updated successfully!' : 'User added successfully!', 'success');
}

function editUser(userId) {
    const user = users.find(u => u.id == userId);
    if (!user) return;
    
    document.getElementById('userId').value = user.id;
    document.getElementById('userUsername').value = user.username;
    document.getElementById('userPassword').value = user.password;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPhone').value = user.phone || '';
    
    document.getElementById('addUserModalTitle').textContent = 'Edit User';
    
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
    modal.show();
}

function deleteUser(userId) {
    if (userId == currentUser.id) {
        showNotification('You cannot delete your own account!', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
        const index = users.findIndex(u => u.id == userId);
        if (index !== -1) {
            users.splice(index, 1);
            renderUsersTable();
            updateStats();
            populateUserDropdowns();
            showNotification('User deleted successfully!', 'success');
        }
    }
}

function updateProfile() {
    const form = document.getElementById('profileForm');
    
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    const password = document.getElementById('profilePassword').value;
    
    // Update current user
    currentUser.email = email;
    currentUser.phone = phone;
    if (password) {
        currentUser.password = password;
    }
    
    // Update in users array
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
        users[index] = currentUser;
    }
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    modal.hide();
    
    showNotification('Profile updated successfully!', 'success');
}

// Reports Page
function loadReportsPage() {
    updateStats();
    renderReportCasesTable();
    renderReportCharts();
}

function renderReportCasesTable() {
    const tbody = document.querySelector('#reportCasesTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    cases.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="#" class="text-decoration-none case-detail-link" data-id="${c.id}">${c.caseNumber}</a></td>
            <td>${c.srNumber || '-'}</td>
            <td>${c.primaryPetitioner}</td>
            <td>${c.primaryRespondent}</td>
            <td>${formatDate(c.filingDate)}</td>
            <td><span class="case-status status-${c.status}">${c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span></td>
            <td>${c.category || '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderReportCharts() {
    // Enhanced charts for reports
    renderCaseTrendsChart();
    renderCaseCategoriesChart();
}

function renderCaseTrendsChart() {
    const ctx = document.getElementById('caseTrendsChart');
    if (!ctx) return;
    
    // Monthly case trends
    const monthlyData = cases.reduce((acc, c) => {
        const month = new Date(c.filingDate).toISOString().slice(0, 7); // YYYY-MM
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});
    
    const labels = Object.keys(monthlyData).sort();
    const data = labels.map(month => monthlyData[month]);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(label => new Date(label + '-01').toLocaleDateString()),
            datasets: [{
                label: 'Cases Filed',
                data: data,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderCaseCategoriesChart() {
    const ctx = document.getElementById('caseCategoriesChart');
    if (!ctx) return;
    
    const categoryData = cases.reduce((acc, c) => {
        const category = c.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Export Functions
function exportCasesPDF() {
    if (typeof jsPDF === 'undefined') {
        showNotification('PDF library not loaded', 'error');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Cases Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    
    let yPosition = 50;
    
    cases.forEach((c, index) => {
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.text(`${index + 1}. ${c.caseNumber}`, 20, yPosition);
        doc.text(`   Petitioner: ${c.primaryPetitioner}`, 25, yPosition + 10);
        doc.text(`   Respondent: ${c.primaryRespondent}`, 25, yPosition + 20);
        doc.text(`   Filing Date: ${formatDate(c.filingDate)}`, 25, yPosition + 30);
        doc.text(`   Status: ${c.status}`, 25, yPosition + 40);
        
        yPosition += 55;
    });
    
    doc.save('cases-report.pdf');
    showNotification('PDF exported successfully!', 'success');
}

function exportCasesCSV() {
    const headers = ['Case Number', 'SR Number', 'Petitioner', 'Respondent', 'Filing Date', 'Status', 'Category'];
    const csvData = [headers];
    
    cases.forEach(c => {
        csvData.push([
            c.caseNumber,
            c.srNumber || '',
            c.primaryPetitioner,
            c.primaryRespondent,
            c.filingDate,
            c.status,
            c.category || ''
        ]);
    });
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'cases-export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    showNotification('CSV exported successfully!', 'success');
}

function downloadCasePDF() {
    const caseId = document.getElementById('editCaseFromModalBtn').dataset.id;
    const caseData = cases.find(c => c.id == caseId);
    
    if (!caseData) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Case details PDF generation
    doc.setFontSize(16);
    doc.text(`Case Details: ${caseData.caseNumber}`, 20, 20);
    
    let yPos = 40;
    const addLine = (text) => {
        doc.text(text, 20, yPos);
        yPos += 10;
    };
    
    doc.setFontSize(12);
    addLine(`SR Number: ${caseData.srNumber || '-'}`);
    addLine(`CNR: ${caseData.cnr || '-'}`);
    addLine(`Primary Petitioner: ${caseData.primaryPetitioner}`);
    addLine(`Primary Respondent: ${caseData.primaryRespondent}`);
    addLine(`Filing Date: ${formatDate(caseData.filingDate)}`);
    addLine(`Status: ${caseData.status}`);
    addLine(`Category: ${caseData.category || '-'}`);
    
    if (caseData.prayer) {
        yPos += 10;
        doc.text('Prayer:', 20, yPos);
        yPos += 10;
        const prayerLines = doc.splitTextToSize(caseData.prayer, 170);
        doc.text(prayerLines, 20, yPos);
    }
    
    doc.save(`case-${caseData.caseNumber.replace(/\s+/g, '-')}.pdf`);
    showNotification('Case PDF downloaded!', 'success');
}

// GitHub Sync Functions
function loadExportsPage() {
    // Load GitHub settings if available
    loadGitHubSettings();
}

function loadGitHubSettings() {
    const settings = localStorage.getItem('githubSettings');
    if (settings) {
        const parsed = JSON.parse(settings);
        document.getElementById('githubToken').value = parsed.token || '';
        document.getElementById('githubRepo').value = parsed.repo || '';
        document.getElementById('githubBranch').value = parsed.branch || 'main';
    }
}

function saveGitHubSettings() {
    const settings = {
        token: document.getElementById('githubToken').value,
        repo: document.getElementById('githubRepo').value,
        branch: document.getElementById('githubBranch').value
    };
    
    localStorage.setItem('githubSettings', JSON.stringify(settings));
    showNotification('GitHub settings saved!', 'success');
}

function syncToGitHub() {
    const settings = localStorage.getItem('githubSettings');
    if (!settings) {
        showNotification('Please configure GitHub settings first', 'error');
        return;
    }
    
    const { token, repo, branch } = JSON.parse(settings);
    
    if (!token || !repo) {
        showNotification('GitHub token and repository are required', 'error');
        return;
    }
    
    const data = {
        cases: cases,
        users: users.map(u => ({ ...u, password: '[HIDDEN]' })), // Don't sync passwords
        tasks: tasks,
        invoices: invoices,
        lastSync: new Date().toISOString()
    };
    
    // Simulated GitHub sync (in real app, use GitHub API)
    setTimeout(() => {
        console.log('Syncing to GitHub:', { repo, branch, dataLength: JSON.stringify(data).length });
        showNotification('Data synced to GitHub successfully!', 'success');
    }, 1000);
}

// Filters
function setupFilters() {
    setupCaseFilters();
}

function setupCaseFilters() {
    const searchInput = document.getElementById('caseSearch');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const clearButton = document.getElementById('clearFilters');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterCases);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterCases);
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', filterCases);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (statusFilter) statusFilter.value = '';
            if (dateFilter) dateFilter.value = '';
            filterCases();
        });
    }
}

function filterCases() {
    const searchTerm = document.getElementById('caseSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    
    const tbody = document.querySelector('#casesTable tbody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 0) return;
        
        const caseNumber = cells[0]?.textContent.toLowerCase() || '';
        const petitioner = cells[2]?.textContent.toLowerCase() || '';
        const respondent = cells[3]?.textContent.toLowerCase() || '';
        const status = cells[5]?.querySelector('.case-status')?.textContent.toLowerCase() || '';
        const filingDate = cells[4]?.textContent || '';
        
        const matchesSearch = !searchTerm || 
            caseNumber.includes(searchTerm) || 
            petitioner.includes(searchTerm) || 
            respondent.includes(searchTerm);
            
        const matchesStatus = !statusFilter || status.includes(statusFilter.toLowerCase());
        
        const matchesDate = !dateFilter || filingDate.includes(dateFilter);
        
        if (matchesSearch && matchesStatus && matchesDate) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function isToday(date) {
    const today = currentDateTime;
    return date.toDateString() === today.toDateString();
}

function isTomorrow(date) {
    const tomorrow = new Date(currentDateTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
}

function isPastDate(date) {
    return date < currentDateTime;
}

function updateDateTime() {
    const now = currentDateTime; // Use fixed date for demo
    const elements = document.querySelectorAll('#currentDateTime');
    elements.forEach(el => {
        el.textContent = now.toLocaleString('en-GB');
    });
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    
    // Reset classes
    notification.className = 'notification';
    
    // Add type class
    if (type !== 'success') {
        notification.classList.add(type);
    }
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function handleLogout() {
    currentUser = null;
    isAuthenticated = false;
    localStorage.removeItem('currentUser');
    showLoginScreen();
    showNotification('Logged out successfully', 'success');
}

// URL manipulation protection
window.addEventListener('load', function() {
    // Prevent direct access to files without authentication
    if (!localStorage.getItem('currentUser')) {
        const protectedPaths = ['/uploads/', '/documents/', '/files/'];
        const currentPath = window.location.pathname;
        
        if (protectedPaths.some(path => currentPath.includes(path))) {
            window.location.href = 'login.html';
        }
    }
});

// Profile modal population
document.addEventListener('show.bs.modal', function(e) {
    if (e.target.id === 'profileModal' && currentUser) {
        document.getElementById('profileUsername').textContent = currentUser.username;
        document.getElementById('profileRole').textContent = currentUser.role.replace('_', ' ').toUpperCase();
        document.getElementById('profileEmail').value = currentUser.email || '';
        document.getElementById('profilePhone').value = currentUser.phone || '';
        document.getElementById('profileAvatar').textContent = currentUser.username.charAt(0).toUpperCase();
        document.getElementById('profilePassword').value = '';
    }
});
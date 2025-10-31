// Enhanced Case Management System - Main JavaScript File with GitHub Integration
let currentUser = null;
let currentPage = 'dashboard';
let githubSync = null;

// Authentication check
let isAuthenticated = false;

// Data arrays
let users = [];
let cases = [];
let tasks = [];
let notifications = [];
let invoices = [];
let officeFiles = [];
let reminders = [];
let messages = [];

// Current date for reference
const currentDateTime = new Date('2025-09-17T20:41:21');

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
    // Load modals
    await loadModals();
    
    try {
        // Initialize GitHub sync
        if (window.GitHubSync) {
            githubSync = new window.GitHubSync();
        }

        // Check if user is logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            isAuthenticated = true;
            
            // Initialize data with GitHub sync
            await initializeData();
            
            showMainApplication();
            navigateToPage('dashboard');
            
            // Update sync status indicator
            updateSyncStatusIndicator();
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
        const modalHtml = `
            <!-- Add/Edit Case Modal -->
            <div class="modal fade" id="addCaseModal" tabindex="-1" aria-labelledby="addCaseModalTitle" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addCaseModalTitle">Add New Case</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addCaseForm">
                                <input type="hidden" id="caseId">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6 class="section-title">Basic Information</h6>
                                        <div class="mb-3">
                                            <label class="form-label">Main Number *</label>
                                            <input type="text" class="form-control" id="caseNumber" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">SR Number</label>
                                            <input type="text" class="form-control" id="srNumber">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">CNR No.</label>
                                            <input type="text" class="form-control" id="cnr">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Case Status</label>
                                            <select class="form-control" id="status">
                                                <option value="pending">Pending</option>
                                                <option value="open">Open</option>
                                                <option value="closed">Closed</option>
                                                <option value="disposed">Disposed</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="section-title">Party Information</h6>
                                        <div class="mb-3">
                                            <label class="form-label">Primary Petitioner</label>
                                            <input type="text" class="form-control" id="primaryPetitioner">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Primary Respondent</label>
                                            <input type="text" class="form-control" id="primaryRespondent">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Petitioner Advocate</label>
                                            <input type="text" class="form-control" id="petitionerAdv">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Respondent Advocate</label>
                                            <input type="text" class="form-control" id="respondentAdv">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6 class="section-title">Case Details</h6>
                                        <div class="mb-3">
                                            <label class="form-label">Case Category</label>
                                            <input type="text" class="form-control" id="category">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Sub Category</label>
                                            <input type="text" class="form-control" id="subCategory">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Sub Sub Category</label>
                                            <input type="text" class="form-control" id="subSubCategory">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">District</label>
                                            <input type="text" class="form-control" id="district">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Purpose</label>
                                            <input type="text" class="form-control" id="purpose">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Hon'ble Judges</label>
                                            <input type="text" class="form-control" id="judName">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="section-title">Important Dates</h6>
                                        <div class="mb-3">
                                            <label class="form-label">Filing Date</label>
                                            <input type="date" class="form-control" id="filingDate">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Registration Date</label>
                                            <input type="date" class="form-control" id="registrationDate">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Listing Date</label>
                                            <input type="date" class="form-control" id="listingDate">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Disposal Date</label>
                                            <input type="date" class="form-control" id="dispDate">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Disposal Type</label>
                                            <input type="text" class="form-control" id="dispType">
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Prayer</label>
                                    <textarea class="form-control" id="prayer" rows="3"></textarea>
                                </div>
                                
                                <!-- Dynamic Sections -->
                                <h6 class="section-title">Petitioners</h6>
                                <div id="petitionersContainer"></div>
                                <button type="button" id="addPetitioner" class="btn btn-sm btn-outline-primary mb-3">Add Petitioner</button>
                                
                                <h6 class="section-title">Respondents</h6>
                                <div id="respondentsContainer"></div>
                                <button type="button" id="addRespondent" class="btn btn-sm btn-outline-primary mb-3">Add Respondent</button>
                                
                                <h6 class="section-title">IA Details</h6>
                                <div id="iaDetailsContainer"></div>
                                <button type="button" id="addIaDetail" class="btn btn-sm btn-outline-primary mb-3">Add IA Detail</button>
                                
                                <h6 class="section-title">IA SR Details</h6>
                                <div id="iaSrDetailsContainer"></div>
                                <button type="button" id="addIaSrDetail" class="btn btn-sm btn-outline-primary mb-3">Add IA SR Detail</button>
                                
                                <h6 class="section-title">USR Details</h6>
                                <div id="usrDetailsContainer"></div>
                                <button type="button" id="addUsrDetail" class="btn btn-sm btn-outline-primary mb-3">Add USR Detail</button>
                                
                                <h6 class="section-title">Connected Matters</h6>
                                <div id="connectedMattersContainer"></div>
                                <button type="button" id="addConnectedMatter" class="btn btn-sm btn-outline-primary mb-3">Add Connected Matter</button>
                                
                                <h6 class="section-title">Vakalath</h6>
                                <div id="vakalathContainer"></div>
                                <button type="button" id="addVakalath" class="btn btn-sm btn-outline-primary mb-3">Add Vakalath</button>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6 class="section-title">Lower Court Details</h6>
                                        <div class="mb-3">
                                            <label class="form-label">Court Name</label>
                                            <input type="text" class="form-control" id="lcCourt">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">District</label>
                                            <input type="text" class="form-control" id="lcDist">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Lower Court Case No.</label>
                                            <input type="text" class="form-control" id="lcCaseNo">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Hon'ble Judge</label>
                                            <input type="text" class="form-control" id="lcJudge">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Date of Judgement</label>
                                            <input type="date" class="form-control" id="lcJudgeDate">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="section-title">Documents</h6>
                                        <div class="mb-3">
                                            <label class="form-label">Disposal Order File</label>
                                            <input type="file" class="form-control" id="disposalOrderFile" accept=".pdf">
                                            <div id="existingDisposalFile"></div>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Other Documents</label>
                                            <input type="file" class="form-control" id="otherDocuments" accept=".pdf" multiple>
                                            <div id="existingOtherDocs"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <h6 class="section-title">Orders</h6>
                                <div id="ordersContainer"></div>
                                <button type="button" id="addOrder" class="btn btn-sm btn-outline-primary mb-3">Add Order</button>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveCaseBtn">Save Case</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Case Details Modal -->
            <div class="modal fade" id="caseDetailsModal" tabindex="-1" aria-labelledby="caseDetailsModalTitle" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="caseDetailsModalTitle">Case Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="caseDetailsContent">
                            <!-- Content populated by JavaScript -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="editCaseFromModalBtn">Edit Case</button>
                            <button type="button" class="btn btn-success" id="downloadCasePdfBtn">Download PDF</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add Task Modal -->
            <div class="modal fade" id="addTaskModal" tabindex="-1" aria-labelledby="addTaskModalTitle" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addTaskModalTitle">Add New Task</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addTaskForm">
                                <input type="hidden" id="taskId">
                                <div class="mb-3">
                                    <label class="form-label">Task Title *</label>
                                    <input type="text" class="form-control" id="taskTitle" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Case Number</label>
                                    <select class="form-control" id="taskCaseNumber">
                                        <option value="">Select Case</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Assignees</label>
                                    <select class="form-control" id="taskAssignees" multiple>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Due Date</label>
                                    <input type="date" class="form-control" id="taskDueDate">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Status</label>
                                    <select class="form-control" id="taskStatus">
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-control" id="taskDescription" rows="3"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveTaskBtn">Save Task</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add User Modal -->
            <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalTitle" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addUserModalTitle">Add New User</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addUserForm">
                                <input type="hidden" id="userId">
                                <div class="mb-3">
                                    <label class="form-label">Username *</label>
                                    <input type="text" class="form-control" id="userUsername" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Password *</label>
                                    <input type="password" class="form-control" id="userPassword" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Role</label>
                                    <select class="form-control" id="userRole">
                                        <option value="viewer">Viewer</option>
                                        <option value="restricted_admin">Restricted Admin</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Email *</label>
                                    <input type="email" class="form-control" id="userEmail" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Phone</label>
                                    <input type="tel" class="form-control" id="userPhone">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveUserBtn">Save User</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add Invoice Modal -->
            <div class="modal fade" id="addInvoiceModal" tabindex="-1" aria-labelledby="addInvoiceModalTitle" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addInvoiceModalTitle">Add Invoice Request</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addInvoiceForm">
                                <input type="hidden" id="invoiceId">
                                <div class="mb-3">
                                    <label class="form-label">Invoice Type *</label>
                                    <select class="form-control" id="invoiceType" required>
                                        <option value="">Select Type</option>
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Description *</label>
                                    <input type="text" class="form-control" id="invoiceDescription" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Amount (₹) *</label>
                                    <input type="number" class="form-control" id="invoiceAmount" step="0.01" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Date *</label>
                                    <input type="date" class="form-control" id="invoiceDate" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Related Case</label>
                                    <select class="form-control" id="invoiceCaseNumber">
                                        <option value="">Select Case (Optional)</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Supporting Documents</label>
                                    <input type="file" class="form-control" id="invoiceDocuments" accept=".pdf,.jpg,.jpeg,.png" multiple>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Notes</label>
                                    <textarea class="form-control" id="invoiceNotes" rows="3"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveInvoiceBtn">Save Invoice</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Upload File Modal -->
            <div class="modal fade" id="uploadFileModal" tabindex="-1" aria-labelledby="uploadFileModalTitle" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="uploadFileModalTitle">Upload Office Copy</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="uploadFileForm">
                                <div class="mb-3">
                                    <label class="form-label">Select File *</label>
                                    <input type="file" class="form-control" id="fileUpload" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-control" id="fileDescription" rows="3" placeholder="Enter file description..."></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="uploadFileSubmitBtn">Upload File</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profile Modal -->
            <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalTitle" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="profileModalTitle">User Profile</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center mb-4">
                                <div class="user-avatar" id="profileAvatar" style="margin: 0 auto;">A</div>
                                <h5 id="profileUsername" class="mt-2">Username</h5>
                                <span id="profileRole" class="badge bg-primary">Role</span>
                            </div>
                            <form id="profileForm">
                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" id="profileEmail">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Phone</label>
                                    <input type="tel" class="form-control" id="profilePhone">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">New Password (leave blank to keep current)</label>
                                    <input type="password" class="form-control" id="profilePassword">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveProfileBtn">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Compose Message Modal -->
            <div class="modal fade" id="composeMessageModal" tabindex="-1" aria-labelledby="composeMessageModalTitle" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="composeMessageModalTitle">Compose Message</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="composeMessageForm">
                                <div class="mb-3">
                                    <label class="form-label">Message Type</label>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="messageType" id="emailType" value="email" checked>
                                        <label class="form-check-label" for="emailType">Email</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="messageType" id="smsType" value="sms">
                                        <label class="form-check-label" for="smsType">SMS</label>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Recipients</label>
                                    <select class="form-control" id="messageRecipients" multiple>
                                    </select>
                                </div>
                                <div class="mb-3" id="emailSubjectDiv">
                                    <label class="form-label">Subject</label>
                                    <input type="text" class="form-control" id="messageSubject">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Message</label>
                                    <textarea class="form-control" id="messageContent" rows="5"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="sendMessageBtn">Send Message</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reminder Settings Modal -->
            <div class="modal fade" id="reminderSettingsModal" tabindex="-1" aria-labelledby="reminderSettingsModalTitle" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="reminderSettingsModalTitle">Reminder Settings</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="reminderSettingsForm">
                                <div class="mb-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="enableEmailReminders" checked>
                                        <label class="form-check-label" for="enableEmailReminders">
                                            Enable Email Reminders
                                        </label>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="enableSmsReminders">
                                        <label class="form-check-label" for="enableSmsReminders">
                                            Enable SMS Reminders
                                        </label>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Days before deadline to send reminder</label>
                                    <input type="number" class="form-control" id="reminderDays" value="3" min="1" max="30">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveReminderSettingsBtn">Save Settings</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    } catch (error) {
        console.warn('Could not load modals:', error);
    }
}

// Data initialization with GitHub sync
async function initializeData() {
    try {
        if (githubSync) {
            // Try to load data from GitHub
            const data = await githubSync.loadData();
            
            // Populate arrays with loaded data
            users = data.users || [];
            cases = data.cases || [];
            tasks = data.tasks || [];
            invoices = data.invoices || [];
            officeFiles = data.officeFiles || [];
            notifications = data.notifications || [];
            reminders = data.reminders || [];
            messages = data.messages || [];
            
            // If no users exist, create ephemeral admin user (in memory only, not persisted)
            if (users.length === 0) {
                users = [
                    { id: 1, username: 'admin', password: 'Admin123!', role: 'admin', email: 'admin@example.com', phone: '+1234567890' }
                ];
            }
            
            showNotification(`Data loaded successfully ${githubSync.isConfigured ? 'from GitHub' : 'from local storage'}`, 'success');
        } else {
            // Fallback to default data
            users = [
                { id: 1, username: 'admin', password: 'Admin123!', role: 'admin', email: 'admin@example.com', phone: '+1234567890' },
                { id: 2, username: 'manager', password: 'Manager123!', role: 'restricted_admin', email: 'manager@example.com', phone: '+1234567891' },
                { id: 3, username: 'viewer', password: 'Viewer123!', role: 'viewer', email: 'viewer@example.com', phone: '+1234567892' }
            ];
            
            cases = [
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
                }
            ];
            
            tasks = [
                { id: 1, title: 'Review case documents', caseNumber: 'CRLP 13925/2024', assignees: [1], dueDate: '2023-10-15', status: 'open', description: 'Review all documents for the upcoming hearing', comments: [] },
                { id: 2, title: 'Prepare hearing notes', caseNumber: 'CRLP 13925/2024', assignees: [2], dueDate: '2023-10-10', status: 'in-progress', description: 'Prepare detailed notes for the hearing', comments: [] },
                { id: 3, title: 'File motion to dismiss', caseNumber: 'CRLP 13925/2024', assignees: [3], dueDate: '2023-10-05', status: 'completed', description: 'File a motion to dismiss the case', comments: [] }
            ];
            
            invoices = [
                {
                    id: 1,
                    date: '2025-09-10',
                    type: 'income',
                    description: 'Legal consultation fees',
                    amount: 25000,
                    status: 'approved',
                    requestedBy: 1,
                    approvedBy: 1,
                    caseNumber: 'CRLP 13925/2024'
                }
            ];
            
            officeFiles = [
                {
                    id: 1,
                    fileName: 'Sample Document.pdf',
                    fileSize: '2.5 MB',
                    uploadDate: '2025-09-14',
                    uploadedBy: 2,
                    filePath: '/uploads/sample-document.pdf',
                    description: 'Sample legal document'
                }
            ];
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Error loading data, using defaults', 'warning');
    }
}

// Save all data to GitHub
async function saveAllData() {
    if (!githubSync) {
        console.warn('GitHub sync not available');
        return;
    }
    
    try {
        const allData = {
            users,
            cases,
            tasks,
            invoices,
            officeFiles,
            notifications,
            reminders,
            messages
        };
        
        const result = await githubSync.saveData(allData);
        updateSyncStatusIndicator();
        updateLastSyncInfo();
        
        if (result.mode === 'github') {
            console.log('Data synced to GitHub successfully');
        } else {
            console.log('Data saved to localStorage (GitHub sync failed)');
        }
        
        return result;
    } catch (error) {
        console.error('Failed to save data:', error);
        throw error;
    }
}

// Update sync status indicators
function updateSyncStatusIndicator() {
    const indicator = document.getElementById('syncStatusIndicator');
    const githubStatus = document.getElementById('githubSyncStatus');
    
    if (!githubSync) return;
    
    const status = githubSync.getSyncStatus();
    
    if (indicator) {
        if (status.configured) {
            indicator.className = 'sync-status connected';
            indicator.innerHTML = '<i class="fas fa-cloud-check"></i>';
        } else {
            indicator.className = 'sync-status disconnected';
            indicator.innerHTML = '<i class="fas fa-cloud-slash"></i>';
        }
    }
    
    if (githubStatus) {
        if (status.configured) {
            githubStatus.className = 'sync-status connected';
            githubStatus.innerHTML = '<i class="fas fa-cloud-check"></i>Connected';
        } else {
            githubStatus.className = 'sync-status disconnected';
            githubStatus.innerHTML = '<i class="fas fa-cloud-slash"></i>Not Connected';
        }
    }
}

// Update last sync info
function updateLastSyncInfo() {
    const lastSyncEl = document.getElementById('lastSyncInfo');
    if (!lastSyncEl || !githubSync) return;
    
    const status = githubSync.getSyncStatus();
    if (status.lastSync) {
        const date = new Date(status.lastSync);
        lastSyncEl.textContent = `Last sync: ${date.toLocaleString()}`;
    } else {
        lastSyncEl.textContent = 'Last sync: Never';
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
        
        if (e.target.id === 'editCaseFromModalBtn') {
            const caseId = e.target.dataset.id;
            const modal = bootstrap.Modal.getInstance(document.getElementById('caseDetailsModal'));
            modal.hide();
            editCase(caseId);
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
        
        if (e.target.classList.contains('edit-task-btn')) {
            editTask(e.target.dataset.id);
        }
        
        if (e.target.classList.contains('delete-task-btn')) {
            deleteTask(e.target.dataset.id);
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
        if (e.target.id === 'testGhConnection') {
            testGitHubConnection();
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
                <button class="btn btn-sm btn-outline-primary view-case-btn" data-id="${c.id}"><i class="fas fa-eye"></i></button>
                ${currentUser.role !== 'viewer' ? `<button class="btn btn-sm btn-outline-warning edit-case-btn" data-id="${c.id}"><i class="fas fa-edit"></i></button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderCharts() {
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
            labels: Object.keys(statusCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
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
                label: 'Cases Filed',
                data: Object.values(yearCounts),
                backgroundColor: '#36A2EB'
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
            labels: Object.keys(statusCounts).map(s => s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#FF6384', '#FFCE56', '#4BC0C0']
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
    populateCaseDropdowns();
}

function renderCasesTable() {
    const tbody = document.querySelector('#casesTable tbody');
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
            <td>
                <button class="btn btn-sm btn-outline-info"><i class="fas fa-bell"></i></button>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary view-case-btn" data-id="${c.id}"><i class="fas fa-eye"></i></button>
                ${currentUser.role !== 'viewer' ? `
                    <button class="btn btn-sm btn-outline-warning edit-case-btn" data-id="${c.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger delete-case-btn" data-id="${c.id}"><i class="fas fa-trash"></i></button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function populateCaseDropdowns() {
    // Populate task modal dropdown
    const taskCaseSelect = document.getElementById('taskCaseNumber');
    if (taskCaseSelect) {
        taskCaseSelect.innerHTML = '<option value="">Select Case</option>';
        cases.forEach(c => {
            const option = document.createElement('option');
            option.value = c.caseNumber;
            option.textContent = `${c.caseNumber} - ${c.primaryPetitioner}`;
            taskCaseSelect.appendChild(option);
        });
    }
}

// Save case with file upload and GitHub sync
async function saveCase() {
    const form = document.getElementById('addCaseForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    try {
        const caseId = document.getElementById('caseId').value;
        const isEdit = !!caseId;
        
        // Collect basic case data
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
            
            // Collect dynamic sections
            petitioners: collectDynamicSectionData('petitionersContainer', ['sno', 'name', 'address']),
            respondents: collectDynamicSectionData('respondentsContainer', ['rno', 'name', 'address']),
            iaDetails: collectDynamicSectionData('iaDetailsContainer', ['iaNumber', 'filingDate', 'advName', 'paperType', 'status', 'prayer']),
            iaSrDetails: collectDynamicSectionData('iaSrDetailsContainer', ['iaSrNumber', 'filingDate', 'advName', 'type', 'status']),
            usrDetails: collectDynamicSectionData('usrDetailsContainer', ['usrNumber', 'advName', 'type', 'filingDate', 'remarks']),
            connectedMatters: collectDynamicSectionData('connectedMattersContainer', ['matterNumber', 'connectionType', 'description']),
            vakalath: collectDynamicSectionData('vakalathContainer', ['advocateName', 'filingDate', 'status']),
            orders: collectDynamicSectionData('ordersContainer', ['orderOn', 'judgeName', 'dateOfOrders', 'orderType', 'orderDetails']),
            
            // Lower court details
            lowerCourtDetails: {
                court: document.getElementById('lcCourt').value,
                district: document.getElementById('lcDist').value,
                caseNo: document.getElementById('lcCaseNo').value,
                judge: document.getElementById('lcJudge').value,
                judgeDate: document.getElementById('lcJudgeDate').value
            },
            
            otherDocuments: [],
            disposalOrderUrl: ''
        };
        
        // Handle file uploads to GitHub
        if (githubSync && githubSync.isConfigured) {
            // Handle disposal order file
            const disposalFile = document.getElementById('disposalOrderFile').files[0];
            if (disposalFile) {
                try {
                    const uploadResult = await githubSync.uploadFileAndGetUrl(disposalFile, 'documents/disposal-orders');
                    caseData.disposalOrderUrl = uploadResult.url;
                    showNotification('Disposal order uploaded successfully', 'success');
                } catch (error) {
                    console.error('Failed to upload disposal order:', error);
                    showNotification('Failed to upload disposal order', 'warning');
                }
            }
            
            // Handle other documents
            const otherFiles = document.getElementById('otherDocuments').files;
            if (otherFiles.length > 0) {
                const uploadPromises = Array.from(otherFiles).map(async (file) => {
                    try {
                        const result = await githubSync.uploadFileAndGetUrl(file, 'documents/case-files');
                        return {
                            name: file.name,
                            url: result.url,
                            uploadDate: new Date().toISOString()
                        };
                    } catch (error) {
                        console.error(`Failed to upload ${file.name}:`, error);
                        return null;
                    }
                });
                
                const uploadResults = await Promise.all(uploadPromises);
                caseData.otherDocuments = uploadResults.filter(result => result !== null);
                
                if (caseData.otherDocuments.length > 0) {
                    showNotification(`${caseData.otherDocuments.length} documents uploaded successfully`, 'success');
                }
            }
        }
        
        // Save case data
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
        
        // Reset form
        form.reset();
        clearDynamicSections();
        
        // Refresh displays
        renderCasesTable();
        renderRecentCasesTable();
        updateStats();
        populateCaseDropdowns();
        
        // Sync to GitHub
        await saveAllData();
        
        showNotification(isEdit ? 'Case updated successfully!' : 'Case added successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving case:', error);
        showNotification('Error saving case', 'error');
    }
}

// Collect data from dynamic form sections
function collectDynamicSectionData(containerId, fields) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    
    const sections = container.querySelectorAll('.dynamic-section');
    const data = [];
    
    sections.forEach(section => {
        const sectionData = {};
        fields.forEach(field => {
            const input = section.querySelector(`[name="${field}"]`);
            if (input) {
                sectionData[field] = input.value;
            }
        });
        if (Object.values(sectionData).some(val => val.trim() !== '')) {
            data.push(sectionData);
        }
    });
    
    return data;
}

// Clear dynamic sections
function clearDynamicSections() {
    const containers = [
        'petitionersContainer', 'respondentsContainer', 'iaDetailsContainer',
        'iaSrDetailsContainer', 'usrDetailsContainer', 'connectedMattersContainer',
        'vakalathContainer', 'ordersContainer'
    ];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
    });
}

// Edit case
function editCase(caseId) {
    const caseData = cases.find(c => c.id == caseId);
    if (!caseData) return;
    
    // Populate basic fields
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
    
    // Populate lower court details
    document.getElementById('lcCourt').value = caseData.lowerCourtDetails?.court || '';
    document.getElementById('lcDist').value = caseData.lowerCourtDetails?.district || '';
    document.getElementById('lcCaseNo').value = caseData.lowerCourtDetails?.caseNo || '';
    document.getElementById('lcJudge').value = caseData.lowerCourtDetails?.judge || '';
    document.getElementById('lcJudgeDate').value = caseData.lowerCourtDetails?.judgeDate || '';
    
    // Clear and populate dynamic sections
    clearDynamicSections();
    
    if (caseData.petitioners) {
        caseData.petitioners.forEach(p => addPetitionerField(p));
    }
    
    if (caseData.respondents) {
        caseData.respondents.forEach(r => addRespondentField(r));
    }
    
    if (caseData.iaDetails) {
        caseData.iaDetails.forEach(ia => addIaDetailField(ia));
    }
    
    if (caseData.iaSrDetails) {
        caseData.iaSrDetails.forEach(sr => addIaSrDetailField(sr));
    }
    
    if (caseData.usrDetails) {
        caseData.usrDetails.forEach(usr => addUsrDetailField(usr));
    }
    
    if (caseData.connectedMatters) {
        caseData.connectedMatters.forEach(cm => addConnectedMatterField(cm));
    }
    
    if (caseData.vakalath) {
        caseData.vakalath.forEach(v => addVakalathField(v));
    }
    
    if (caseData.orders) {
        caseData.orders.forEach(o => addOrderField(o));
    }
    
    // Update modal title
    document.getElementById('addCaseModalTitle').textContent = 'Edit Case';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addCaseModal'));
    modal.show();
}

// Dynamic field functions
function addPetitionerField(data = {}) {
    const container = document.getElementById('petitionersContainer');
    
    const fieldHtml = `
        <div class="dynamic-section">
            <button type="button" class="btn btn-sm btn-outline-danger remove-btn remove-dynamic-field">×</button>
            <div class="row">
                <div class="col-md-2">
                    <label class="form-label">S.No</label>
                    <input type="number" class="form-control" name="sno" value="${data.sno || ''}">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" name="name" value="${data.name || ''}">
                </div>
                <div class="col-md-6">
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
    
    const fieldHtml = `
        <div class="dynamic-section">
            <button type="button" class="btn btn-sm btn-outline-danger remove-btn remove-dynamic-field">×</button>
            <div class="row">
                <div class="col-md-2">
                    <label class="form-label">R.No</label>
                    <input type="number" class="form-control" name="rno" value="${data.rno || ''}">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" name="name" value="${data.name || ''}">
                </div>
                <div class="col-md-6">
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
                    <label class="form-label">Prayer</label>
                    <textarea class="form-control" name="prayer" rows="3">${data.prayer || ''}</textarea>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Status</label>
                    <input type="text" class="form-control" name="status" value="${data.status || ''}">
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
                    <table class="minimalistBlack">
                        <tr class="thstyle"><th>Case Number</th><td class="tdstyle">${caseData.caseNumber || '-'}</td></tr>
                        <tr class="thstyle"><th>SR Number</th><td class="tdstyle">${caseData.srNumber || '-'}</td></tr>
                        <tr class="thstyle"><th>CNR</th><td class="tdstyle">${caseData.cnr || '-'}</td></tr>
                        <tr class="thstyle"><th>Status</th><td class="tdstyle"><span class="case-status status-${caseData.status}">${caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}</span></td></tr>
                        <tr class="thstyle"><th>Category</th><td class="tdstyle">${caseData.category || '-'}</td></tr>
                        <tr class="thstyle"><th>Sub Category</th><td class="tdstyle">${caseData.subCategory || '-'}</td></tr>
                        <tr class="thstyle"><th>Sub Sub Category</th><td class="tdstyle">${caseData.subSubCategory || '-'}</td></tr>
                        <tr class="thstyle"><th>District</th><td class="tdstyle">${caseData.district || '-'}</td></tr>
                        <tr class="thstyle"><th>Purpose</th><td class="tdstyle">${caseData.purpose || '-'}</td></tr>
                    </table>
                </div>
                
                <div class="case-section">
                    <h6 class="case-section-title">Party Information</h6>
                    <table class="minimalistBlack">
                        <tr class="thstyle"><th>Primary Petitioner</th><td class="tdstyle">${caseData.primaryPetitioner || '-'}</td></tr>
                        <tr class="thstyle"><th>Primary Respondent</th><td class="tdstyle">${caseData.primaryRespondent || '-'}</td></tr>
                        <tr class="thstyle"><th>Petitioner Advocate</th><td class="tdstyle">${caseData.petitionerAdv || '-'}</td></tr>
                        <tr class="thstyle"><th>Respondent Advocate</th><td class="tdstyle">${caseData.respondentAdv || '-'}</td></tr>
                    </table>
                </div>
                
                <div class="case-section">
                    <h6 class="case-section-title">Important Dates</h6>
                    <table class="minimalistBlack">
                        <tr class="thstyle"><th>Filing Date</th><td class="tdstyle">${formatDate(caseData.filingDate) || '-'}</td></tr>
                        <tr class="thstyle"><th>Registration Date</th><td class="tdstyle">${formatDate(caseData.registrationDate) || '-'}</td></tr>
                        <tr class="thstyle"><th>Listing Date</th><td class="tdstyle">${formatDate(caseData.listingDate) || '-'}</td></tr>
                        <tr class="thstyle"><th>Disposal Date</th><td class="tdstyle">${formatDate(caseData.dispDate) || '-'}</td></tr>
                        <tr class="thstyle"><th>Disposal Type</th><td class="tdstyle">${caseData.dispType || '-'}</td></tr>
                        <tr class="thstyle"><th>Hon'ble Judge</th><td class="tdstyle">${caseData.judName || '-'}</td></tr>
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
            <table class="B2U-article">
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
            <table class="B2U-article">
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
            <table class="B2U-article">
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
            <table class="B2U-article">
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
            <table class="B2U-article">
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
            <table class="B2U-article">
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
            saveAllData();
        }
    }
}

// Tasks Page
function loadTasksPage() {
    renderTasksTable();
    populateTaskDropdowns();
}

function renderTasksTable() {
    const tbody = document.querySelector('#tasksTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    tasks.forEach(task => {
        const assigneeNames = task.assignees ? task.assignees.map(id => {
            const user = users.find(u => u.id === id);
            return user ? user.username : 'Unknown';
        }).join(', ') : 'Unassigned';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>T-${task.id}</td>
            <td>${task.title}</td>
            <td>${task.caseNumber || '-'}</td>
            <td>${assigneeNames}</td>
            <td>${formatDate(task.dueDate)}</td>
            <td><span class="task-status task-status-${task.status}">${task.status.replace('-', ' ').toUpperCase()}</span></td>
            <td>
                ${currentUser.role !== 'viewer' ? `
                    <button class="btn btn-sm btn-outline-warning edit-task-btn" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger delete-task-btn" data-id="${task.id}"><i class="fas fa-trash"></i></button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function populateTaskDropdowns() {
    // Populate assignees dropdown
    const assigneesSelect = document.getElementById('taskAssignees');
    if (assigneesSelect) {
        assigneesSelect.innerHTML = '';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.username} (${user.role})`;
            assigneesSelect.appendChild(option);
        });
    }
}

async function saveTask() {
    const form = document.getElementById('addTaskForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const taskId = document.getElementById('taskId').value;
    const isEdit = !!taskId;
    
    const assigneesSelect = document.getElementById('taskAssignees');
    const selectedAssignees = Array.from(assigneesSelect.selectedOptions).map(option => parseInt(option.value));
    
    const taskData = {
        id: isEdit ? parseInt(taskId) : Date.now(),
        title: document.getElementById('taskTitle').value,
        caseNumber: document.getElementById('taskCaseNumber').value,
        assignees: selectedAssignees,
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
    
    // Refresh displays
    renderTasksTable();
    updateStats();
    
    // Sync to GitHub
    await saveAllData();
    
    showNotification(isEdit ? 'Task updated successfully!' : 'Task added successfully!', 'success');
}

function editTask(taskId) {
    const task = tasks.find(t => t.id == taskId);
    if (!task) return;
    
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskCaseNumber').value = task.caseNumber || '';
    document.getElementById('taskDueDate').value = task.dueDate || '';
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskDescription').value = task.description || '';
    
    // Set selected assignees
    const assigneesSelect = document.getElementById('taskAssignees');
    Array.from(assigneesSelect.options).forEach(option => {
        option.selected = task.assignees && task.assignees.includes(parseInt(option.value));
    });
    
    document.getElementById('addTaskModalTitle').textContent = 'Edit Task';
    
    const modal = new bootstrap.Modal(document.getElementById('addTaskModal'));
    modal.show();
}

async function deleteTask(taskId) {
    if (currentUser.role === 'viewer') {
        showNotification('You do not have permission to delete tasks', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete this task?')) {
        const index = tasks.findIndex(t => t.id == taskId);
        if (index !== -1) {
            tasks.splice(index, 1);
            renderTasksTable();
            updateStats();
            
            // Sync to GitHub
            await saveAllData();
            
            showNotification('Task deleted successfully!', 'success');
        }
    }
}

// User Management
function loadUsersPage() {
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

async function saveUser() {
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
    populateTaskDropdowns();
    populateUserDropdowns();
    
    // Sync to GitHub
    await saveAllData();
    
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

async function deleteUser(userId) {
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
            populateTaskDropdowns();
            populateUserDropdowns();
            
            // Sync to GitHub
            await saveAllData();
            
            showNotification('User deleted successfully!', 'success');
        }
    }
}

async function updateProfile() {
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
    
    // Sync to GitHub
    await saveAllData();
    
    showNotification('Profile updated successfully!', 'success');
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

async function saveInvoice() {
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
    
    // Handle file uploads for supporting documents
    const documentsFiles = document.getElementById('invoiceDocuments').files;
    if (documentsFiles.length > 0 && githubSync && githubSync.isConfigured) {
        try {
            const uploadPromises = Array.from(documentsFiles).map(file => 
                githubSync.uploadFileAndGetUrl(file, 'documents/invoices')
            );
            const uploadResults = await Promise.all(uploadPromises);
            invoiceData.supportingDocuments = uploadResults;
            showNotification(`${uploadResults.length} supporting documents uploaded`, 'success');
        } catch (error) {
            console.error('Failed to upload invoice documents:', error);
            showNotification('Failed to upload some supporting documents', 'warning');
        }
    }
    
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
    
    // Reset form
    form.reset();
    
    // Refresh displays
    renderInvoiceStats();
    renderInvoicesTable();
    
    // Sync to GitHub
    await saveAllData();
    
    showNotification(isEdit ? 'Invoice updated successfully!' : 'Invoice request submitted successfully!', 'success');
}

async function approveInvoice(invoiceId) {
    const index = invoices.findIndex(i => i.id == invoiceId);
    if (index !== -1) {
        invoices[index].status = 'approved';
        invoices[index].approvedBy = currentUser.id;
        invoices[index].approvedDate = new Date().toISOString().split('T')[0];
        
        renderInvoiceStats();
        renderInvoicesTable();
        
        // Sync to GitHub
        await saveAllData();
        
        showNotification('Invoice approved successfully!', 'success');
    }
}

async function rejectInvoice(invoiceId) {
    const index = invoices.findIndex(i => i.id == invoiceId);
    if (index !== -1) {
        invoices[index].status = 'rejected';
        invoices[index].rejectedBy = currentUser.id;
        invoices[index].rejectedDate = new Date().toISOString().split('T')[0];
        
        renderInvoiceStats();
        renderInvoicesTable();
        
        // Sync to GitHub
        await saveAllData();
        
        showNotification('Invoice rejected', 'info');
    }
}

async function deleteInvoice(invoiceId) {
    if (confirm('Are you sure you want to delete this invoice?')) {
        const index = invoices.findIndex(i => i.id == invoiceId);
        if (index !== -1) {
            invoices.splice(index, 1);
            renderInvoiceStats();
            renderInvoicesTable();
            
            // Sync to GitHub
            await saveAllData();
            
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
                    <button class="btn btn-sm btn-outline-primary download-file-btn" data-id="${file.id}"><i class="fas fa-download"></i></button>
                    <button class="btn btn-sm btn-outline-danger delete-file-btn" data-id="${file.id}"><i class="fas fa-trash"></i></button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function uploadOfficeFile() {
    const fileInput = document.getElementById('fileUpload');
    const description = document.getElementById('fileDescription').value;
    
    if (!fileInput.files.length) {
        showNotification('Please select a file', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    
    try {
        let fileUrl = null;
        let filePath = null;
        
        // Upload to GitHub if configured
        if (githubSync && githubSync.isConfigured) {
            const uploadResult = await githubSync.uploadFileAndGetUrl(file, 'office-copy');
            fileUrl = uploadResult.url;
            filePath = uploadResult.path;
        }
        
        const fileData = {
            id: Date.now(),
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            uploadDate: new Date().toISOString().split('T')[0],
            uploadedBy: currentUser.id,
            description: description,
            filePath: filePath,
            fileUrl: fileUrl
        };
        
        officeFiles.push(fileData);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('uploadFileModal'));
        modal.hide();
        
        // Reset form
        document.getElementById('uploadFileForm').reset();
        
        // Refresh table
        renderOfficeCopyTable();
        
        // Sync to GitHub
        await saveAllData();
        
        showNotification('File uploaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error uploading file:', error);
        showNotification('Failed to upload file', 'error');
    }
}

function downloadOfficeFile(fileId) {
    const file = officeFiles.find(f => f.id == fileId);
    if (file && file.fileUrl) {
        window.open(file.fileUrl, '_blank');
    } else {
        showNotification('File not available for download', 'error');
    }
}

async function deleteOfficeFile(fileId) {
    if (confirm('Are you sure you want to delete this file?')) {
        const index = officeFiles.findIndex(f => f.id == fileId);
        if (index !== -1) {
            officeFiles.splice(index, 1);
            renderOfficeCopyTable();
            
            // Sync to GitHub
            await saveAllData();
            
            showNotification('File deleted successfully!', 'success');
        }
    }
}

// Exports and GitHub Sync
function loadExportsPage() {
    updateSyncStatusIndicator();
    updateLastSyncInfo();
    loadGitHubSettings();
}

function loadGitHubSettings() {
    if (!githubSync) return;
    
    const status = githubSync.getSyncStatus();
    
    const ownerInput = document.getElementById('githubOwner');
    const repoInput = document.getElementById('githubRepo');
    const branchInput = document.getElementById('githubBranch');
    const tokenInput = document.getElementById('githubToken');
    
    if (ownerInput && status.settings.owner) {
        const [owner, repo] = status.settings.owner.includes('/') ? 
            status.settings.owner.split('/') : [status.settings.owner, status.settings.repo];
        ownerInput.value = owner || '';
        if (repoInput) repoInput.value = repo || status.settings.repo || '';
    }
    
    if (branchInput) branchInput.value = status.settings.branch || 'main';
}

async function saveGitHubSettings() {
    if (!githubSync) {
        showNotification('GitHub sync not available', 'error');
        return;
    }
    
    const owner = document.getElementById('githubOwner').value.trim();
    const repo = document.getElementById('githubRepo').value.trim();
    const branch = document.getElementById('githubBranch').value.trim() || 'main';
    const token = document.getElementById('githubToken').value.trim();
    
    if (!owner || !repo || !token) {
        showNotification('Please fill in all required fields (Owner, Repository, Token)', 'error');
        return;
    }
    
    try {
        githubSync.saveSettings({
            owner,
            repo,
            branch,
            token
        });
        
        updateSyncStatusIndicator();
        showNotification('GitHub settings saved successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving GitHub settings:', error);
        showNotification('Failed to save GitHub settings', 'error');
    }
}

async function testGitHubConnection() {
    if (!githubSync) {
        showNotification('GitHub sync not available', 'error');
        return;
    }
    
    try {
        // Save current settings first
        await saveGitHubSettings();
        
        // Test connection
        const result = await githubSync.testConnection();
        
        if (result.success) {
            showNotification('GitHub connection successful!', 'success');
            updateSyncStatusIndicator();
        }
        
    } catch (error) {
        console.error('GitHub connection test failed:', error);
        showNotification(`Connection failed: ${error.message}`, 'error');
    }
}

async function syncToGitHub() {
    if (!githubSync) {
        showNotification('GitHub sync not available', 'error');
        return;
    }
    
    if (!githubSync.isConfigured) {
        showNotification('Please configure GitHub settings first', 'error');
        return;
    }
    
    try {
        showNotification('Syncing to GitHub...', 'info');
        
        const result = await saveAllData();
        
        if (result.mode === 'github') {
            showNotification('Data synced to GitHub successfully!', 'success');
        } else {
            showNotification(`Sync failed, data saved locally. Error: ${result.error}`, 'warning');
        }
        
        updateSyncStatusIndicator();
        updateLastSyncInfo();
        
    } catch (error) {
        console.error('Sync failed:', error);
        showNotification(`Sync failed: ${error.message}`, 'error');
    }
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

// Notifications, Reminders, Messaging (placeholder implementations)
function loadNotificationsPage() {
    // Placeholder for notifications
}

function loadRemindersPage() {
    // Placeholder for reminders
}

function loadMessagingPage() {
    populateUserDropdowns();
}

function populateUserDropdowns() {
    const selects = ['quickUserSelect', 'messageRecipients'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = selectId === 'quickUserSelect' ? '<option value="">Select User</option>' : '';
            users.forEach(user => {
                if (user.id !== currentUser.id) {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = `${user.username} (${user.email})`;
                    select.appendChild(option);
                }
            });
        }
    });
}

function sendMessage() {
    // Placeholder for messaging
    showNotification('Message sent successfully!', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('composeMessageModal'));
    modal.hide();
}

function sendQuickMessage(type) {
    // Placeholder for quick messaging
    showNotification(`${type.toUpperCase()} sent successfully!`, 'success');
}

function saveReminderSettings() {
    // Placeholder for reminder settings
    showNotification('Reminder settings saved!', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('reminderSettingsModal'));
    modal.hide();
}

function startReminderSystem() {
    // Placeholder for reminder system
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

// Modal reset events
document.addEventListener('hidden.bs.modal', function(e) {
    // Reset form when modal is closed
    const modalId = e.target.id;
    
    if (modalId === 'addCaseModal') {
        document.getElementById('addCaseForm').reset();
        document.getElementById('addCaseModalTitle').textContent = 'Add New Case';
        clearDynamicSections();
    }
    
    if (modalId === 'addTaskModal') {
        document.getElementById('addTaskForm').reset();
        document.getElementById('addTaskModalTitle').textContent = 'Add New Task';
    }
    
    if (modalId === 'addUserModal') {
        document.getElementById('addUserForm').reset();
        document.getElementById('addUserModalTitle').textContent = 'Add New User';
    }
    
    if (modalId === 'addInvoiceModal') {
        document.getElementById('addInvoiceForm').reset();
        document.getElementById('addInvoiceModalTitle').textContent = 'Add Invoice Request';
    }
});

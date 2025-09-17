// GitHub Sync Utility for Case Management System
class GitHubSync {
    constructor() {
        this.settings = this.loadSettings();
        this.isConfigured = this.checkConfiguration();
    }

    // Load GitHub settings from localStorage
    loadSettings() {
        const saved = localStorage.getItem('githubSettings');
        return saved ? JSON.parse(saved) : {
            owner: '',
            repo: '',
            branch: 'main',
            token: '',
            lastSync: null
        };
    }

    // Save GitHub settings to localStorage
    saveSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        localStorage.setItem('githubSettings', JSON.stringify(this.settings));
        this.isConfigured = this.checkConfiguration();
        return this.settings;
    }

    // Check if GitHub is properly configured
    checkConfiguration() {
        return !!(this.settings.owner && this.settings.repo && this.settings.token);
    }

    // Generate base64 content for GitHub API
    encodeContent(content) {
        return btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));
    }

    // Decode base64 content from GitHub API
    decodeContent(base64Content) {
        return JSON.parse(decodeURIComponent(escape(atob(base64Content))));
    }

    // Get GitHub API headers
    getHeaders() {
        return {
            'Authorization': `token ${this.settings.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
    }

    // Get file from GitHub
    async getFile(path) {
        if (!this.isConfigured) {
            throw new Error('GitHub not configured');
        }

        const url = `https://api.github.com/repos/${this.settings.owner}/${this.settings.repo}/contents/${path}?ref=${this.settings.branch}`;
        
        const response = await fetch(url, {
            headers: this.getHeaders()
        });

        if (response.status === 404) {
            return null; // File doesn't exist
        }

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    // Create or update file in GitHub
    async saveFile(path, content, message = 'Update data') {
        if (!this.isConfigured) {
            throw new Error('GitHub not configured');
        }

        const url = `https://api.github.com/repos/${this.settings.owner}/${this.settings.repo}/contents/${path}`;
        
        // Try to get existing file to get its SHA
        let sha = null;
        try {
            const existing = await this.getFile(path);
            if (existing) {
                sha = existing.sha;
            }
        } catch (error) {
            // File might not exist, that's okay
        }

        const body = {
            message,
            content: typeof content === 'string' ? btoa(content) : this.encodeContent(content),
            branch: this.settings.branch
        };

        if (sha) {
            body.sha = sha;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API error: ${response.status} ${errorData.message || response.statusText}`);
        }

        return await response.json();
    }

    // Upload binary file (for documents)
    async uploadFile(path, file, message = 'Upload file') {
        if (!this.isConfigured) {
            throw new Error('GitHub not configured');
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const content = reader.result.split(',')[1]; // Remove data:... prefix
                    const result = await this.saveFile(path, content, message);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Load all data from GitHub
    async loadData() {
        if (!this.isConfigured) {
            return this.getDefaultData();
        }

        try {
            const file = await this.getFile('data.json');
            if (file) {
                const data = this.decodeContent(file.content);
                this.settings.lastSync = new Date().toISOString();
                this.saveSettings({ lastSync: this.settings.lastSync });
                return data;
            }
        } catch (error) {
            console.warn('Could not load from GitHub:', error.message);
        }

        return this.getDefaultData();
    }

    // Save all data to GitHub
    async saveData(data) {
        if (!this.isConfigured) {
            // Fallback to localStorage
            this.saveToLocalStorage(data);
            return { mode: 'localStorage', success: true };
        }

        try {
            const timestamp = new Date().toISOString();
            const dataWithTimestamp = {
                ...data,
                lastUpdated: timestamp,
                version: '2.0'
            };

            await this.saveFile('data.json', dataWithTimestamp, `Update data - ${timestamp}`);
            
            this.settings.lastSync = timestamp;
            this.saveSettings({ lastSync: timestamp });
            
            return { mode: 'github', success: true, timestamp };
        } catch (error) {
            console.warn('GitHub sync failed, falling back to localStorage:', error.message);
            this.saveToLocalStorage(data);
            return { mode: 'localStorage', success: true, error: error.message };
        }
    }

    // Save to localStorage as fallback
    saveToLocalStorage(data) {
        Object.keys(data).forEach(key => {
            if (key !== 'lastUpdated' && key !== 'version') {
                localStorage.setItem(`cms_${key}`, JSON.stringify(data[key]));
            }
        });
        localStorage.setItem('cms_lastUpdated', new Date().toISOString());
    }

    // Load from localStorage as fallback
    loadFromLocalStorage() {
        const data = this.getDefaultData();
        
        try {
            const keys = ['users', 'cases', 'tasks', 'invoices', 'officeFiles', 'notifications', 'reminders', 'messages'];
            keys.forEach(key => {
                const stored = localStorage.getItem(`cms_${key}`);
                if (stored) {
                    data[key] = JSON.parse(stored);
                }
            });
        } catch (error) {
            console.warn('Error loading from localStorage:', error);
        }

        return data;
    }

    // Get default data structure
    getDefaultData() {
        return {
            users: [
                { id: 1, username: 'admin', password: 'Admin123!', role: 'admin', email: 'admin@example.com', phone: '+1234567890' },
                { id: 2, username: 'manager', password: 'Manager123!', role: 'restricted_admin', email: 'manager@example.com', phone: '+1234567891' },
                { id: 3, username: 'viewer', password: 'Viewer123!', role: 'viewer', email: 'viewer@example.com', phone: '+1234567892' }
            ],
            cases: [
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
            ],
            tasks: [
                { id: 1, title: 'Review case documents', caseNumber: 'CRLP 13925/2024', assignees: [1], dueDate: '2023-10-15', status: 'open', description: 'Review all documents for the upcoming hearing', comments: [] },
                { id: 2, title: 'Prepare hearing notes', caseNumber: 'CRLP 13925/2024', assignees: [2], dueDate: '2023-10-10', status: 'in-progress', description: 'Prepare detailed notes for the hearing', comments: [] },
                { id: 3, title: 'File motion to dismiss', caseNumber: 'CRLP 13925/2024', assignees: [3], dueDate: '2023-10-05', status: 'completed', description: 'File a motion to dismiss the case', comments: [] }
            ],
            invoices: [
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
            ],
            officeFiles: [
                {
                    id: 1,
                    fileName: 'Sample Document.pdf',
                    fileSize: '2.5 MB',
                    uploadDate: '2025-09-14',
                    uploadedBy: 2,
                    filePath: '/uploads/sample-document.pdf',
                    description: 'Sample legal document'
                }
            ],
            notifications: [],
            reminders: [],
            messages: []
        };
    }

    // Upload file and get GitHub URL
    async uploadFileAndGetUrl(file, folder = 'uploads') {
        if (!this.isConfigured) {
            throw new Error('GitHub not configured for file uploads');
        }

        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const path = `${folder}/${fileName}`;

        try {
            const result = await this.uploadFile(path, file, `Upload ${file.name}`);
            return {
                url: result.content.download_url,
                path: path,
                filename: fileName,
                size: file.size,
                type: file.type
            };
        } catch (error) {
            throw new Error(`File upload failed: ${error.message}`);
        }
    }

    // Get sync status for UI
    getSyncStatus() {
        return {
            configured: this.isConfigured,
            lastSync: this.settings.lastSync,
            settings: {
                owner: this.settings.owner,
                repo: this.settings.repo,
                branch: this.settings.branch
            }
        };
    }

    // Test connection to GitHub
    async testConnection() {
        if (!this.isConfigured) {
            throw new Error('GitHub not configured');
        }

        try {
            const url = `https://api.github.com/repos/${this.settings.owner}/${this.settings.repo}`;
            const response = await fetch(url, {
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Repository not accessible: ${response.status} ${response.statusText}`);
            }

            return { success: true, message: 'Connection successful' };
        } catch (error) {
            throw new Error(`Connection test failed: ${error.message}`);
        }
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.GitHubSync = GitHubSync;
}

// GitHub Synchronization Utility
class GitHubSync {
    constructor() {
        this.baseURL = 'https://api.github.com';
        this.settings = this.loadSettings();
    }

    loadSettings() {
        const stored = localStorage.getItem('githubSettings');
        return stored ? JSON.parse(stored) : {
            token: '',
            repo: '',
            branch: 'main',
            filePath: 'case-data.json'
        };
    }

    saveSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        localStorage.setItem('githubSettings', JSON.stringify(this.settings));
    }

    async syncData(data) {
        if (!this.settings.token || !this.settings.repo) {
            throw new Error('GitHub token and repository are required');
        }

        try {
            const content = JSON.stringify(data, null, 2);
            const encodedContent = btoa(unescape(encodeURIComponent(content)));

            // First, try to get the current file to get its SHA
            let sha = null;
            try {
                const getResponse = await fetch(
                    `${this.baseURL}/repos/${this.settings.repo}/contents/${this.settings.filePath}`,
                    {
                        headers: {
                            'Authorization': `token ${this.settings.token}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );
                
                if (getResponse.ok) {
                    const fileData = await getResponse.json();
                    sha = fileData.sha;
                }
            } catch (error) {
                // File doesn't exist, which is fine for first upload
                console.log('File not found, will create new file');
            }

            // Create or update the file
            const updateData = {
                message: `Update case data - ${new Date().toISOString()}`,
                content: encodedContent,
                branch: this.settings.branch
            };

            if (sha) {
                updateData.sha = sha;
            }

            const response = await fetch(
                `${this.baseURL}/repos/${this.settings.repo}/contents/${this.settings.filePath}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.settings.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`GitHub API Error: ${errorData.message}`);
            }

            const result = await response.json();
            console.log('Successfully synced to GitHub:', result.commit.sha);
            return result;

        } catch (error) {
            console.error('GitHub sync error:', error);
            throw error;
        }
    }

    async loadFromGitHub() {
        if (!this.settings.token || !this.settings.repo) {
            throw new Error('GitHub token and repository are required');
        }

        try {
            const response = await fetch(
                `${this.baseURL}/repos/${this.settings.repo}/contents/${this.settings.filePath}`,
                {
                    headers: {
                        'Authorization': `token ${this.settings.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    return null; // File doesn't exist
                }
                const errorData = await response.json();
                throw new Error(`GitHub API Error: ${errorData.message}`);
            }

            const fileData = await response.json();
            const content = decodeURIComponent(escape(atob(fileData.content)));
            return JSON.parse(content);

        } catch (error) {
            console.error('GitHub load error:', error);
            throw error;
        }
    }

    async validateSettings(token, repo) {
        try {
            const response = await fetch(
                `${this.baseURL}/repos/${repo}`,
                {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // Auto-sync functionality
    startAutoSync(intervalMinutes = 30, getData) {
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
        }

        this.autoSyncInterval = setInterval(async () => {
            if (this.settings.token && this.settings.repo && typeof getData === 'function') {
                try {
                    const data = getData();
                    await this.syncData(data);
                    console.log('Auto-sync completed successfully');
                } catch (error) {
                    console.error('Auto-sync failed:', error);
                }
            }
        }, intervalMinutes * 60 * 1000);
    }

    stopAutoSync() {
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
            this.autoSyncInterval = null;
        }
    }
}

// Make available globally
window.GitHubSync = GitHubSync;
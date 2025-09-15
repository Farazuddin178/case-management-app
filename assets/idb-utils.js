// IndexedDB Utilities
class IDBUtils {
    constructor() {
        this.dbName = 'CaseManagementDB';
        this.dbVersion = 1;
        this.db = null;
        
        this.STORES = {
            users: 'users',
            cases: 'cases',
            tasks: 'tasks',
            invoices: 'invoices',
            officeFiles: 'officeFiles',
            reminders: 'reminders',
            messages: 'messages',
            settings: 'settings'
        };
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('IndexedDB error:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(true);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores
                Object.values(this.STORES).forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        const store = db.createObjectStore(storeName, { keyPath: 'id' });
                        
                        // Create indexes based on store type
                        switch (storeName) {
                            case 'users':
                                store.createIndex('username', 'username', { unique: true });
                                store.createIndex('email', 'email', { unique: false });
                                break;
                            case 'cases':
                                store.createIndex('caseNumber', 'caseNumber', { unique: true });
                                store.createIndex('status', 'status', { unique: false });
                                store.createIndex('filingDate', 'filingDate', { unique: false });
                                break;
                            case 'tasks':
                                store.createIndex('status', 'status', { unique: false });
                                store.createIndex('dueDate', 'dueDate', { unique: false });
                                store.createIndex('caseNumber', 'caseNumber', { unique: false });
                                break;
                            case 'invoices':
                                store.createIndex('status', 'status', { unique: false });
                                store.createIndex('type', 'type', { unique: false });
                                store.createIndex('date', 'date', { unique: false });
                                break;
                            case 'messages':
                                store.createIndex('sentDate', 'sentDate', { unique: false });
                                store.createIndex('sentBy', 'sentBy', { unique: false });
                                break;
                        }
                    }
                });
            };
        });
    }

    async add(storeName, data) {
        if (!this.db) await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            // Ensure data has an ID
            if (!data.id) {
                data.id = Date.now() + Math.floor(Math.random() * 1000);
            }
            
            const request = store.add(data);
            
            request.onsuccess = () => resolve(data);
            request.onerror = () => reject(request.error);
        });
    }

    async update(storeName, data) {
        if (!this.db) await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(data);
            request.onerror = () => reject(request.error);
        });
    }

    async get(storeName, id) {
        if (!this.db) await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll(storeName) {
        if (!this.db) await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(storeName, id) {
        if (!this.db) await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async clear(storeName) {
        if (!this.db) await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();
            
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async search(storeName, indexName, value) {
        if (!this.db) await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);
            
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    async backup() {
        if (!this.db) await this.initDB();
        
        const backup = {};
        
        for (const storeName of Object.values(this.STORES)) {
            try {
                backup[storeName] = await this.getAll(storeName);
            } catch (error) {
                console.error(`Error backing up ${storeName}:`, error);
                backup[storeName] = [];
            }
        }
        
        return backup;
    }

    async restore(backupData) {
        if (!this.db) await this.initDB();
        
        for (const [storeName, data] of Object.entries(backupData)) {
            if (Object.values(this.STORES).includes(storeName) && Array.isArray(data)) {
                try {
                    // Clear existing data
                    await this.clear(storeName);
                    
                    // Add backup data
                    for (const item of data) {
                        await this.add(storeName, item);
                    }
                } catch (error) {
                    console.error(`Error restoring ${storeName}:`, error);
                }
            }
        }
    }

    // Statistics and reporting
    async getStats() {
        const stats = {};
        
        for (const storeName of Object.values(this.STORES)) {
            try {
                const data = await this.getAll(storeName);
                stats[storeName] = {
                    count: data.length,
                    lastModified: data.length > 0 ? Math.max(...data.map(item => 
                        new Date(item.updatedAt || item.createdAt || 0).getTime()
                    )) : null
                };
            } catch (error) {
                stats[storeName] = { count: 0, lastModified: null, error: error.message };
            }
        }
        
        return stats;
    }
}

// Make available globally
window.IDBUtils = new IDBUtils();
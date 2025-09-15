// Export Utilities
class ExportUtils {
    constructor() {
        this.chartColors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ];
    }

    // PDF Export Functions
    generateCasesPDF(cases, title = 'Cases Report') {
        if (typeof jsPDF === 'undefined') {
            throw new Error('jsPDF library not loaded');
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.text(title, 20, 20);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
        doc.text(`Total Cases: ${cases.length}`, 20, 45);
        
        // Line separator
        doc.line(20, 55, 190, 55);
        
        let yPosition = 70;
        const pageHeight = doc.internal.pageSize.height;
        
        cases.forEach((caseItem, index) => {
            // Check if we need a new page
            if (yPosition > pageHeight - 40) {
                doc.addPage();
                yPosition = 20;
            }
            
            // Case header
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`${index + 1}. ${caseItem.caseNumber}`, 20, yPosition);
            
            // Case details
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            yPosition += 10;
            
            const details = [
                `SR Number: ${caseItem.srNumber || 'N/A'}`,
                `Petitioner: ${caseItem.primaryPetitioner}`,
                `Respondent: ${caseItem.primaryRespondent}`,
                `Filing Date: ${this.formatDate(caseItem.filingDate)}`,
                `Status: ${caseItem.status.toUpperCase()}`,
                `Category: ${caseItem.category || 'N/A'}`,
                `District: ${caseItem.district || 'N/A'}`
            ];
            
            details.forEach(detail => {
                doc.text(detail, 25, yPosition);
                yPosition += 6;
            });
            
            // Prayer (if exists and not too long)
            if (caseItem.prayer && caseItem.prayer.length < 200) {
                yPosition += 3;
                doc.text('Prayer:', 25, yPosition);
                yPosition += 6;
                const prayerLines = doc.splitTextToSize(caseItem.prayer, 160);
                doc.text(prayerLines, 30, yPosition);
                yPosition += prayerLines.length * 6;
            }
            
            yPosition += 10; // Space between cases
        });
        
        return doc;
    }

    generateCaseDetailsPDF(caseData) {
        if (typeof jsPDF === 'undefined') {
            throw new Error('jsPDF library not loaded');
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(`Case Details: ${caseData.caseNumber}`, 20, 20);
        
        let yPos = 40;
        
        const addSection = (title, content) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(title, 20, yPos);
            yPos += 10;
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            
            if (Array.isArray(content)) {
                content.forEach(line => {
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = 20;
                    }
                    doc.text(line, 25, yPos);
                    yPos += 6;
                });
            } else {
                const lines = doc.splitTextToSize(content, 160);
                lines.forEach(line => {
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = 20;
                    }
                    doc.text(line, 25, yPos);
                    yPos += 6;
                });
            }
            
            yPos += 10;
        };
        
        // Basic Information
        const basicInfo = [
            `SR Number: ${caseData.srNumber || 'N/A'}`,
            `CNR: ${caseData.cnr || 'N/A'}`,
            `Status: ${caseData.status.toUpperCase()}`,
            `Category: ${caseData.category || 'N/A'}`,
            `Sub Category: ${caseData.subCategory || 'N/A'}`,
            `District: ${caseData.district || 'N/A'}`,
            `Purpose: ${caseData.purpose || 'N/A'}`
        ];
        addSection('Basic Information', basicInfo);
        
        // Party Information
        const partyInfo = [
            `Primary Petitioner: ${caseData.primaryPetitioner}`,
            `Primary Respondent: ${caseData.primaryRespondent}`,
            `Petitioner Advocate: ${caseData.petitionerAdv || 'N/A'}`,
            `Respondent Advocate: ${caseData.respondentAdv || 'N/A'}`
        ];
        addSection('Party Information', partyInfo);
        
        // Important Dates
        const dates = [
            `Filing Date: ${this.formatDate(caseData.filingDate)}`,
            `Registration Date: ${this.formatDate(caseData.registrationDate)}`,
            `Listing Date: ${this.formatDate(caseData.listingDate)}`,
            `Disposal Date: ${this.formatDate(caseData.dispDate)}`,
            `Judge: ${caseData.judName || 'N/A'}`
        ];
        addSection('Important Dates', dates);
        
        // Prayer
        if (caseData.prayer) {
            addSection('Prayer', caseData.prayer);
        }
        
        // IA Details
        if (caseData.iaDetails && caseData.iaDetails.length > 0) {
            const iaText = caseData.iaDetails.map((ia, index) => 
                `${index + 1}. ${ia.iaNumber} - ${ia.paperType} (${ia.status})`
            );
            addSection('IA Details', iaText);
        }
        
        return doc;
    }

    // CSV Export Functions
    generateCasesCSV(cases) {
        const headers = [
            'Case Number', 'SR Number', 'CNR', 'Status', 
            'Primary Petitioner', 'Primary Respondent', 
            'Petitioner Advocate', 'Respondent Advocate',
            'Category', 'Sub Category', 'District', 'Purpose',
            'Filing Date', 'Registration Date', 'Listing Date', 
            'Disposal Date', 'Judge Name'
        ];
        
        const csvData = [headers];
        
        cases.forEach(c => {
            csvData.push([
                c.caseNumber || '',
                c.srNumber || '',
                c.cnr || '',
                c.status || '',
                c.primaryPetitioner || '',
                c.primaryRespondent || '',
                c.petitionerAdv || '',
                c.respondentAdv || '',
                c.category || '',
                c.subCategory || '',
                c.district || '',
                c.purpose || '',
                c.filingDate || '',
                c.registrationDate || '',
                c.listingDate || '',
                c.dispDate || '',
                c.judName || ''
            ]);
        });
        
        return this.arrayToCSV(csvData);
    }

    generateTasksCSV(tasks, users) {
        const headers = [
            'Task ID', 'Title', 'Description', 'Case Number',
            'Assignees', 'Due Date', 'Status', 'Created Date'
        ];
        
        const csvData = [headers];
        
        tasks.forEach(task => {
            const assigneeNames = task.assignees.map(id => {
                const user = users.find(u => u.id === id);
                return user ? user.username : 'Unknown';
            }).join('; ');
            
            csvData.push([
                task.id || '',
                task.title || '',
                task.description || '',
                task.caseNumber || '',
                assigneeNames,
                task.dueDate || '',
                task.status || '',
                task.createdDate || ''
            ]);
        });
        
        return this.arrayToCSV(csvData);
    }

    generateInvoicesCSV(invoices, users) {
        const headers = [
            'Invoice ID', 'Date', 'Type', 'Description', 
            'Amount', 'Status', 'Requested By', 'Case Number', 
            'Approved Date', 'Notes'
        ];
        
        const csvData = [headers];
        
        invoices.forEach(invoice => {
            const requestedBy = users.find(u => u.id === invoice.requestedBy);
            
            csvData.push([
                `INV-${invoice.id}`,
                invoice.date || '',
                invoice.type || '',
                invoice.description || '',
                invoice.amount || 0,
                invoice.status || '',
                requestedBy ? requestedBy.username : 'Unknown',
                invoice.caseNumber || '',
                invoice.approvedDate || '',
                invoice.notes || ''
            ]);
        });
        
        return this.arrayToCSV(csvData);
    }

    // Excel Export Functions (using CSV format with .xlsx extension for compatibility)
    generateCasesExcel(cases) {
        return this.generateCasesCSV(cases);
    }

    generateTasksExcel(tasks, users) {
        return this.generateTasksCSV(tasks, users);
    }

    generateInvoicesExcel(invoices, users) {
        return this.generateInvoicesCSV(invoices, users);
    }

    // Utility Functions
    arrayToCSV(data) {
        return data.map(row => 
            row.map(field => {
                // Escape quotes and wrap in quotes if necessary
                const escaped = String(field || '').replace(/"/g, '""');
                return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n') 
                    ? `"${escaped}"` 
                    : escaped;
            }).join(',')
        ).join('\n');
    }

    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    downloadPDF(doc, filename) {
        doc.save(filename);
    }

    downloadCSV(csvContent, filename) {
        this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
    }

    downloadExcel(csvContent, filename) {
        // For true Excel support, you'd need a library like SheetJS
        // For now, we'll download as CSV with .xlsx extension for basic compatibility
        this.downloadFile(csvContent, filename.replace('.csv', '.xlsx'), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount || 0);
    }

    // Summary Reports
    generateSummaryReport(data) {
        const { cases, tasks, invoices, users } = data;
        
        const summary = {
            totalCases: cases.length,
            casesByStatus: this.groupBy(cases, 'status'),
            casesByCategory: this.groupBy(cases, 'category'),
            totalTasks: tasks.length,
            tasksByStatus: this.groupBy(tasks, 'status'),
            totalInvoices: invoices.length,
            invoicesByStatus: this.groupBy(invoices, 'status'),
            financialSummary: {
                totalIncome: invoices.filter(i => i.type === 'income' && i.status === 'approved')
                    .reduce((sum, i) => sum + (i.amount || 0), 0),
                totalExpenses: invoices.filter(i => i.type === 'expense' && i.status === 'approved')
                    .reduce((sum, i) => sum + (i.amount || 0), 0)
            },
            generatedOn: new Date().toISOString()
        };
        
        summary.financialSummary.netBalance = 
            summary.financialSummary.totalIncome - summary.financialSummary.totalExpenses;
            
        return summary;
    }

    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key] || 'Unknown';
            groups[group] = (groups[group] || 0) + 1;
            return groups;
        }, {});
    }
}

// Make available globally
window.ExportUtils = new ExportUtils();
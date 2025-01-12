import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Select, MenuItem, FormControl, InputLabel, Box, TextField, TablePagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material';

interface Invoice {
    id: number;
    companyPortal: string;
    invoiceNumber: string;
    invoiceDate: string;
    syncAccount: string;
    status: string;
    dateTime: string;
}

const invoices: Invoice[] = [
    { id: 1, companyPortal: 'Unassigned', invoiceNumber: 'RE-1001', invoiceDate: '25.01.2019', syncAccount: 'sevDesk', status: 'green', dateTime: '25.01.2019 11:24' },
    { id: 2, companyPortal: 'Amazon.de', invoiceNumber: 'AEU-INV-DE-2018-313308106', invoiceDate: '14.12.2018', syncAccount: 'sevDesk', status: 'green', dateTime: '25.01.2019 11:23' },
    { id: 3, companyPortal: 'Telekom Deutschland GmbH', invoiceNumber: '24488224000871', invoiceDate: '11.12.2018', syncAccount: 'sevDesk', status: 'green', dateTime: '25.01.2019 11:23' },
];

const DocumentTable: React.FC = () => {
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedSyncAccount, setSelectedSyncAccount] = useState('');
    const [globalSearch, setGlobalSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);

    const handleCompanyChange = (event: SelectChangeEvent<string>) => {
        setSelectedCompany(event.target.value as string);
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setSelectedStatus(event.target.value as string);
    };

    const handleSyncAccountChange = (event: SelectChangeEvent<string>) => {
        setSelectedSyncAccount(event.target.value as string);
    };

    const handleGlobalSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGlobalSearch(event.target.value);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    const filteredInvoices = invoices.filter((invoice) => {
        const globalMatch =
            invoice.companyPortal.toLowerCase().includes(globalSearch.toLowerCase()) ||
            invoice.invoiceNumber.toLowerCase().includes(globalSearch.toLowerCase()) ||
            invoice.invoiceDate.toLowerCase().includes(globalSearch.toLowerCase()) ||
            invoice.syncAccount.toLowerCase().includes(globalSearch.toLowerCase()) ||
            invoice.status.toLowerCase().includes(globalSearch.toLowerCase()) ||
            invoice.dateTime.toLowerCase().includes(globalSearch.toLowerCase());

        return (
            globalMatch &&
            (selectedCompany === '' || invoice.companyPortal === selectedCompany) &&
            (selectedStatus === '' || invoice.status === selectedStatus) &&
            (selectedSyncAccount === '' || invoice.syncAccount === selectedSyncAccount)
        );
    });


    const paginatedInvoices = filteredInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


    return (
        <>
            <TableContainer component={Paper} sx={{ width: '95%', marginLeft: '86px', marginTop: '16px' }}>
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '16px' }}>
                    Invoice Table
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '16px', width: '80%', margin: '13px auto', float: 'left', marginLeft: '15px' }}>
                    <TextField
                        label="Global Search"
                        value={globalSearch}
                        onChange={handleGlobalSearchChange}
                        sx={{ flex: 1, marginRight: '16px' }}
                    />
                    <FormControl sx={{ flex: 1, marginRight: '16px' }}>
                        <InputLabel>Company/Portal</InputLabel>
                        <Select value={selectedCompany} onChange={handleCompanyChange}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Unassigned">Unassigned</MenuItem>
                            <MenuItem value="Amazon.de">Amazon.de</MenuItem>
                            <MenuItem value="Telekom Deutschland GmbH">Telekom Deutschland GmbH</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ flex: 1, marginRight: '16px' }}>
                        <InputLabel>Status</InputLabel>
                        <Select value={selectedStatus} onChange={handleStatusChange}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="green">Green</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ flex: 1 }}>
                        <InputLabel>Sync Account</InputLabel>
                        <Select value={selectedSyncAccount} onChange={handleSyncAccountChange}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="sevDesk">sevDesk</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Company/Portal</TableCell>
                            <TableCell>Invoice Number</TableCell>
                            <TableCell>Invoice Date</TableCell>
                            <TableCell>Sync Account</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date+Time</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedInvoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.companyPortal}</TableCell>
                                <TableCell>{invoice.invoiceNumber}</TableCell>
                                <TableCell>{invoice.invoiceDate}</TableCell>
                                <TableCell>{invoice.syncAccount}</TableCell>
                                <TableCell>{invoice.status}</TableCell>
                                <TableCell>{invoice.dateTime}</TableCell>
                                <TableCell>
                                    <IconButton color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={filteredInvoices.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </>
    );
};

export default DocumentTable;

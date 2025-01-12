import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Select, MenuItem, FormControl, InputLabel, Box, TextField, TablePagination, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material';
import apiService from '@/app/services/apiService';
import { enqueueSnackbar } from 'notistack';
import { useTranslations } from 'next-intl';
import { FileCopy, PictureAsPdf } from '@mui/icons-material'; // Для іконки PDF та інших типів
import { CircularProgress } from '@mui/material';
import { Sync } from '@mui/icons-material';

interface Invoice {
    id: number;
    accounting_name: string;
    document_name: string;
    accounting_document_id: string;
    dms_document_id: string;
    document_extension: string;
    accounting_document_date: string;
    dms_name: string;
    document_mime_type: string;
}


const DocumentTable: React.FC = () => {
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedSyncAccount, setSelectedSyncAccount] = useState('');
    const [globalSearch, setGlobalSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = React.useState<Invoice[]>([]);
    const [companies, setCompanies] = useState<string[]>([]); // Стейт для компаній
    const [statuses, setStatuses] = useState<string[]>([]); // Стейт для статусів
    const [syncAccounts, setSyncAccounts] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [synced, setSynced] = useState(false);
    const [selectedDmsStatus, setSelectedDmsStatus] = useState('');
    console.log(synced);


    const t = useTranslations('API');

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

    const filteredInvoices = rows.filter((invoice) => {
        const globalMatch =
            invoice.accounting_name.toLowerCase().includes(globalSearch.toLowerCase()) ||
            invoice.document_name.toLowerCase().includes(globalSearch.toLowerCase()) ||
            invoice.accounting_document_id.toLowerCase().includes(globalSearch.toLowerCase()) ||
            invoice.document_extension.toLowerCase().includes(globalSearch.toLowerCase()) ||
            invoice.accounting_document_date.toLowerCase().includes(globalSearch.toLowerCase()) ||
            invoice.dms_name.toLowerCase().includes(globalSearch.toLowerCase());

        const statusMatch =
            selectedStatus === '' ||
            (selectedStatus === 'true' && invoice.accounting_document_id) ||
            (selectedStatus === 'false' && !invoice.accounting_document_id);

        const dmsStatusMatch =
            selectedDmsStatus === '' ||
            (selectedDmsStatus === 'true' && invoice.dms_document_id) ||
            (selectedDmsStatus === 'false' && !invoice.dms_document_id);

        const syncAccountMatch =
            selectedSyncAccount === '' || invoice.dms_name === selectedSyncAccount;

        const companyMatch =
            selectedCompany === '' || invoice.accounting_name === selectedCompany;

        return globalMatch && statusMatch && dmsStatusMatch && syncAccountMatch && companyMatch;
    });


    const handleSyncClick = async () => {
        setLoading(true);

        const getToken: string | null = sessionStorage.getItem('AuthToken');

        if (!getToken) {
            console.error('Токен не знайдено');
            setLoading(false);
            return;
        }

        try {
            // Виконання запиту
            const response: any = await apiService.get("accounting-software/invoices-sync", getToken);
            if (response instanceof Error) {
                const { status, variant, message } = apiService.CheckAndShow(response, t);
                console.log(message);
                // @ts-ignore
                enqueueSnackbar(message, { variant: variant });
            }
            console.log(response.success);

            if (response.success === true) {
                setSynced(true); // Оновлення стану на "синхронізовано"
                enqueueSnackbar(t('accounting-data-fetched-successfully'), { variant: 'success' });
                const response: any = await apiService.get("document-sync", getToken)
                setRows(response.data);
            } else {
                setSynced(false); // В разі помилки на сервері
            }
        } catch (error) {
            console.error('Помилка при синхронізації', error);
            setSynced(false); // Якщо сталася помилка на рівні запиту
        } finally {
            setLoading(false); // Завершення процесу синхронізації
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {

            const getToken: any = sessionStorage.getItem('AuthToken');
            const response: any = await apiService.get("document-sync", getToken)

            console.log(response.data);

            setRows(response.data);
            if (response instanceof Error) {
                const { status, variant, message } = apiService.CheckAndShow(response, t);
                console.log(message);
                // @ts-ignore
                enqueueSnackbar(message, { variant: variant });
            }

            if (response.success === true) {
                enqueueSnackbar(t('accounting-data-fetched-successfully'), { variant: 'success' });
                // @ts-ignore
                setCompanies([...new Set(response.data.map((item: any) => item.accounting_name))]); // Унікальні компанії
                // @ts-ignore
                setStatuses([...new Set(response.data.map((item: any) => item.accounting_document_id))]); // Унікальні статуси
                // @ts-ignore
                setSyncAccounts([...new Set(response.data.map((item: any) => item.dms_name))]); // Унікальні акаунти синхронізації
            }
        };

        fetchData();
    }, []);

    const renderFileIcon = (mimeType: string) => {
        switch (mimeType) {
            case 'application/pdf':
                return <PictureAsPdf style={{ fontSize: '40px', color: 'red' }} />;
            case 'image/png':
            case 'image/jpeg':
                return <img src="image-icon.png" alt="image" style={{ width: '40px' }} />;
            case 'application/msword':
                return <FileCopy style={{ fontSize: '40px', color: 'blue' }} />;
            // додати інші типи файлів за потреби
            default:
                return <FileCopy style={{ fontSize: '40px', color: 'gray' }} />;
        }
    };


    const paginatedInvoices = filteredInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


    return (
        <>
            <TableContainer component={Paper} sx={{ width: '95%', marginLeft: '86px', marginTop: '16px' }}>
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '16px' }}>
                    Invoice Table
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '16px', width: '100%', margin: '13px auto', float: 'left', marginLeft: '15px' }}>
                    <TextField
                        label="Global Search"
                        value={globalSearch}
                        onChange={handleGlobalSearchChange}
                        sx={{ width: '12%', marginRight: '16px' }}
                    />
                    <Box sx={{ width: '70%', float: 'left' }}>

                        <FormControl sx={{ width: '20%', marginRight: '16px' }}>
                            <InputLabel>Company/Portal</InputLabel>
                            <Select value={selectedCompany} onChange={handleCompanyChange}>
                                <MenuItem value="">All</MenuItem>
                                {companies.map((company, index) => (
                                    <MenuItem key={index} value={company}>
                                        {company}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '20%', marginRight: '16px' }}>
                            <InputLabel>Status Account</InputLabel>
                            <Select value={selectedStatus} onChange={handleStatusChange}>
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="true">True</MenuItem>
                                <MenuItem value="false">False</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '20%', marginRight: '16px' }}>
                            <InputLabel>DMS Document Status</InputLabel>
                            <Select
                                value={selectedDmsStatus}
                                onChange={(event: SelectChangeEvent<string>) =>
                                    setSelectedDmsStatus(event.target.value)
                                }
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="true">True</MenuItem>
                                <MenuItem value="false">False</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '20%', }}>
                            <InputLabel>Sync Account</InputLabel>
                            <Select value={selectedSyncAccount} onChange={handleSyncAccountChange}>
                                <MenuItem value="">All</MenuItem>
                                {syncAccounts.map((account, index) => (
                                    <MenuItem key={index} value={account}>
                                        {account}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Box>

                    <Button
                        sx={{ width: '10%', margin: 'auto' }}
                        variant="contained"
                        color={synced ? 'success' : 'error'} // Зелений якщо синхронізовано, червоний якщо ні
                        onClick={handleSyncClick}
                        disabled={loading} // Вимикає кнопку під час синхронізації
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Sync />}
                    >
                        {loading ? 'Синхронізація...' : synced ? 'Синхронізовано' : 'Синхронізувати'}
                    </Button>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Company/Portal</TableCell>
                            <TableCell>Invoice Number</TableCell>
                            <TableCell>icon</TableCell>
                            <TableCell>Invoice Date</TableCell>
                            <TableCell>Sync Account</TableCell>
                            <TableCell>Status Account</TableCell>
                            <TableCell>Status DMS</TableCell>
                            <TableCell>Date+Time</TableCell>
                            {/* <TableCell>Actions</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedInvoices.length !== 0 ?

                            paginatedInvoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <>

                                        <TableCell>{invoice?.accounting_name}</TableCell>
                                        <TableCell>{invoice?.document_name}.{invoice?.document_extension}</TableCell>
                                        <TableCell>{renderFileIcon(invoice?.document_mime_type)}</TableCell>
                                        <TableCell>{invoice?.accounting_document_date}</TableCell>
                                        <TableCell>{invoice?.dms_name}</TableCell>

                                        <TableCell>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                backgroundColor: invoice?.accounting_document_id ? 'green' : 'red',
                                                display: 'inline-block'
                                            }}></div>
                                        </TableCell>
                                        <TableCell>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                backgroundColor: invoice?.dms_document_id ? 'green' : 'red',
                                                display: 'inline-block'
                                            }}></div>
                                        </TableCell>
                                        <TableCell>{invoice?.accounting_document_date}</TableCell>
                                        {/* <TableCell>
                                    <IconButton color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell> */}

                                    </>
                                </TableRow>
                            )) :

                            (<TableRow>
                                <TableCell colSpan={8} style={{ textAlign: 'center', padding: '16px' }}>
                                    Not Found
                                </TableCell>
                            </TableRow>)
                        }
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

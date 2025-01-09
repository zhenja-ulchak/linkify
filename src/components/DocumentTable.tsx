import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Dialog, DialogTitle, DialogContent, Box, TextField, DialogActions, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import ConfirmDeleteModal from './modal/ConfirmDeleteModal';

interface Document {
    id: number;
    name: string;
    type: string;
    size: string;
    mimeType: string;
    docName: string;
    docType: string;
    docDescription: string;
    docVersion: string;
    docParentID: string;
    docLastChangeAt: string;
    syncDms: boolean;
    syncAccounting: boolean;
    createdAt: string;
}

const documents: Document[] = [
    { id: 1, name: 'Document 1', type: 'PDF', size: '1 MB', mimeType: 'application/pdf', docName: 'Doc 1', docType: 'Type 1', docDescription: 'Description 1', docVersion: '1.0', docParentID: '001', docLastChangeAt: '2025-01-01', syncDms: true, syncAccounting: false, createdAt: '2025-01-01' },
    { id: 2, name: 'Document 2', type: 'Word', size: '2 MB', mimeType: 'application/msword', docName: 'Doc 2', docType: 'Type 2', docDescription: 'Description 2', docVersion: '1.1', docParentID: '002', docLastChangeAt: '2025-01-02', syncDms: false, syncAccounting: true, createdAt: '2025-01-02' },
    { id: 3, name: 'Document 3', type: 'Excel', size: '500 KB', mimeType: 'application/vnd.ms-excel', docName: 'Doc 3', docType: 'Type 3', docDescription: 'Description 3', docVersion: '1.2', docParentID: '003', docLastChangeAt: '2025-01-03', syncDms: true, syncAccounting: true, createdAt: '2025-01-03' },
];

const DocumentTable: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [documentsList, setDocumentsList] = useState(documents);
    const [updatedTenant, setUpdatedTenant] = useState<any>(null);
     const [openModal, setOpenModal] = useState(false);
 
    const t = useTranslations('API');

    const handleEdit = (id: number) => {
        console.log(`Editing document with ID: ${id}`);
        // Додайте код для редагування документа
    };

    const handleDelete = (id: number) => {
        setDocumentsList(documentsList.filter(doc => doc.id !== id));
        console.log(`Deleted document with ID: ${id}`);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUpdatedTenant({
            ...updatedTenant,
            [name]: value,
        });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseModal = () => {
        setOpenModal(false);

    };

   const handleDeleteModal = ()=>{

   }
    return (
        <>
            <TableContainer component={Paper} sx={{ width: '95%', marginLeft: '86px' }}>
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '16px' }}>
                    {t('document-table')}
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('id')}</TableCell>
                            <TableCell>{t('ExtantanionType')}</TableCell>
                            <TableCell>{t('Size')}</TableCell>
                            <TableCell>{t('mimeType')}</TableCell>
                            <TableCell>{t('docName')}</TableCell>
                            <TableCell>{t('docType')}</TableCell>
                            <TableCell>{t('docDescription')}</TableCell>
                            <TableCell>{t('docVersion')}</TableCell>
                            <TableCell>{t('docParentID')}</TableCell>
                            <TableCell>{t('docLastChangeAt')}</TableCell>
                            <TableCell>{t('syncDms')}</TableCell>
                            <TableCell>{t('syncAccounting')}</TableCell>
                            <TableCell>{t('Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documentsList.map((document) => (
                            <TableRow key={document.id}>
                                <TableCell>{document.id}</TableCell>
                                <TableCell>{document.type}</TableCell>
                                <TableCell>{document.size}</TableCell>
                                <TableCell>{document.mimeType}</TableCell>
                                <TableCell>{document.docName}</TableCell>
                                <TableCell>{document.docType}</TableCell>
                                <TableCell>{document.docDescription}</TableCell>
                                <TableCell>{document.docVersion}</TableCell>
                                <TableCell>{document.docParentID}</TableCell>
                                <TableCell>{document.docLastChangeAt}</TableCell>
                                <TableCell>{document.syncDms ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{document.syncAccounting ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => {
                                        setOpen(true);
                                        handleEdit(document.id);
                                    }}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() =>{
                                        setOpenModal(true)
                                        handleDelete(document.id)
                                    } }>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ConfirmDeleteModal
                    open={openModal}
                    title="Delete Document"
                    handleDelete={handleDeleteModal}
                    onClose={handleCloseModal}
                    description={"Are you sure you want to delete Document?"}

                />
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth>
                <DialogTitle id="alert-dialog-title">{"Update Document"}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" component="span" id="alert-dialog-description">
                        <Box sx={{ marginBottom: 2, marginTop: "15px" }}>
                            <TextField
                                fullWidth
                                label={t('id')}
                                name="id"
                                value={updatedTenant?.id || ''}
                                onChange={handleEditChange}
                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label={t('ExtantanionType')}
                                name="type"
                                value={updatedTenant?.type || ''}
                                onChange={handleEditChange}
                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label={t('Size')}
                                name="size"
                                value={updatedTenant?.size || ''}
                                onChange={handleEditChange}
                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label={t('mimeType')}
                                name="mimeType"
                                value={updatedTenant?.mimeType || ''}
                                onChange={handleEditChange}
                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label={t('docName')}
                                name="docName"
                                value={updatedTenant?.docName || ''}
                                onChange={handleEditChange}
                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label={t('docType')}
                                name="docType"
                                value={updatedTenant?.docType || ''}
                                onChange={handleEditChange}
                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label={t('docDescription')}
                                name="docDescription"
                                value={updatedTenant?.docDescription || ''}
                                onChange={handleEditChange}
                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label={t('docVersion')}
                                name="docVersion"
                                value={updatedTenant?.docVersion || ''}
                                onChange={handleEditChange}
                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label={t('docParentID')}
                                name="docParentID"
                                value={updatedTenant?.docParentID || ''}
                                onChange={handleEditChange}
                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label={t('docLastChangeAt')}
                                name="docLastChangeAt"
                                value={updatedTenant?.docLastChangeAt || ''}
                                onChange={handleEditChange}
                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label={t('syncDms')}
                                name="syncDms"
                                value={updatedTenant?.syncDms ? 'Yes' : 'No'}
                                onChange={handleEditChange}
                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label={t('syncAccounting')}
                                name="syncAccounting"
                                value={updatedTenant?.syncAccounting ? 'Yes' : 'No'}
                                onChange={handleEditChange}
                            />
                        </Box>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button autoFocus>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DocumentTable;

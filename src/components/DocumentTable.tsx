// components/DocumentTable.tsx
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

interface Document {
    id: number;
    name: string;
    type: string;
    size: string;
    createdAt: string;
}

const documents: Document[] = [
    { id: 1, name: 'Document 1', type: 'PDF', size: '1 MB', createdAt: '2025-01-01' },
    { id: 2, name: 'Document 2', type: 'Word', size: '2 MB', createdAt: '2025-01-02' },
    { id: 3, name: 'Document 3', type: 'Excel', size: '500 KB', createdAt: '2025-01-03' },
];

const DocumentTable: React.FC = () => {
    const [documentsList, setDocumentsList] = useState(documents);

    const handleEdit = (id: number) => {
        console.log(`Editing document with ID: ${id}`);
        // Додайте код для редагування документа
    };

    const handleDelete = (id: number) => {
        setDocumentsList(documentsList.filter(doc => doc.id !== id));
        console.log(`Deleted document with ID: ${id}`);
    };
    
    const t = useTranslations('Document-Table');
    return (
        <TableContainer component={Paper} sx={{ width: '95%', marginLeft: '86px' }}>
            <Typography
                variant="h5"
                align="center"
                sx={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '16px' }}
            >
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
                        <TableCell>{t('docLAstChangeAt')}</TableCell>
                        <TableCell>{t('syncDms')}</TableCell>
                        <TableCell>{t('syncAcaunting')}</TableCell>
                        <TableCell>{t('Actions')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {documentsList.map((document) => (
                        <TableRow key={document.id}>
                            <TableCell>{document.name}</TableCell>
                            <TableCell>{document.type}</TableCell>
                            <TableCell>{document.size}</TableCell>
                            <TableCell>{document.name}</TableCell>
                            <TableCell>{document.type}</TableCell>
                            <TableCell>{document.size}</TableCell>
                            <TableCell>{document.name}</TableCell>
                            <TableCell>{document.type}</TableCell>
                            <TableCell>{document.size}</TableCell>
                            <TableCell>{document.createdAt}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleEdit(document.id)}>
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(document.id)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DocumentTable;

"use client";

import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { useRouter } from "next/navigation";
import ToggleSwitch from "@/components/toggleBtn";
import VisibilityIcon from "@mui/icons-material/Visibility";
// @ts-expect-error
import CryptoJS from 'crypto-js';
import apiService from "@/app/services/apiService";
import { enqueueSnackbar } from "notistack";
import { useTranslations } from 'next-intl';



type Order = "asc" | "desc";

type TableHelperType = {
    title?: string
    tenantData?: any
}

export default function TableHelperDmsConfig({ title }: TableHelperType) {
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<keyof Data>("username");
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const router = useRouter();
    const [rows, setRows] = React.useState<Data[]>([]);  // Zustand für die Zeilen
    const [role, setRoles] = React.useState('');
    console.log(rows);
    const t = useTranslations('API');

    // Data und TenantData Typen
    type Data = {
        id: number;
        tenant_id?: number;
        type: string;
        endpoint_url: string;
        username: string;
        api_key: string | null;
        repository: string;
        extra_settings?: string; // JSON string (needs parsing for structured data)

    };


    React.useEffect(() => {
        const fetchData = async () => {

            const getToken: any = sessionStorage.getItem('AuthToken');
            const response: any = await apiService.get("dms-config", getToken);
            if (response instanceof Error) {
                const { status, variant, message } = apiService.CheckAndShow(response, t);
                console.log(message);
                // @ts-ignore
                enqueueSnackbar(message, { variant: variant });
            }

            setRows(response.data[0]);
            if (response.status === 200) {
                enqueueSnackbar('DMS Config data fetched successfully!', { variant: 'success' });
            }

        }

        fetchData();
    }, []);




    // Lade die Daten

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            const newSelected = rows.map((row) => row.id);  // Mappe durch die Zeilen, um alle auszuwählen
            setSelected(newSelected);
        } else {
            setSelected([]);  // Leere die Auswahl, wenn das Kontrollkästchen nicht markiert ist
        }
    };


    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }




    // interface HeadCell {
    //   disablePadding: boolean;
    //   id: keyof Data;
    //   label: string;
    //   numeric: boolean;
    // }

    const headCells: any = [
        {
            id: "username",
            numeric: false,
            disablePadding: true,
            label: "username",
        },
        {
            id: "tenant_id",
            numeric: false, // Text, daher numeric: false
            disablePadding: false,
            label: "tenant_id",
        },
        {
            id: "type",
            numeric: false, // Text, daher numeric: false
            disablePadding: false,
            label: "type",
        },
        {
            id: "endpoint_url",
            numeric: false, // Text, daher numeric: false
            disablePadding: false,
            label: "endpoint_url",
        },
        {
            id: "api_key",
            numeric: false, // Text, daher numeric: false
            disablePadding: false,
            label: "api_key",
        },
        {
            id: "repository",
            numeric: false,
            disablePadding: false,
            label: "repository",
        },

        {
            id: "actions",
            numeric: false,
            disablePadding: false,
            label: "Actions",
        },
    ];

    interface EnhancedTableProps {
        numSelected: number;
        onRequestSort: (
            event: React.MouseEvent<unknown>,
            property: keyof Data
        ) => void;
        onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
        order: Order;
        orderBy: string;
        rowCount: number;
    }

    function EnhancedTableHead(props: EnhancedTableProps) {
        const {
            onSelectAllClick,
            order,
            orderBy,
            numSelected,
            rowCount,
            onRequestSort,
        } = props;
        const createSortHandler =
            (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
                onRequestSort(event, property);
            };

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                "aria-label": "select all desserts",
                            }}
                            className="TableCell"
                        />
                    </TableCell>
                    {headCells.map((headCell: any) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? "right" : "left"}
                            padding={headCell.disablePadding ? "none" : "normal"}
                            sortDirection={orderBy === headCell.id ? order : false}
                            className="TableHeader"
                        >
                            <TableSortLabel
                                className="tableFont"
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : "asc"}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === "desc" ? "sorted descending" : "sorted ascending"}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }
    interface EnhancedTableToolbarProps {
        numSelected: number;
    }



    function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
        const { numSelected } = props;
        return (
            <Toolbar
                sx={[
                    {
                        pl: { sm: 2 },
                        pr: { xs: 1, sm: 1 },
                    },
                    numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(
                                theme.palette.primary.main,
                                theme.palette.action.activatedOpacity
                            ),
                    },
                ]}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: "1 1 100%" }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: "1 1 100%" }}
                        variant="h4"
                        id="tableTitle"
                        component="div"
                        textAlign={"center"}
                    >
                        {title}
                    </Typography>
                )}
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton>
                            <DeleteIcon className="DeleteIconOnTable" />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip className="FilterList" title="Filter list">
                        <IconButton>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        );
    }


    React.useEffect(() => {

        const ciphertext = sessionStorage.getItem('user');
        if (ciphertext) {
            const bytes = CryptoJS.AES.decrypt(ciphertext, 'secret-key');
            const getRole = bytes.toString(CryptoJS.enc.Utf8);
            if (!getRole) {
                router.push('/dashboard');
                return;
            }
            setRoles(getRole)
        }
    }, [router]);


    const handleRowClick = (id: number) => {
        console.log(id);
        if (role === "admin") {
            router.push(`/dashboard/admin/dms-config/${id}`);
        } else if (role === "superadmin") {
            router.push(`/dashboard/superadmin/dms-config/${id}`);
        }

    };

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data
    ) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };


    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };


    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(() => {
        // Definiere getComparator innerhalb von useMemo
        // const getComparator = (order: Order, orderBy: keyof Data) => {
        //   return order === "desc"
        //     ? (a: Data, b: Data) => descendingComparator(a, b, orderBy)
        //     : (a: Data, b: Data) => -descendingComparator(a, b, orderBy);
        // };

        return rows
        // [...rows]
        //   .sort(getComparator(order, orderBy))
        //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [rows, order, orderBy, page, rowsPerPage]); // Füge die Abhängigkeiten hinzu

    return (
        <Box
            id="BoxTable"
            sx={{
                position: "relative",
                left: "83px",
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                width: "95%",
                flexDirection: "column",
            }}
        >
            <Paper sx={{ mb: 1 }} className="TablePaper">
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer
                    sx={{
                        overflow: "hidden",
                    }}
                >
                    <Table
                        sx={{
                            border: "1px solid #eee",
                            minWidth: "100%",
                        }}
                        aria-labelledby="tableTitle"
                        size={dense ? "small" : "medium"}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = selected.includes(row?.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => {
                                            handleClick(event, row?.id);
                                        }}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row?.id}
                                        selected={isItemSelected}
                                        className="tableRow"

                                    // ---------------------------
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    "aria-labelledby": labelId,
                                                }}
                                                className="tableFont"
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                            className="tableFont"
                                        >
                                            {row?.username}
                                        </TableCell>

                                        <TableCell className="tableFont" align="left">
                                            {row?.tenant_id}
                                        </TableCell>
                                        <TableCell className="tableFont" align="left">
                                            {row?.type}
                                        </TableCell>
                                        <TableCell className="tableFont" align="left">
                                            {row?.endpoint_url}
                                        </TableCell>
                                        <TableCell className="tableFont" align="left">
                                            {row?.api_key}
                                        </TableCell>
                                        <TableCell className="tableFont" align="left">
                                            {row?.repository}
                                        </TableCell>
                                        {/* <TableCell className="tableFont" align="left">
                                            {row.is_active}
                                        </TableCell> */}
                                        <TableCell className="tableFont" align="left">
                                            <button
                                                style={{
                                                    width: "50px",
                                                    backgroundColor: "#1976d2",
                                                    height: "auto",
                                                    color: "#fff",
                                                    cursor: "pointer",
                                                    borderRadius: "15px",
                                                }}
                                                onClick={() => handleRowClick(row.id)}
                                            >
                                                <VisibilityIcon />
                                                <div style={{ position: "absolute", margin: "0", padding: "0", opacity: "0" }}>
                                                    {row?.id}
                                                </div>
                                            </button>
                                        </TableCell>

                                        <ToggleSwitch align="left" />
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    className="TableFooter"
                />
            </Paper>
            <FormControlLabel
                style={{
                    marginLeft: "10px",
                    width: "fit-content",
                }}
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );
}

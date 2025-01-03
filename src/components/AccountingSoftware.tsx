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

import apiService from "@/app/services/apiService";
type Order = "asc" | "desc";

type TableHelperType = {
  title?: string
  tenantData?: any
}

export default function TableHelperAccountingSoftware({ title }: TableHelperType) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("name");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const router = useRouter();
  const [rows, setRows] = React.useState<Data[]>([]);  // Zustand für die Zeilen

  console.log(rows);


  // Data und TenantData Typen
  type Data = {
    id: number;
    tenant_id: number;
    name: string;
    type: string;
    url: string;
    organization_id: string;
    event_type: string | null;
    description: string;

    is_active: number;
  };

  type TenantData = {
    id: number;
    company_name: string;
    address: string;
    invoice_address: string;
    license_valid_until: string;
    contact_email: string;
    invoice_email: string;
    contact_phone: string;
    actions: boolean

  };





  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // const getToken: any = sessionStorage.getItem('AuthToken');
        // const response: any = await apiService.get("tenant", getToken);
        // console.log(response);
        // // Перевірка на наявність необхідних даних у відповіді

        const Data: any = [
          {
            "id": 1,
     
            "name": "Lexoffice",
            "type": "lexoffice-cloud",
            "url": "https://api.lexoffice.io",
            "organization_id": "fb2344db-582e-4291-bf0e-87c9e647e8f9",
            "event_type": null,
            "description": "Cloud-based accounting software for small businesses.",
            "is_active": 0,
          }
        ];
        console.log(Data);

        setRows(Data);  // Зберігаємо дані в стан

      } catch (error) {
        console.error('Помилка при отриманні даних:', error);
      }
    };

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
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "name",
    },
    {
      id: "type",
      numeric: false, // Text, daher numeric: false
      disablePadding: false,
      label: "type",
    },
    {
      id: "url",
      numeric: false, // Text, daher numeric: false
      disablePadding: false,
      label: "url",
    },
    {
      id: "organization_id",
      numeric: false, // Text, daher numeric: false
      disablePadding: false,
      label: "organization_id",
    },
    {
      id: "event_type",
      numeric: false, // Text, daher numeric: false
      disablePadding: false,
      label: "event_type",
    },
    {
      id: "description",
      numeric: false,
      disablePadding: false,
      label: "description",
    },
    {
      id: "is_active",
      numeric: false,
      disablePadding: false,
      label: "is_active",
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


  const handleRowClick = (id: number) => {
    console.log(id);

    router.push(`/dashboard/superadmin/tenant/${id}`);
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
        left: "65px",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        width: "100%",
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
                      handleClick(event, row.id);
                    }}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
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
                      {row.name}
                    </TableCell>

                    <TableCell className="tableFont" align="left">
                      {row.type}
                    </TableCell>
                    <TableCell className="tableFont" align="left">
                      {row.url}
                    </TableCell>
                    <TableCell className="tableFont" align="left">
                      {row.organization_id}
                    </TableCell>
                    <TableCell className="tableFont" align="left">
                      {row.event_type}
                    </TableCell>
                    <TableCell className="tableFont" align="left">
                      {row.description}
                    </TableCell>
                    <TableCell className="tableFont" align="left">
                      {row.is_active}
                    </TableCell>
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
                          {row.id}
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

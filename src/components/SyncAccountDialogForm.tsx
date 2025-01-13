import { Box, Checkbox, FilledTextFieldProps, FormControlLabel, FormLabel, OutlinedTextFieldProps, Radio, RadioGroup, StandardTextFieldProps, TextField, TextFieldVariants } from "@mui/material"
import { JSX, useState } from "react";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';




type DmsDialogFormType = {
    selectedOption: string | undefined
}

const boxStyle = {
    width: '95%',
    margin: 'auto',
    marginBottom: '20px'
}

const DmsDialogForm = ({ selectedOption }: DmsDialogFormType) => {

    const [selectedType, setSelectedType] = useState("");


    const [formData, setFormData] = useState({
        name: "",
        host: "",
        port: "",
        username: "",
        password: "",
        path: "",
        syncIntoFolder: false,
        noSubFolder: false,
        dateRange: "currentMonth",
        relatedTo: "importDate",
        syncAllInvoices: true,
    });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleDateChange = (newDate: Date | null) => {
        setSelectedDate(newDate);
        // Якщо потрібно зберегти в formData
        // setFormData((prevState) => ({
        //     ...prevState,
        //     dateRange: newDate,
        // }));
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedType(event.target.value);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };


    return (

        <>
            <Box sx={{ ...boxStyle }}>
                {selectedOption === "EcoDms" && (
                    <>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="EcoDMS Host"
                            name="host"
                            value={formData.host}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="EcoDMS Port"
                            name="port"
                            value={formData.port}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="EcoDMS Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="EcoDMS Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Path"
                            name="path"
                            value={formData.path}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="syncIntoFolder"
                                    checked={formData.syncIntoFolder}
                                    onChange={handleInputChange}
                                />
                            }
                            label="Sync all into one folder"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="noSubFolder"
                                    checked={formData.noSubFolder}
                                    onChange={handleInputChange}
                                />
                            }
                            label="No sub-folder for accounts"
                        />
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <FormLabel>Date Range</FormLabel>
                            <RadioGroup
                                name="dateRange"
                                value={formData.dateRange}
                                onChange={handleInputChange}
                                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
                            >
                                <FormControlLabel
                                    value="currentMonth"
                                    control={<Radio />}
                                    label="Current Month"
                                />
                                <FormControlLabel
                                    value="last3Months"
                                    control={<Radio />}
                                    label="Last 3 Months"
                                />
                                <FormControlLabel
                                    value="afterCertainDate"
                                    control={<Radio />}
                                    label="After certain date"
                                />
                            </RadioGroup>
                        </Box>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ mt: 2, mb: 2, width: '100%' }}>
                                {/* <FormLabel>Date</FormLabel> */}
                                <DatePicker
                                    sx={{ width: '100%' }}
                                    label="Select Date"
                                    //@ts-ignore
                                    value={selectedDate}
                                    //@ts-ignore
                                    onChange={handleDateChange}
                                    //@ts-ignore
                                    renderInput={(params) => <TextField  {...params} fullWidth />}
                                />
                            </Box>
                        </LocalizationProvider>
                        <FormControlLabel
                            control={
                                <Radio
                                    name="relatedTo"
                                    value="importDate"
                                    checked={formData.relatedTo === "importDate"}
                                    onChange={handleInputChange}
                                />
                            }
                            label="Import Date"
                        />
                        <FormControlLabel
                            control={
                                <Radio
                                    name="relatedTo"
                                    value="invoiceDate"
                                    checked={formData.relatedTo === "invoiceDate"}
                                    onChange={handleInputChange}
                                />
                            }
                            label="Invoice Date"
                        />
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="syncAllInvoices"
                                        checked={formData.syncAllInvoices}
                                        onChange={handleInputChange}
                                    />
                                }
                                label="Sync All Invoices"
                            />

                        </Box>
                    </>
                )}

            </Box>
        </>
    )

}

export default DmsDialogForm;
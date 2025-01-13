import { Box, Checkbox, FilledTextFieldProps, FormControlLabel, FormLabel, OutlinedTextFieldProps, Radio, RadioGroup, StandardTextFieldProps, TextField, TextFieldVariants } from "@mui/material"
import { JSX, useState } from "react";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTranslations } from 'next-intl';



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
    const t = useTranslations('API');

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
                            label={t("name")}
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label={t("ecoDmsHost")}
                            name="host"
                            value={formData.host}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label={t("ecoDmsPort")}
                            name="port"
                            value={formData.port}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label={t("ecoDmsUsername")}
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label={t("ecoDmsPassword")}
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label={t("path")}
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
                            label={t("syncIntoFolder")}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="noSubFolder"
                                    checked={formData.noSubFolder}
                                    onChange={handleInputChange}
                                />
                            }
                            label={t("noSubFolder")}
                        />
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <FormLabel>{t("dateRange")}</FormLabel>
                            <RadioGroup
                                name="dateRange"
                                value={formData.dateRange}
                                onChange={handleInputChange}
                                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
                            >
                                <FormControlLabel
                                    value="currentMonth"
                                    control={<Radio />}
                                    label={t("currentMonth")}
                                />
                                <FormControlLabel
                                    value="last3Months"
                                    control={<Radio />}
                                    label={t("last3Months")}
                                />
                                <FormControlLabel
                                    value="afterCertainDate"
                                    control={<Radio />}
                                    label={t("afterCertainDate")}
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
                            label={t("importDate")}
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
                            label={t("invoiceDate")}
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
                                label={t("syncAllInvoices")}
                            />
                        </Box>
                    </>
                )}

            </Box>
        </>
    )

}

export default DmsDialogForm;
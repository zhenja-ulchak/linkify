"use client";
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import LocaleSwitcher from "../../components/LocaleSwitcher";
import { useTranslations } from "next-intl";
import apiService from "@/app/services/apiService";
import { enqueueSnackbar } from "notistack";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [houseNumber, setHouseNumber] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [addressSupplement, setAddressSupplement] = useState<string>("");
  {
    /* invoice-address */
  }
  const [invoiceStreet, setInvoiceStreet] = useState<string>("");
  const [invoiceHouseNumber, setInvoiceHouseNumber] = useState<string>("");
  const [invoicePostalCode, setInvoicePostalCode] = useState<string>("");
  const [invoiceCity, setInvoiceCity] = useState<string>("");
  const [invoiceRegion, setInvoiceRegion] = useState<string>("");
  const [invoiceCountry, setInvoiceCountry] = useState<string>("");
  const [invoiceAddressSupplement, setInvoiceAddressSupplement] =
    useState<string>("");
  {
    /* invoice-address */
  }
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [showPasswords, setShowPasswords] = useState<boolean>(false);
  const [company, setCompany] = useState<string>("");
  const [contact_email, setContact_email] = useState<string>("");
  const [invoice_email, setInvoice_email] = useState<string>("");
  const [formData, setFormData] = useState<any>({
    language: "",
  });

  const [errorMessage, setErrorMessage] = useState<string>(""); // Fehlernachricht invoice_email
  const [successMessage, setSuccessMessage] = useState<string>("");

  const t = useTranslations("API");
  // Erfolgsnachricht
  const router = useRouter();

  const border = {
    borderRadius: "5px",
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Fehlernachricht zurücksetzen
    setSuccessMessage(""); // Erfolgsnachricht zurücksetzen

    // if (username.length < 4) {
    //   setErrorMessage(t('Registrierung.benutzername-muss'));
    //   return;
    // }

    // Erlaubt nur alphanumerische Zeichen
    // const usernameRegex = /^[a-zA-Z0-9]+$/;
    // if (!usernameRegex.test(username)) {
    //   setErrorMessage(t('Registrierung.darf'));
    //   return;
    // }

    if (password !== confirmPassword) {
      setErrorMessage(t("Registrierung.passworter"));
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage(t("Registrierung.pass-muss"));
      return;
    }

    const allAdress = `${addressSupplement}, ${street} ${houseNumber}, ${postalCode} ${city}, ${region}, ${country}`;

    const allInvoiceAdress = `${invoiceAddressSupplement}, ${invoiceStreet} ${invoiceHouseNumber}, ${invoicePostalCode} ${invoiceCity}, ${invoiceRegion}, ${invoiceCountry}`;

    const dataObj = {
      first_name: firstName,
      last_name: lastName,
      address: allAdress,
      email: email,
      password,
      password_confirmation: password,
      username: email,
      company_name: company,
      invoice_address: allInvoiceAdress,
      tarif: "free",
      contact_phone: phone,
      language: formData.language,
      contact_email: contact_email,
      invoice_email: invoice_email,
    };

    const getToken: any = sessionStorage.getItem("AuthToken");

    const response: any = await apiService.post(
      `service/register`,
      dataObj,
      getToken
    );

    // Erfolgreiche Registrierung
    if (response instanceof Error) {
      const { status, variant, message } = apiService.CheckAndShow(response, t);

      // @ts-ignore
      enqueueSnackbar(message, { variant: variant });
    }

    if (response.success === true || response.status === 200) {
      enqueueSnackbar("Accounting data fetched successfully!", {
        variant: "success",
      });
      router.push("/login");
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    setFormData((prevData: any) => ({
      ...prevData,
      language: newValue, // Зміна мови
    }));
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <>
      <div
        className="locale-switcher-container"
        style={{ position: "absolute", top: "13px", left: "66px" }}
      >
        <LocaleSwitcher />
      </div>
      <Button
        id="LoginBtnOnRegisterPage"
        sx={{ float: "right", marginRight: "10px", marginTop: "10px" }}
        variant="outlined"
        onClick={handleLogin}
      >
        {t("Registrierung.zuruck")}
      </Button>

      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minWidth="100%"
          minHeight="100vh"
        >
          <Box
            sx={{ marginTop: "69px", marginBottom: "50px" }}
            component="form"
            onSubmit={handleRegister}
            display="flex"
            flexDirection="column"
            gap={2}
            width="100%"
          >
            <Typography
              sx={{ textAlign: "center" }}
              variant="h4"
              component="h2"
              gutterBottom
            >
              {t("Registrierung.registrierung")}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  sx={{ textAlign: "center" }}
                  variant="h4"
                  component="h2"
                  gutterBottom
                >
                  {t("address-registration")}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.vorname")}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.nachname")}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.adresse")}
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.hausnummer")}
                  type="text"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.postleitzahl")}
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.ort")}
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.region")}
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.land")}
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.adresszusatz")}
                  type="text"
                  value={addressSupplement}
                  onChange={(e) => setAddressSupplement(e.target.value)}
                  fullWidth
                  style={border}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.firma")}
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  fullWidth
                  style={border}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  sx={{ textAlign: "center" }}
                  variant="h4"
                  component="h2"
                  gutterBottom
                >
                  {t("invoice-address")}
                </Typography>
              </Grid>

              {/* invoice-address */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.invoice-adresse")}
                  type="text"
                  value={invoiceStreet}
                  onChange={(e) => setInvoiceStreet(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.invoice-hausnummer")}
                  type="text"
                  value={invoiceHouseNumber}
                  onChange={(e) => setInvoiceHouseNumber(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.invoice-postleitzahl")}
                  type="text"
                  value={invoicePostalCode}
                  onChange={(e) => setInvoicePostalCode(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.invoice-ort")}
                  type="text"
                  value={invoiceCity}
                  onChange={(e) => setInvoiceCity(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.invoice-region")}
                  type="text"
                  value={invoiceRegion}
                  onChange={(e) => setInvoiceRegion(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t("Registrierung.invoice-land")}
                  type="text"
                  value={invoiceCountry}
                  onChange={(e) => setInvoiceCountry(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label={t("Registrierung.invoice-adresszusatz")}
                  type="text"
                  value={invoiceAddressSupplement}
                  onChange={(e) => setInvoiceAddressSupplement(e.target.value)}
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label={t("Registrierung.Invoice_email")}
                  type="email"
                  value={invoice_email}
                  onChange={(e) => setInvoice_email(e.target.value)}
                  fullWidth
                  style={border}
                />
              </Grid>

              {/* <Grid item xs={12} sm={6}>
                <TextField
                  label={t('Registrierung.invoice-firma')}
                  type="text"
                  value={invoiceСompany}
                  onChange={(e) => setInvoiceCompany(e.target.value)}
                  fullWidth
                  style={border}
                />
              </Grid> */}

              {/* invoice-address */}

              <Grid item xs={12}>
                <Typography
                  sx={{ textAlign: "center" }}
                  variant="h4"
                  component="h2"
                  gutterBottom
                >
                  {t("details-registration")}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{t("Language")}</InputLabel>
                  <Select
                    value={formData.language || ""}
                    onChange={handleSelectChange}
                    label={t("Language")}
                  >
                    <MenuItem value="ua">UA (Українська)</MenuItem>
                    <MenuItem value="ru">RU (Русский)</MenuItem>
                    <MenuItem value="en">EN (English)</MenuItem>
                    <MenuItem value="es">ES (Español)</MenuItem>
                    <MenuItem value="de">DE (Deutsch)</MenuItem>{" "}
                    {/* Виправлено з "німецька" на "Deutsch" */}
                    <MenuItem value="zh-CH">ZH (中文 - Китайська)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t("Registrierung.Contact_email")}
                  type="email"
                  value={contact_email}
                  onChange={(e) => setContact_email(e.target.value)}
                  fullWidth
                  style={border}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label={t("Registrierung.benutzername")}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t("phone")}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t("Registrierung.passwort")}
                  type={showPasswords ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  className="ContainerVisibility"
                  style={border}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? (
                            <VisibilityOffIcon className="VisibilityOFF" />
                          ) : (
                            <VisibilityIcon className="VisibilityONN" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t("Registrierung.passwort-bestatigen")}
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  fullWidth
                  className="ContainerVisibility"
                  style={border}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? (
                            <VisibilityOffIcon className="VisibilityOFF" />
                          ) : (
                            <VisibilityIcon className="VisibilityONN" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                {errorMessage && (
                  <Typography color="error" variant="body2">
                    {errorMessage}
                  </Typography>
                )}
                {successMessage && (
                  <Typography color="green" variant="body2">
                    {successMessage}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained">
                  {t("Registrierung.registrierung")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;

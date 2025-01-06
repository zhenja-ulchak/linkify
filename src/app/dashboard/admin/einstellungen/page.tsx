"use client";
import React, { useState } from "react";
import {
  Button,
  Box,
  Container,
  Typography,
  Modal,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import EuroIcon from "@mui/icons-material/Euro";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";

const ConfigPage: React.FC = () => {
  const [openModal, setOpenModal] = useState<
    "email" | "dms" | "lexoffice" | null
  >(null);
  const [email, setEmail] = useState<string>("");
  const [dmsSetting, setDmsSetting] = useState<string>("");
  const [lexofficeSetting, setLexofficeSetting] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  // const dmsOptions = [
  //   { name: "SharePoint", type: "sharepoint", description: "Microsoft-based collaborative platform for document management and storage." },
  //   { name: "Eco-dms", type: "ecodms", description: "An affordable and efficient document management system for small businesses." },
  //   { name: "DocuWare", type: "docuware", description: "A cloud-based solution for managing documents and workflows." },
  //   { name: "M-Files", type: "mfiles", description: "An intelligent information management platform with metadata-driven architecture." },
  //   { name: "OpenText", type: "opentext", description: "A comprehensive enterprise information management solution." },
  //   { name: "Alfresco", type: "alfresco", description: "An open-source, enterprise-grade document management system." },
  //   { name: "Laserfiche", type: "laserfiche", description: "A digital transformation tool for managing and automating business processes." },
  // ];

  const dmsOptions = [
    "SharePoint",
   "Eco-dms",
    "DocuWare",
    "M-Files",
    "OpenText",
    "Alfresco",
    "Laserfiche",
  ];

  const filteredDmsOptions = dmsOptions.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const handleClose = () => {
    setOpenModal(null);
  };





  function handleClickOnProfile() {
    router.push("/dashboard/profile");
  }

  return (
// TODO FIX УДАЛИТИ МОДАЛКИ ЗРОБИТИ СИЛКИ НА ТАБЛИЦІ

    <Container className="ContainerConfigPage" maxWidth="sm">
      <Box className="BoxConfigPage">
        <Typography variant="h4" gutterBottom>
            Admin
        </Typography>

        {/* Email Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/dashboard/admin/SMTP-Email")}
          className="ConfigPageButton"
        >
          <Box className="BoxConfigPageButtonIcon">
            <EmailIcon className="ConfigPageButtonIcon" />
            <p className="ConfigPageFont">E-Mail anpassen</p>
          </Box>
        </Button>

        {/* DMS Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => router.push("/dashboard/admin/dms-config")}
          className="ConfigPageButton"
        >
          <Box className="BoxConfigPageButtonIcon">
            <FilePresentIcon className="ConfigPageButtonIcon" />
            <p className="ConfigPageFont">DMS anpassen</p>
          </Box>
        </Button>

        {/* Lexoffice Button */}
        <Button
          variant="contained"
          color="success"
          onClick={() => router.push("/dashboard/admin/accounting-software")}
          className="ConfigPageButton"
        >
          <Box className="BoxConfigPageButtonIcon">
            <EuroIcon className="ConfigPageButtonIcon" />
            <p className="ConfigPageFont">Accounting-Software</p>
          </Box>
        </Button>

        {/* Profil Button */}
        <Button
          variant="contained"
          color="warning"
          onClick={() => handleClickOnProfile()}
          className="ConfigPageButton"
        >
          <Box className="BoxConfigPageButtonIcon">
            <AccountCircleIcon className="ConfigPageButtonIcon" />
            <p className="ConfigPageFont">Profile anpassen</p>
          </Box>
        </Button>
      </Box>

      {/* Modal */}
      <Modal open={openModal !== null} onClose={handleClose}>
        <Box className="modalConfigPage">
          <Typography variant="h6" gutterBottom color="black">
            {openModal === "email" && "E-Mail anpassen"}
            {openModal === "dms" && "DMS anpassen"}
            {openModal === "lexoffice" && "Lexoffice anpassen"}
          </Typography>

          {openModal === "dms" ? (
            <>
              <TextField
                fullWidth
                margin="normal"
                variant="outlined"
                label="DMS suchen"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputLabelProps={{
                  style: { color: "black", fontWeight: "bold" },
                }}
              />
              <FormControl fullWidth margin="normal" >
                <InputLabel style={{ color: "black" }} >
                  DMS auswählen
                </InputLabel>
                <Select
                  labelId="dms-select-label"
                  value={dmsSetting}
                  onChange={(e) => setDmsSetting(e.target.value)}
                  variant="outlined"
                >
                  {filteredDmsOptions.length === 0 ? (
                    <MenuItem disabled>Keine Ergebnisse</MenuItem> // Wenn keine Ergebnisse, zeige "Keine Ergebnisse"
                  ) : (
                    filteredDmsOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </>
          ) : (
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label={
                openModal === "email" ? "Neue E-Mail" : "Lexoffice-Einstellung"
              }
              InputLabelProps={{
                style: { color: "black", fontWeight: "bold" },
              }}
              value={openModal === "email" ? email : lexofficeSetting}
              onChange={(e) =>
                openModal === "email"
                  ? setEmail(e.target.value)
                  : setLexofficeSetting(e.target.value)
              }
            />
          )}

          <Box display="flex" justifyContent="space-between" marginTop="16px">
            <Button variant="outlined" onClick={handleClose}>
              Abbrechen
            </Button>
        
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default ConfigPage;

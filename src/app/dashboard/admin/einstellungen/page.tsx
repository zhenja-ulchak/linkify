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
import { useTranslations } from "next-intl";

const ConfigPage: React.FC = () => {
  const [openModal, setOpenModal] = useState<
    "email" | "dms" | "lexoffice" | null
  >(null);
  const [email, setEmail] = useState<string>("");
  const [dmsSetting, setDmsSetting] = useState<string>("");
  const [lexofficeSetting, setLexofficeSetting] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const t = useTranslations("API");
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
    <Container sx={{marginTop:" 60px"}}>
      <Typography variant="h4" gutterBottom sx={{textAlign: 'center', marginBottom: '30px'}}>
      Settings Management
      </Typography>
      <Box
       className="BoxConfigPage"
       display="flex"
       flexDirection="row" // Змінили на рядок
       justifyContent="space-between" // Додаємо відстань між елементами в рядку
       gap={2} // Додаємо відстань між кнопкамипками
      >
        

        {/* Email Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/dashboard/admin/SMTP-Email")}
          className="ConfigPageButton"
          fullWidth // Робимо кнопку шириною на весь контейнер
        >
          <Box
            className="BoxConfigPageButtonIcon"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <EmailIcon className="ConfigPageButtonIcon" />
            <p className="ConfigPageFont">
              {t("einstellungen.email-anpassen")}
            </p>
          </Box>
        </Button>

        {/* DMS Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => router.push("/dashboard/admin/dms-config")}
          className="ConfigPageButton"
          fullWidth // Робимо кнопку шириною на весь контейнер
        >
          <Box
            className="BoxConfigPageButtonIcon"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FilePresentIcon className="ConfigPageButtonIcon" />
            <p className="ConfigPageFont">{t("einstellungen.dms-anpassen")}</p>
          </Box>
        </Button>

        {/* Lexoffice Button */}
        <Button
          variant="contained"
          color="success"
          onClick={() => router.push("/dashboard/admin/accounting-software")}
          className="ConfigPageButton"
          fullWidth // Робимо кнопку шириною на весь контейнер
        >
          <Box
            className="BoxConfigPageButtonIcon"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <EuroIcon className="ConfigPageButtonIcon" />
            <p className="ConfigPageFont">
              {t("einstellungen.accounting-software")}
            </p>
          </Box>
        </Button>

        {/* Profil Button */}
        <Button
          variant="contained"
          color="warning"
          onClick={() => handleClickOnProfile()}
          className="ConfigPageButton"
          fullWidth // Робимо кнопку шириною на весь контейнер
        >
          <Box
            className="BoxConfigPageButtonIcon"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <AccountCircleIcon className="ConfigPageButtonIcon" />
            <p className="ConfigPageFont">
              {t("einstellungen.profile-anpassen")}
            </p>
          </Box>
        </Button>
      </Box>
    </Container>
  );
};

export default ConfigPage;

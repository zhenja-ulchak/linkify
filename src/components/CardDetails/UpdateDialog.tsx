"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Для URL параметрів і маршрутизатора
import {
  Typography,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useTranslations } from "next-intl";
import ApiService from "@/app/services/apiService";
import ConfirmChangeModal from "../modal/confirmDialog/ConfirmationModalDialog";
import DmsDialogForm from "../SyncAccountDialogForm";

type DetailsFormUpdateType = {
  tenant: any;
  openCard?: boolean;
};

const DetailsFormUpdate = ({ tenant, openCard }: DetailsFormUpdateType) => {
  const [isEditing, setIsEditing] = useState(false);

  const [modalTextColor, setModalTextColor] = useState("black");
  const [tenantDetails, setTenantDetails] = useState<any>();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    password: "",
    confirmationPassword: "",
  });
  // const [selectedOption, setSelectedOption] = useState(tenantDetails?.type);
  const t = useTranslations("API");

  const [initialTenant, setInitialTenant] = useState<any>();
  const [extraSettings, setExtraSettings] = useState<Record<string, string>>(
    {}
  );
  const [checked, setChecked] = useState(true); // Початкове значення - true (defaultChecked)
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setChecked(event.target.checked); // Оновлення стану
    console.log("Чекбокс значення:", event.target.checked);
  };
  console.log(checked);

  // Ініціалізація extra_settings при першому рендері
  useEffect(() => {
    if (tenant?.extra_settings) {
      try {
        setExtraSettings(JSON.parse(tenant?.extra_settings));
      } catch (error) {
        console.error(
          "Invalid JSON format in extra_settings:",
          tenant?.extra_settings
        );
      }
    }
  }, [tenant?.extra_settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleSelectChange = (event: SelectChangeEvent<string>) => {
  //   const newValue = event.target.value;
  //   setSelectedOption(newValue);
  //   setUpdatedTenant((prevTenant: any) => ({
  //     ...prevTenant,
  //     type: newValue,
  //   }));
  // };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setInitialTenant((prevTenant: any) => ({
      ...prevTenant,
      [name]: value,
    }));

    // Оновлюємо tenant через setTenantDetails
    setTenantDetails((prevTenant: any) => ({
      ...prevTenant,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    const Auth: any = sessionStorage.getItem("AuthToken");
    let apiUrlGet = " ";
    if (tenant?.type === "EcoDms") {
      apiUrlGet = "dms-config/ping";
    } else if (tenant?.type === "lexoffice-cloud") {
      apiUrlGet = "accounting-software/ping";
    }

    const responseCheck: any = await ApiService.get(apiUrlGet, Auth);

    if (checked) {
      if (responseCheck.status === 200 || responseCheck.success === true) {
        apiPutStart(initialTenant);
      } else {
        setModalOpen(true);
      }
    } else {
      apiPutStart(initialTenant);
    }

    setIsEditing(false);
  };

  const handleConfirmNew = () => {
    apiPutStart(initialTenant);
    setModalOpen(false);
    setOpen(false);
  };

  const handleRevertOld = () => {
    setModalOpen(false);
    setOpen(false);
  };

  const apiPutStart = async (obj: any) => {
    const Auth: any = sessionStorage.getItem("AuthToken");
    let apiUrl = " ";
    if (tenant?.type === "EcoDms") {
      apiUrl = "dms-config";
    } else if (tenant?.type === "lexoffice-cloud") {
      apiUrl = "accounting-software";
    }
    const response: any = await ApiService.put(`/${tenant.id}`, obj, Auth);

    if (response instanceof Error) {
      const { status, variant, message } = ApiService.CheckAndShow(response, t);

      // @ts-ignore
      enqueueSnackbar(message, { variant: variant });
      setOpen(false);
    }

    if (response.status === 200 || response.success === true) {
      enqueueSnackbar("Accounting entry updated successfully!", {
        variant: "success",
      });
      setOpen(false);
    }

    setOpen(false);
  };

  const openModalDetails = () => {
    setOpen(true);
  };

  const excludedFields = [
    "id",
    "created_at",
    "updated_at",
    "deleted_at",
    "tenant_id",
    "updated_by",
    "updated_by",
    "created_by",
  ];

  useEffect(() => {
    if (openCard) {
      setOpen(openCard);
    } else {
      setOpen(false);
    }
  }, [openCard]);

  useEffect(() => {
    const bodyBackgroundColor = window.getComputedStyle(
      document.body
    ).backgroundColor;
    setModalTextColor(
      bodyBackgroundColor === "rgb(0, 0, 0)" ? "black" : "black"
    );
  }, [isEditing]);

  useEffect(() => {
    setTenantDetails({
      ...tenant,
      type: tenant?.type || "", // Забезпечуємо, що тип має значення
    });
  }, [tenant]);

  console.log(openCard);

  return (
    <div
      id="UserDetailContainer"
      style={{
        display: "flex",
        justifyContent: "center",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <Button onClick={openModalDetails} size="small" color="primary">
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {t("Accounting-Software.changeaccounting")}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSaveChanges}>
            {tenant &&
              Object.keys(tenant)
                .filter((key) => !excludedFields.includes(key))
                .map((key) => {
                  if (key === "extra_settings") {
                    // Відображаємо інпути для кожного налаштування в extraSettings
                    return Object.keys(extraSettings).map((subKey, index) => (
                      <Box key={`${key}-${subKey}-${index}`}>
                        <TextField
                          sx={{ marginBottom: 2 }}
                          id={subKey}
                          name={subKey}
                          value={extraSettings[subKey] || ""}
                          onChange={(e) => {
                            const { name, value } = e.target;

                            // Оновлення стану extraSettings
                            setExtraSettings((prevSettings) => ({
                              ...prevSettings,
                              [name]: value,
                            }));

                            setTenantDetails((prevTenant: any) => ({
                              ...prevTenant,
                              [key]: JSON.stringify({
                                ...extraSettings,
                                [name]: value,
                              }),
                            }));
                          }}
                          label={t(`extra_settings.${subKey}`)}
                          variant="outlined"
                          fullWidth
                        />
                      </Box>
                    ));
                  }
                  console.log(key);

                  // Інші поля
                  return (
                    <Box key={key}>
                      <TextField
                        sx={{ marginBottom: 2 }}
                        id={key}
                        name={key}
                        //@ts-ignore
                        value={tenantDetails[key] || ""}
                        onChange={(e) => handleEditChange(e)} // Використовуємо handleEditChange
                        label={t(`fields.${key}`)}
                        variant="outlined"
                        fullWidth
                      />
                    </Box>
                  );
                })}
            {tenant &&
              Object.keys(tenant)
                .filter((key) => !excludedFields.includes(key))
                .map((key) => {
                  console.log(tenant[key]);
                  if (tenant[key] === "EcoDms") {
                    return <DmsDialogForm selectedOption={"EcoDms"} />;
                  }
                })}
          </form>
        </DialogContent>

        {/* <DialogActions
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              textAlign: "left",
              "@media (max-width: 600px)": {
                flexBasis: "100%",
              },
            }}
          >
            <FormGroup sx={{ marginLeft: "15px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked} // Зв'язуємо стан зі значенням чекбокса
                    onChange={handleChange} // Викликаємо функцію зміни стану
                  />
                }
                label="check the work"
              />
            </FormGroup>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              flexBasis: "30%",
              "@media (max-width: 600px)": {
                flexBasis: "100%",
                justifyContent: "center",
              },
            }}
          >
            <Button onClick={handleClose} variant="outlined">
              {t("Accounting-Software.cancel")}
            </Button>
            <Button type="submit" color="primary" variant="contained">
              {t("Accounting-Software.ok")}
            </Button>
          </Box>
        </DialogActions> */}
      </Dialog>
      <ConfirmChangeModal
        open={modalOpen}
        title="Підтвердження змін"
        description="Ви хочете залишити нове значення чи повернути старе?"
        onConfirmNew={handleConfirmNew}
        onRevertOld={handleRevertOld}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default DetailsFormUpdate;

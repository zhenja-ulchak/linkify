"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Для URL параметрів і маршрутизатора
import ApiService from "../../../src/app/services/apiService";
import { Button, Grid } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useTranslations } from "next-intl";

import ConfirmDeleteModal from "@/components/modal/ConfirmDeleteModal";

const DetailsDelete: React.FC = () => {
  const router = useRouter();

  const id = useParams();

  const t = useTranslations("API");
  const [openModal, setOpenModal] = useState(false);

  const handleDelete = async () => {
    const Auth: any = sessionStorage.getItem("AuthToken");
    const response: any = await ApiService.delete(
      `accounting-software/${id}`,
      Auth
    );

    if (response.success === true) {
      enqueueSnackbar("Accounting entry deleted successfully!", {
        variant: "success",
      });
      router.push("/dashboard/admin");
      setOpenModal(false);
    }
    if (response instanceof Error) {
      const { status, variant, message } = ApiService.CheckAndShow(response, t);

      // @ts-ignore
      enqueueSnackbar(message, { variant: variant });
      setOpenModal(false);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
      <Grid container spacing={2} style={{ width: "100%" }}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Grid container spacing={2}>
            <>
              <Grid item xs={12} display="flex" justifyContent="space-evenly">
                <Button onClick={handleOpenModal} size="small" color="error">
                  Delete
                </Button>
              </Grid>
            </>
          </Grid>
          <ConfirmDeleteModal
            open={openModal}
            title={t("delete")}
            handleDelete={handleDelete}
            onClose={handleCloseModal}
            description={t("delete-Accounting-Software")}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default DetailsDelete;

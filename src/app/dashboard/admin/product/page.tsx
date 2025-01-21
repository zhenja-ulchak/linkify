"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useParams } from "next/navigation";

import {
  getAccountingSoftware,
  getDmsConfig,
} from "@/app/services/updateDetailsApi";
import DetailsDelete from "@/components/CardDetails/DeleteDialog";
import DetailsFormUpdate from "@/components/CardDetails/UpdateDialog";
import apiService from "@/app/services/apiService";

export default function SuperAdminTenant() {
  const t = useTranslations("API");
  const { tenantId } = useParams();
  const [details, setDetails] = useState<any[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<any>(null); 
  useEffect(() => {
    const fetchDetails = async () => {
    
        const tenantString: any = sessionStorage.getItem("tenant");
        const tenant = JSON.parse(tenantString);
        const auth: any = sessionStorage.getItem("AuthToken");

        const [accountingResponse, dmsResponse] = await Promise.all([
          getAccountingSoftware(tenant?.id, auth),
          getDmsConfig(tenant?.id, auth),
        ]);

     

        if (
          accountingResponse instanceof Error ||
          dmsResponse instanceof Error
        ) {
          const { message, variant } = apiService.CheckAndShow(
            //@ts-ignore
            accountingResponse || dmsResponse,
            t
          );
             //@ts-ignore
          enqueueSnackbar(message, { variant });
        } else {
          const combinedDetails = [
            //@ts-ignore
            (accountingResponse?.data || []),
            //@ts-ignore
            ...(dmsResponse?.data[0] || []),
          ];
          setDetails(combinedDetails);
          enqueueSnackbar(t("accounting-entry-updated-successfully"), {
            variant: "success",
          });
        
      } 
    };

    fetchDetails();
  }, [t, tenantId]);
console.log(details);

const handleCardClick = (tenant: any) => {
  setSelectedTenant(tenant); // Зберігаємо вибраний об'єкт в стані
};

  return (
    <Box
      sx={{
        position: "relative",
        left: "78px",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {details.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ maxWidth: 345 }} onClick={() => handleCardClick(item)}>
              <CardActionArea>
                <CardMedia
                  sx={{ height: 140 }}
                  image={
                    item?.type === "lexoffice-cloud"
                      ? "/img/logo-lexoffice.jpg.webp"
                      : "/img/ecodms-one.webp"
                  }
                  title={item?.name || "No title"}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item?.name || "Unnamed"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {item?.description || "No description provided"}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                {/* Replace with your actual components */}
                <DetailsDelete />
                <DetailsFormUpdate tenant={selectedTenant} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

"use client";
import React from "react";
import ConfigPage from "./einstellungen/page";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import Speedometer from "@/components/SpeedometerAdmin";

export default function Admin() {
  const data = [
    { tenant_id: 100, document_type: "purchaseinvoice", total_documents: 115, total_amount: "22,340.68" },
    { tenant_id: 100, document_type: "downpaymentinvoice", total_documents: 7, total_amount: "3,530.81" },
    { tenant_id: 100, document_type: "deliverynote", total_documents: 436, total_amount: "0.00" },
    { tenant_id: 100, document_type: "quotation", total_documents: 104, total_amount: "189,297.58" },
    { tenant_id: 100, document_type: "orderconfirmation", total_documents: 63, total_amount: "140,753.06" },
    { tenant_id: 100, document_type: "salesinvoice", total_documents: 2, total_amount: "5,088.00" },
    { tenant_id: 100, document_type: "creditnote", total_documents: 15, total_amount: "6,509.02" },
    { tenant_id: 100, document_type: "invoice", total_documents: 3_025, total_amount: "2,008,621.20" }

  ];
  

  return (
    <>
 

      <div
        style={{
          width: "100%",
          height: "10%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Admin</h1>
      </div>
      <Box
        sx={{
          position: "relative",

          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          width: "95%",
          margin: "auto",
          flexDirection: "column",
          "@media (max-width: 480px)": {
            position: "relative",
            left: "0px",
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            width: "80%",
            flexDirection: "column",
            marginLeft: "-40px",
          },
          "@media (max-width: 1600px)": {
            position: "relative",
            left: "10px",
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            width: "80%",
            flexDirection: "column",
          },
        }}
      >
        <Grid container spacing={3}>
          {data.map((item, index) => (
            <>
              <Grid item xs={12} sm={3} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {item.document_type}
                    </Typography>
                    <Typography variant="h4" color="text.secondary">
                    {item.total_documents}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {item.total_amount}
                    </Typography>
                
                  </CardContent>
                </Card>
              </Grid>
            </>
          ))}
        </Grid>
        <Grid container spacing={3} sx={{ margin: "auto" }}>
          <Grid sx={{ textAlign: "center" }} item xs={12} sm={4}>
            {"ALL"}
            <Speedometer value="70" />
          </Grid>
          <Grid sx={{ textAlign: "center"  }} item xs={12} sm={4}>
            {"ACC_SYNCED"}
            <Speedometer value="20" />
          </Grid>
          <Grid sx={{textAlign: "center"  }} item xs={12} sm={4}>
            {"DMS_SYNCED"}
            <Speedometer  value="30" />
          </Grid>
        </Grid>
        <ConfigPage /> 
      </Box>

        
    </>
  );
}

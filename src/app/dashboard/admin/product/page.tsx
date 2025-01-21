"use client";
import React from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import DetailsFormUpdate from "@/components/CardDetails/UpdateDialog";


export default function SuperAdminTenant() {
  const t = useTranslations("API");
  const arrCard = [
    {
      id: 17,
      tenant_id: 100,
      name: "LXO-Alex GmbH",
      type: "lexoffice-cloud",
      url: "https://api.lexoffice.io",
      organization_id: null,
      event_type: null,
      description: "Intuitive accounting software for freelancers and SMEs.",
      additional_settings: {
        region: "DE",
      },
      is_active: true,
    },
    {
      id: 1,
      tenant_id: 1,
      type: "EcoDms",
      name: "EcoDms (JD)",
      description: "Intuitive EcoDms for freelancers and SMEs.",
      endpoint_url: "http://78.94.156.145",
      endpoint_local_url: "http://localhost",
      endpoint_port: "181801",
      endpoint_local_port: "81801",
      username: "ecodms",
      api_key: null,
      repository: "jd_repo",
      extra_settings: '{"setting1": "value1", "setting2": "value2"}',
   
    },
  ];



  return (
    <>
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
        {arrCard.map((i, index) => {
          return (
            <>
          <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    sx={{ height: 140 }}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="Contemplative Reptile"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                     {i?.name || ''}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                { i?.description || ''}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary">
                    Share
                  </Button>
                  <DetailsFormUpdate/>
                 
                </CardActions>
              </Card>
              </Grid>
            </>
          );
        })}
        </Grid>
      </Box>
    </>
  );
}

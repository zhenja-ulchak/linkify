"use client";

import React, { useEffect, useState } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PersonIcon from '@mui/icons-material/Person';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import EngineeringIcon from '@mui/icons-material/Engineering';


import { Url } from "next/dist/shared/lib/router/router";
import Logout from "./Logout";
import { useRouter } from "next/navigation";
import ChangeMode from "./DarkLightMode";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import Image from "next/image";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SecurityIcon from '@mui/icons-material/Security';
import axios from "axios";
// @ts-expect-error
import CryptoJS from 'crypto-js';
import apiService from "@/app/services/apiService";



const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

// Type für die Props anpassen
type MiniDrawerProps = {
  setIsSideBarOpen: (open: boolean) => void; // Funktion, die den Status setzt
};

export default function MiniDrawer({ setIsSideBarOpen }: MiniDrawerProps) {
  const theme = useTheme();

  const [TextRule, setTextRule] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDrawerOpen = () => {
    setOpen(true);
    setIsSideBarOpen(true); // Funktion mit true aufrufen
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setIsSideBarOpen(false); // Funktion mit false aufrufen
  };

  const handleNavigation = (path: Url) => {
    router.push(path as string);
  };





  const handleLogout = async () => {
    const getToken: any = sessionStorage.getItem('AuthToken');
    try {
      await apiService.get(`user/logout`, getToken);


    } catch (error) {
      console.error("Fehler beim Logout:", error);
    }

    router.push("/login");
    sessionStorage.clear()
  };





  useEffect(() => {
    const ciphertext = sessionStorage.getItem('user');
    if (ciphertext) {
      const bytes = CryptoJS.AES.decrypt(ciphertext, 'secret-key');
      const originalRole = bytes.toString(CryptoJS.enc.Utf8);
      setTextRule(originalRole);
      console.log(originalRole);
    }
  }, []);





  const handleImageClick = () => {
    router.push("/dashboard");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>

          <Image
            onClick={handleImageClick}
            src="\img\Linkify-Light.svg"
            alt="Linkify"
            width={150}
            height={50}
            style={{
              cursor: "pointer",
            }}
          />

          <ChangeMode color="#fff" />
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <List sx={{ minHeight: "360px" }} className="ListContainer">




          {/* ------------------------------------------- */}
          {(() => {
            switch (TextRule) {

              case 'user':
                return (<>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleNavigation("/dashboard/user")}>
                      <ListItemIcon className="DashboadAndTableIcon">
                        <DashboardIcon style={{ color: "black" }} />
                      </ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </ListItemButton>
                  </ListItem>



                </>)

              case 'admin':
                return (
                  <>
                    <ListItem
                      disablePadding
                      style={{
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                        backgroundColor: "pink",
                      }}
                    >
                      <ListItemButton onClick={() => handleNavigation("/dashboard/admin")}>
                        <AdminPanelSettingsIcon />
                        <ListItemText primary="Admin" style={{ marginLeft: "31px" }} />
                      </ListItemButton>
                    </ListItem>


                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleNavigation("/dashboard/superadmin/accounting-software")}>
                        <ListItemIcon className="DashboadAndTableIcon">
                          <WysiwygIcon style={{ color: "black" }} />
                        </ListItemIcon>
                        <ListItemText primary="User" />
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleNavigation("/dashboard/superadmin/dms-config")}>
                        <ListItemIcon className="DashboadAndTableIcon">
                          <EngineeringIcon style={{ color: "black" }} />
                        </ListItemIcon>
                        <ListItemText primary="User" />
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleNavigation("/dashboard/admin/SMTP-Email")}>
                        <SupervisorAccountIcon />
                        <ListItemText primary="SMTP-Email" style={{ marginLeft: "31px" }} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleNavigation("/dashboard/admin/tenant")}>
                        <ListItemIcon className="DashboadAndTableIcon">
                          <FormatListBulletedIcon style={{ color: "black" }} />
                        </ListItemIcon>
                        <ListItemText primary="Adminliste" />
                      </ListItemButton>
                    </ListItem>

                    <ListItem
                      disablePadding
                      style={{
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ListItemButton onClick={() => handleNavigation("/dashboard/admin/einstellungen")}>
                        <SettingsIcon />
                        <ListItemText primary="Einstellungen" style={{ marginLeft: "31px" }} />
                      </ListItemButton>
                    </ListItem>
                  </>
                );

              case 'superadmin':
                return (
                  <>
                    <ListItem
                      disablePadding
                      style={{
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                        backgroundColor: "green",
                      }}
                    >
                      <ListItemButton onClick={() => handleNavigation("/dashboard/superadmin")}>
                        <SecurityIcon />
                        <ListItemText primary="Superadmin" style={{ marginLeft: "31px" }} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleNavigation("/dashboard/superadmin/accounting-software")}>
                        <ListItemIcon className="DashboadAndTableIcon">
                          <WysiwygIcon style={{ color: "black" }} />
                        </ListItemIcon>
                        <ListItemText primary="User" />
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleNavigation("/dashboard/superadmin/dms-config")}>
                        <ListItemIcon className="DashboadAndTableIcon">
                          <EngineeringIcon style={{ color: "black" }} />
                        </ListItemIcon>
                        <ListItemText primary="User" />
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleNavigation("/dashboard/superadmin/tenant")}>
                        <ListItemIcon className="DashboadAndTableIcon">
                          <FormatListBulletedIcon style={{ color: "black" }} />
                        </ListItemIcon>
                        <ListItemText primary="tenant" />
                      </ListItemButton>
                    </ListItem>



                  </>


                );

              // Add more roles here if needed (e.g., 'user', 'moderator')

              default:
                return null; // Return nothing if the role does not match
            }
          })()}
          <Divider style={{ backgroundColor: "black", height: "2px" }} />

          <ListItem
            disablePadding
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <ListItemButton
              onClick={() => handleNavigation("/dashboard/profile")}
            >
              <AccountCircleIcon />
              <ListItemText primary="Profile" style={{ marginLeft: "31px" }} />
            </ListItemButton>
          </ListItem>


          <ListItem disablePadding>
            <ListItemButton onClick={() => handleLogout()}>
              <Logout />
              <ListItemText primary="Logout" style={{ marginLeft: "31px" }} />
            </ListItemButton>
          </ListItem>



        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
}

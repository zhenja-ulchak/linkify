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
import RecentActorsIcon from '@mui/icons-material/RecentActors';

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
import { enqueueSnackbar } from "notistack";



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
  // @ts-ignore
  const authUser = JSON.parse(sessionStorage.getItem('AuthUser'))
  const [TextRule, setTextRule] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  console.log(authUser.tenant_id);


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
    if (!getToken) {
      console.warn("Kein Token gefunden, automatisches Weiterleiten zur Login-Seite.");
      enqueueSnackbar("Kein Token gefunden. Automatisches Weiterleiten zur Login-Seite.", {
        variant: "warning"
      });
      router.push("/login");
      sessionStorage.clear();
      return;
    }
    try {
      const response = await apiService.get(`user/logout`, getToken);
      enqueueSnackbar("Logout erfolgreich!", {
        variant: "success"
      });
      if (response instanceof Error) {
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar("Fehler beim Logout. Bitte versuchen Sie es später erneut.", {
        variant: "error"
      });
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

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation("/dashboard/user")}>
              <ListItemIcon className="DashboadAndTableIcon">
                <DashboardIcon style={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary="DOCS-LIst" />
            </ListItemButton>
          </ListItem>





          {(() => {
            const isAdmin = TextRule === 'admin';
            const isSuperAdmin = TextRule === 'superadmin';

            const adminItems = [
              { path: "/dashboard/admin/einstellungen", icon: <AdminPanelSettingsIcon style={{ color: "black" }} />, text: "Admin", style: { backgroundColor: "pink" } },
              { path: `/dashboard/admin/accounting-software/${authUser?.tenant_id || ""}`, icon: <WysiwygIcon style={{ color: "black" }} />, text: "Accounting-software" },
              { path: `/dashboard/admin/dms-config/${authUser?.tenant_id || ""}`, icon: <EngineeringIcon style={{ color: "black" }} />, text: "Dms-config" },
              { path: "/dashboard/admin/user-list", icon: <RecentActorsIcon style={{ color: "black" }} />, text: "User-list" },
              { path: "/dashboard/admin/SMTP-Email", icon: <SupervisorAccountIcon style={{ color: "black" }} />, text: "SMTP-Email" },
              { path: `/dashboard/admin/tenant/${authUser?.tenant_id || ""}`, icon: <FormatListBulletedIcon style={{ color: "black" }} />, text: "Tenant" },
            ];

            const superAdminItems = [
              { path: "/dashboard/superadmin", icon: <SecurityIcon style={{ color: "black" }} />, text: "Superadmin", style: { backgroundColor: "green" } },
              { path: "/dashboard/superadmin/accounting-software", icon: <WysiwygIcon style={{ color: "black" }} />, text: "Accounting-software" },
              { path: "/dashboard/superadmin/dms-config", icon: <EngineeringIcon style={{ color: "black" }} />, text: "Dms-config" },
              { path: "/dashboard/superadmin/tenant", icon: <FormatListBulletedIcon style={{ color: "black" }} />, text: "Tenant" },
            ];

            const adminSection = isAdmin || isSuperAdmin ? (
              adminItems.map((item, index) => (
                <ListItem key={`admin-${index}`} disablePadding style={item.style || {}}>
                  <ListItemButton onClick={() => handleNavigation(item.path)}>
                    <ListItemIcon className="DashboadAndTableIcon">{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : null;

            const superAdminSection = isSuperAdmin ? (
              <>
                <Divider style={{ backgroundColor: "black", height: "2px" }} />
                {superAdminItems.map((item, index) => (
                  <ListItem key={`superadmin-${index}`} disablePadding style={item.style || {}}>
                    <ListItemButton onClick={() => handleNavigation(item.path)}>
                      <ListItemIcon className="DashboadAndTableIcon">{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            ) : null;

            return (
              <>
                <Divider style={{ backgroundColor: "black", height: "2px" }} />
                {adminSection}
                {superAdminSection}
              </>
            );
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

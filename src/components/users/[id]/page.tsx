"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Für URL-Parameter und Router
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  language: string;
  username: string;
  contact_phone: number;
  email: string;
  role: string;
  is_active: boolean;
};

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();


  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const [modalTextColor, setModalTextColor] = useState("black"); // Declare state outside of conditionals

  const [updatedUser, setUpdatedUser] = useState<User>({
    id: 0,
    first_name: "",
    last_name: "",
    language: "",
    username: "",
    contact_phone: 0,
    email: "",
    role: "",
    is_active: false
  });

  const [users, setUser] = useState<User[]>([]);

  useEffect(() => {
    const bodyBackgroundColor = window.getComputedStyle(
      document.body
    ).backgroundColor;
    if (bodyBackgroundColor === "rgb(0, 0, 0)") {
      setModalTextColor("black");
    } else {
      setModalTextColor("black");
    }
  }, [isEditing]);

  // Falls kein Benutzer gefunden wurde
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (updatedUser) {
      setUpdatedUser({
        ...updatedUser,
        [name]: value,
      });
    }
  };

  // Validierung der Benutzereingaben
  const validateInputs = () => {
    if (
      !updatedUser.first_name ||
      !updatedUser.last_name ||
      !updatedUser.language ||
      !updatedUser.username ||
      !updatedUser.contact_phone ||
      !updatedUser.email
    ) {
      setError("Alle Felder müssen ausgefüllt werden.");
      return false;
    }
    setError("");
    return true;
  };

  useEffect(() => {
    const fetchElements = async () => {
      if (!id) {
        setError("Keine gültige ID angegeben.");
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}user/${id}`);
        if (response.status === 200) {
          setUser([response.data]);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        setError("Fehler beim Abrufen der Daten.");
      }
    };

    fetchElements();
  }, [id]);

  const handleSaveChanges = async () => {
    if (validateInputs()) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}user/${updatedUser?.id}`,
          updatedUser
        );
        if (response.status === 200) {
          console.log("Benutzerdaten gespeichert:", updatedUser);
          setIsEditing(false);
        }
      } catch (error) {
        setError("Fehler beim Speichern:" + error)
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}user/${updatedUser?.id}`
      );
      if (response.status === 200) {
        console.log("Benutzer gelöscht:", updatedUser);
        router.push("/users");
      }
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  };


  function handleGoingBack() {
    router.back();
  }

  return (
    <div id="UserDetailContainer">
      <h3>Benutzer Details</h3>

      <table id="UserDetailTable">
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th className="UserDetailTableHeader">Feld</th>
            <th
              className="UserDetailTableHeader"
            >
              Wert
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="UserDetailTableBody">{user.id}</td>
              <td className="UserDetailTableBody">{user.first_name}</td>
              <td className="UserDetailTableBody">{user.last_name}</td>
              <td className="UserDetailTableBody">{user.language}</td>
              <td className="UserDetailTableBody">{user.username}</td>
              <td className="UserDetailTableBody">{user.contact_phone}</td>
              <td className="UserDetailTableBody">{user.email}</td>
              <td className="UserDetailTableBody">{user.role}</td>
              <td className="UserDetailTableBody">{user.is_active}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "10px",
        }}
      >
        <button
          className="UserDetailButton"
          title="Bearbeiten"
          onClick={() => setIsEditing(true)}
        >
          <EditIcon />
        </button>
        <button
          className="UserDetailButton"
          title="Löschen"
          onClick={handleDelete}
        >
          <DeleteIcon />
        </button>
      </div>

      <div id="UserDetailModalContainer">
        <button
          className="UserDetailButton"
          title="Zurück"
          onClick={handleGoingBack}
        >
          <KeyboardBackspaceIcon />
        </button>
      </div>


      {/* -------------------------------- */}
      {isEditing && (
        <div id="UserDetailModal" style={{ color: modalTextColor }}>
          <div id="UserDetailModalContent" style={{ color: modalTextColor }}>
            <h4>Benutzerdaten bearbeiten</h4>

            {error && <div id="UserDetailModalError">{error}</div>}

            {/* Firmenname, Adresse und andere Felder sind nur lesbar */}
            <div style={{ marginBottom: "10px" }}>
              <label className="EditPageFontColor">Username * :</label>
              <input
                type="text"
                name="contact_phone"
                value={updatedUser?.username}
                onChange={handleEditChange}
                style={{ width: "100%", padding: "8px" }}
                readOnly
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label className="EditPageFontColor">Vorname:</label>
              <input
                type="text"
                name="company_name"
                value={updatedUser?.first_name}
                onChange={handleEditChange}
                style={{ width: "100%", padding: "8px" }}
                readOnly
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label className="EditPageFontColor">Nachname:</label>
              <input
                type="text"
                name="address"
                value={updatedUser?.last_name}
                onChange={handleEditChange}
                style={{ width: "100%", padding: "8px" }}
                readOnly
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label className="EditPageFontColor">Sprache:</label>
              <input
                type="text"
                name="license_valid_until"
                value={updatedUser?.language}
                onChange={handleEditChange}
                style={{ width: "100%", padding: "8px" }}
                readOnly
              />
            </div>

            {/* Die änderbaren Felder */}
            <div style={{ marginBottom: "10px" }}>
              <label className="EditPageFontColor">Kontaktnummer * :</label>
              <input
                type="text"
                name="invoice_address"
                value={updatedUser?.contact_phone}
                onChange={handleEditChange}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label className="EditPageFontColor">Email * :</label>
              <input
                type="text"
                name="contact_email"
                value={updatedUser?.email}
                onChange={handleEditChange}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label className="EditPageFontColor">Role:</label>
              <input
                type="text"
                name="contact_email"
                value={updatedUser?.role}
                onChange={handleEditChange}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            {/* Buttons zum Speichern und Schließen */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
              }}
              className="CancelBtn"
            >
              <button
                onClick={handleSaveChanges}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                }}
                title="Speichern"
              >
                <AddIcon style={{ transform: "scale(1.5)" }} />
              </button>
              <button
                className="BtnCancel"
                title="Schließen"
                onClick={() => setIsEditing(false)}
              >
                <CancelIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;

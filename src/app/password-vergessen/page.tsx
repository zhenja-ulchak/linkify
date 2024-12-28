"use client";

import React, { useState } from "react";
import axios from "axios";
import { NextPage } from "next";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

const ForgotPassword: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}user/passforgot`,
        {
          email,
        }
      );

      if (response.status === 200) {
        setSuccessMessage(
          "Eine E-Mail mit Anweisungen zum Zurücksetzen Ihres Passworts wurde gesendet."
        );
      } else if (response.status === 404) {
        setErrorMessage("Die eingegebene E-Mail-Adresse wurde nicht gefunden.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
        );
      }
    }
  };

  const router = useRouter();

  function handleLoginLinkClick() {
    router.push("/login");
  }

  return (
    <div id="ContainerPwdForgot">
      <form id="forgotPwdForm" onSubmit={handleSubmit}>
        <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
          Passwort vergessen
        </h1>

        {successMessage && (
          <div id="ContainerSuccessMessagePWDForgot">{successMessage}</div>
        )}

        {errorMessage && (
          <div id="ContainerErrorMessagePWDForgot">{errorMessage}</div>
        )}

        <label htmlFor="email" id="LabelPWDForgot">
          E-Mail-Adresse
        </label>
        <input
          type="email"
          id="EmailPWDForgot"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Geben Sie Ihre E-Mail-Adresse ein"
        />

        <button type="submit" id="SubmitBtnPWDForgot">
          E-Mail senden
        </button>
      </form>

      <Button
        onClick={handleLoginLinkClick}
        variant="text"
        color="secondary"
        style={{
          marginTop: "16px",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Zurück zum Login?
      </Button>
    </div>
  );
};

export default ForgotPassword;

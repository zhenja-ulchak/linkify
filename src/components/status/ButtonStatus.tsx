import { useState } from "react";
import { Button } from "@mui/material"
import { enqueueSnackbar } from "notistack"
import ApiService from "../../../src/app/services/apiService";
import { useTranslations } from "next-intl";



type ButtonStatusType = {
    Url: string
    textOnlain?: string
    textOfflain?: string
    
}

const ButtonStatusCheck  = ({Url, textOnlain, textOfflain}: ButtonStatusType) => {
    
  const [isText, setIsText] = useState(false);



  const t = useTranslations("API");


 const StatusCheck = async () => {
      const Auth: any = sessionStorage.getItem("AuthToken");
      const response: any = await ApiService.get(
        `${Url}`,
        Auth
      ); 

      if (response instanceof Error) {
        const { status, variant, message } = ApiService.CheckAndShow(
          response,
          t
        );
          // @ts-ignore
          enqueueSnackbar(message, { variant: variant });
        
      }

      if (response.status === 200 || response.success === true) {
        enqueueSnackbar(t("ONLAIN"), {
          variant: "success",
        });
        setIsText(true)
      }
    };

  return (
    <>
        <Button onClick={()=>StatusCheck()}>
         {isText ? textOnlain : textOfflain }   
        </Button>
    </>
  )
}

export default ButtonStatusCheck
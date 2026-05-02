import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../context/UserContext";

export const useTranslations = () => {
  const { t, i18n } = useTranslation();
  const { languageUser } = useContext(UserContext);

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser]);

  return { t };
};

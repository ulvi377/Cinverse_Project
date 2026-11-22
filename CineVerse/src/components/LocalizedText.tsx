import React from "react";
import { Text as NativeText, TextProps } from "react-native";
import { useLanguage } from "../context/LanguageContext";

export default function LocalizedText({ children, ...props }: TextProps) {
  const { t } = useLanguage();
  const translateChildren = (value: React.ReactNode): React.ReactNode => {
    if (typeof value === "string") return t(value);
    if (Array.isArray(value)) return value.map((item, index) => <React.Fragment key={index}>{translateChildren(item)}</React.Fragment>);
    return value;
  };
  return <NativeText {...props}>{translateChildren(children)}</NativeText>;
}

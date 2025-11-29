"use client";

import * as React from "react";
import { AuthContext } from "../app/provider/AuthProvider";

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

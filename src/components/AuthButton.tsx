"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

function AuthButton() {
  const { data: session } = useSession();
}

export default AuthButton;

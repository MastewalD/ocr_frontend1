"use client";

import React from "react";
import { createUploadLink } from "apollo-upload-client";
import Cookies from "js-cookie";

import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

function makeClient() {
  const token = Cookies.get("auth_token");

  const uploadLink = createUploadLink({
    uri: "https://ocr-2-zzlk.onrender.com/graphql",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: uploadLink,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}

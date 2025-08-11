"use client";

import React from "react";
import { from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context"; 
import { createUploadLink } from "apollo-upload-client";
import Cookies from "js-cookie";

import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

function makeClient() {
  const httpLink = createUploadLink({
    uri: "https://ocr-2-zzlk.onrender.com/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    const token = Cookies.get("auth_token");
    
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const link = from([authLink, httpLink]);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}

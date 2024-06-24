import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import Web3ModalProvider from "@/context";
import Loading from "@/components/Loading";
import { ThemeProvider, createTheme } from "@mui/material";

export default function App({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  const theme = createTheme({
    components: {
      MuiTypography: {
        defaultProps: {
          color: "black",
          fontFamily: "sans-serif",
        },
      },
      MuiButtonBase: {
        defaultProps: {
          color: "black",
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Web3ModalProvider>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <Loading>
            <Component {...pageProps} />
          </Loading>
        </SessionProvider>
      </Web3ModalProvider>
    </ThemeProvider>
  );
}

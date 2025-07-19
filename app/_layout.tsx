import { Stack } from "expo-router";
import { AppProvider } from "../components/AppProvider";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack />
    </AppProvider>
  );
}

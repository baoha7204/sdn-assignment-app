import { Toaster } from "sonner";

import Router from "./router";
import { AuthProvider } from "@/contexts/auth.context";

function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;

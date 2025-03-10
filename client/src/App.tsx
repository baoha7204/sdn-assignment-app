import { AuthProvider } from "@/contexts/auth.context";
import Router from "./router";

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;

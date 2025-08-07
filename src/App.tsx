import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserManagement } from "./page/UserManagement";
import { UserProvider } from "./contexts/UserContext";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <UserManagement />
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;

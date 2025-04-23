import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import GamePage from "@/pages/GamePage";
import ProgressPage from "@/pages/ProgressPage";
import ParentDashboard from "@/pages/ParentDashboard";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/" component={Home} />
      <Route path="/game/:gameId" component={GamePage} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/parent-dashboard" component={ParentDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

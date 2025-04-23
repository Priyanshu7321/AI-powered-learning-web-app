
import { Switch, Route, useLocation } from "wouter";
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
import { useEffect } from "react";

function Router() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const currentPath = window.location.pathname;
    
    if (!token && currentPath !== '/signup' && currentPath !== '/login') {
      setLocation('/login');
    }
  }, []);

  return (
    <Switch>
      <Route path="/signup" component={SignupPage} />
      <Route path="/login" component={LoginPage} />
      {localStorage.getItem('userToken') ? (
        <>
          <Route path="/game/:gameId" component={GamePage} />
          <Route path="/progress" component={ProgressPage} />
          <Route path="/parent-dashboard" component={ParentDashboard} />
          <Route exact path="/" component={Home} />
        </>
      ) : (
        <Route component={LoginPage} />
      )}
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

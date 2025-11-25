import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { PrivateRoute } from "./components/PrivateRoute";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy loading das páginas para otimização de bundle
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Transactions = React.lazy(() => import("./pages/Transactions"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Goals = React.lazy(() => import("./pages/Goals"));
const Payments = React.lazy(() => import("./pages/Payments"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Settings = React.lazy(() => import("./pages/Settings"));
const RPG = React.lazy(() => import("./pages/RPG"));
const Insights = React.lazy(() => import("./pages/Insights"));
const Landing = React.lazy(() => import("./pages/NewLanding"));
const ResponsiveTest = React.lazy(() => import("./pages/ResponsiveTest"));

// Wrapper para Suspense
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <SuspenseWrapper>
          <Landing />
        </SuspenseWrapper>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <SuspenseWrapper>
              <Dashboard />
            </SuspenseWrapper>
          ),
        },
        {
          path: "transactions",
          element: (
            <SuspenseWrapper>
              <Transactions />
            </SuspenseWrapper>
          ),
        },
        {
          path: "goals",
          element: (
            <SuspenseWrapper>
              <Goals />
            </SuspenseWrapper>
          ),
        },
        {
          path: "payments",
          element: (
            <SuspenseWrapper>
              <Payments />
            </SuspenseWrapper>
          ),
        },
        {
          path: "reports",
          element: (
            <SuspenseWrapper>
              <Reports />
            </SuspenseWrapper>
          ),
        },
        {
          path: "insights",
          element: (
            <SuspenseWrapper>
              <Insights />
            </SuspenseWrapper>
          ),
        },
        {
          path: "rpg",
          element: (
            <SuspenseWrapper>
              <RPG />
            </SuspenseWrapper>
          ),
        },
        {
          path: "settings",
          element: (
            <SuspenseWrapper>
              <Settings />
            </SuspenseWrapper>
          ),
        },
        {
          path: "responsive-test",
          element: (
            <SuspenseWrapper>
              <ResponsiveTest />
            </SuspenseWrapper>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: (
        <SuspenseWrapper>
          <Login />
        </SuspenseWrapper>
      ),
    },
    {
      path: "/register",
      element: (
        <SuspenseWrapper>
          <Register />
        </SuspenseWrapper>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_normalizeFormMethod: true,
    },
  }
);

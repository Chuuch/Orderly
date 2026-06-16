import { LoginPage } from "@/pages/LoginPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import NotFoundPage from "@/pages/NotFoundPage";
import { QrMenuPage } from "@/pages/QrMenuPage";
import { AdminHomePage } from "@/pages/AdminPage";
import { AppShell } from "@/components/layout/AppShell";
import { AdminMenuPage } from "@/pages/AdminMenuPage";
import { KitchenPage } from "@/pages/KitchenPage";
import { AdminTablesPage } from "@/pages/AdminTablesPage";

const router = createBrowserRouter([
    {path: '/login', element: <LoginPage />},
    {path: '/t/:qrToken', element: <QrMenuPage />},
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppShell />,
                children: [
                    { path: '/admin', element: <AdminHomePage /> },
                    { path: '/admin/menus', element: <AdminMenuPage /> },
                    { path: '/admin/tables', element: <AdminTablesPage /> },
                    { path: '/kitchen', element: <KitchenPage /> },
                ]
            }
        ],
    },
    { path: '*', element: <NotFoundPage /> },
])

export function AppRouter() {
    return <RouterProvider router={router}/>
}
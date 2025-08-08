
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ClientsList } from "./components/clients/ClientsList";
import { ClientProfile } from "./components/clients/ClientProfile";
import { EquipmentList } from "./components/equipment/EquipmentList";
import { EquipmentProfile } from "./components/equipment/EquipmentProfile";
import { EquipmentForm } from "./components/equipment/EquipmentForm";
import { ServiceOrdersList } from "./components/serviceOrders/ServiceOrdersList";
import { ServiceOrderDetail } from "./components/serviceOrders/ServiceOrderDetail";
import { ServiceOrderForm } from "./components/serviceOrders/ServiceOrderForm";
import { ServiceProtocolsList } from "./components/serviceOrders/ServiceProtocolsList";
import { ServiceProtocolForm } from "./components/serviceOrders/ServiceProtocolForm";
import { ServiceProtocolDetail } from "./components/serviceOrders/ServiceProtocolDetail";
import { DocumentsList } from "./components/documents/DocumentsList";
import { InventoryList } from "./components/inventory/InventoryList";
import { InventoryDetail } from "./components/inventory/InventoryDetail";
import { ConversationsList } from "./components/conversations/ConversationsList";
import { ConversationDetails } from "./components/conversations/ConversationDetails";
import { NotFound } from "./components/layout/NotFound";
import { ReportsOverview } from "./components/reports/ReportsOverview";
import { FinancialReportDetail } from "./components/reports/FinancialReportDetail";
import { ServicePerformanceReport } from "./components/reports/ServicePerformanceReport";
import { SettingsPage } from "./components/settings/SettingsPage";
import { TestDialogPage } from "./components/test/TestDialogPage";
import { OrdersList } from "./components/orders/OrdersList";
import { OrderDetail } from "./components/orders/OrderDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/zlecenia" replace />,
      },
      {
        path: "*",
        element: <Navigate to="/zlecenia" replace />,
      },
      {
        path: "klienci",
        children: [
          {
            index: true,
            element: <ClientsList />,
          },
          {
            path: ":clientId",
            element: <ClientProfile />,
          },
        ],
      },
      {
        path: "urzadzenia",
        children: [
          {
            index: true,
            element: <EquipmentList />,
          },
          {
            path: "nowe",
            element: <EquipmentForm />,
          },
          {
            path: ":equipmentId",
            element: <EquipmentProfile />,
          },
          // Removed the "edytuj/:equipmentId" route since we now edit inline
        ],
      },
      {
        path: "zlecenia",
        children: [
          {
            index: true,
            element: <ServiceOrdersList />,
          },
          {
            path: "nowe",
            element: <ServiceOrderForm />,
          },
          {
            path: ":orderId",
            element: <ServiceOrderDetail />,
          },
          {
            path: ":orderId/edytuj",
            element: <ServiceOrderForm />,
          },
        ],
      },
      {
        path: "zamowienia",
        children: [
          {
            index: true,
            element: <OrdersList />,
          },
          {
            path: ":orderId",
            element: <OrderDetail />,
          },
        ],
      },
      {
        path: "protokoly",
        children: [
          {
            index: true,
            element: <ServiceProtocolsList />,
          },
          {
            path: "nowy",
            element: <ServiceProtocolForm />,
          },
          {
            path: ":id",
            element: <ServiceProtocolDetail />,
          },
          {
            path: ":id/edytuj",
            element: <ServiceProtocolForm />,
          },
        ],
      },
      {
        path: "dokumenty",
        element: <DocumentsList />,
      },
      {
        path: "magazyn",
        children: [
          {
            index: true,
            element: <InventoryList />,
          },
          {
            path: ":itemId",
            element: <InventoryDetail />,
          },
        ],
      },
      {
        path: "konwersacje",
        children: [
          {
            index: true,
            element: <ConversationsList />,
          },
          {
            path: ":id",
            element: <ConversationDetails />,
          },
          {
            path: "nowa",
            element: <ConversationDetails />,
          },
        ],
      },
      {
        path: "raporty",
        children: [
          {
            index: true,
            element: <ReportsOverview />,
          },
          {
            path: "finansowe",
            element: <FinancialReportDetail />,
          },
          {
            path: "wydajnosc",
            element: <ServicePerformanceReport />,
          },
        ],
      },
      {
        path: "ustawienia",
        element: <SettingsPage />,
      },
      {
        path: "404",
        element: <NotFound />,
      },
      {
        path: "test/dialog",
        element: <TestDialogPage />,
      },
    ],
  },
]);

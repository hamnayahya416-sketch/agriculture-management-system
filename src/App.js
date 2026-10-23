import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import Dashboard from "./Dashboard";
import Supplies from "./Supplies";
import Orders from "./Orders";
import OrderForm from "./OrderForm";
import { orders as startingOrders } from "./data";
import { PAGE_IDS } from "./nav";

function startPage() {
  const hash = window.location.hash.replace("#", "");
  return PAGE_IDS.includes(hash) ? hash : "dashboard";
}

export default function App() {
  const [page, setPage] = useState(startPage);
  const [orders, setOrders] = useState(startingOrders);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function goToPage(nextPage) {
    setPage(nextPage);
    window.location.hash = nextPage;
  }

  function toggleSidebar() {
    if (window.innerWidth < 1024) {
      setSidebarOpen((value) => !value);
    } else {
      setCollapsed((value) => !value);
    }
  }

  function addOrder(newOrder) {
    const id = "ORD-" + (100 + orders.length + 1);
    setOrders([{ ...newOrder, id }, ...orders]);
    return id;
  }

  return (
    <div className="app">
      <Sidebar
        page={page}
        setPage={goToPage}
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app__body">
        <Header page={page} onToggle={toggleSidebar} orders={orders} />

        <main className="content" id="main-content">
          {page === "dashboard" && (
            <Dashboard orders={orders} onNewOrder={() => goToPage("form")} />
          )}
          {page === "supplies" && <Supplies />}
          {page === "orders" && (
            <Orders orders={orders} onNewOrder={() => goToPage("form")} />
          )}
          {page === "form" && (
            <OrderForm
              onAddOrder={addOrder}
              onShowOrders={() => goToPage("orders")}
            />
          )}
        </main>

        <Footer setPage={goToPage} />
      </div>
    </div>
  );
}

import { useState } from "react";
import PageHeader from "../components/common/PageHeader.js";
import OrderForm from "../components/harvest/OrderForm.js";
import OrdersTable from "../components/harvest/OrdersTable.js";
import HarvestSummary from "../components/harvest/HarvestSummary.js";
import OrdersSummary from "../components/harvest/OrdersSummary.js";
import StockProgressBar from "../components/harvest/StockProgressBar.js";
import HarvestChart from "../components/harvest/HarvestChart.js";
import OrdersTimelineChart from "../components/harvest/OrdersTimelineChart.js";
import OrderStatusChart from "../components/harvest/OrderStatusChart.js";
import { IconPlus } from "../components/common/icons.js";

export default function HarvestOrders() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <PageHeader
        title="Harvest and Orders"
        description="Track the season's harvest, customer orders and stock sold."
        action={
          <button
            type="button"
            className="btn"
            onClick={() => setShowForm((value) => !value)}
          >
            <IconPlus size={16} />
            {showForm ? "Hide order form" : "New Order"}
          </button>
        }
      />

      <div className="grid">
        <div className="span-6">
          <HarvestSummary />
        </div>
        <div className="span-6">
          <OrdersSummary />
        </div>

        {showForm && (
          <div className="span-12">
            <OrderForm onShowOrders={() => setShowForm(false)} />
          </div>
        )}

        <div className="span-8">
          <OrdersTable />
        </div>
        <div className="span-4">
          <OrderStatusChart />
        </div>

        <div className="span-6">
          <StockProgressBar />
        </div>
        <div className="span-6">
          <HarvestChart />
        </div>

        <div className="span-12">
          <OrdersTimelineChart />
        </div>
      </div>
    </>
  );
}

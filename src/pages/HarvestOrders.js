import { useState } from "react";
import PageHeader from "../common/PageHeader";
import OrderForm from "../harvest/OrderForm";
import OrdersTable from "../harvest/OrdersTable";
import HarvestSummary from "../harvest/HarvestSummary";
import OrdersSummary from "../harvest/OrdersSummary";
import StockProgressBar from "../harvest/StockProgressBar";
import HarvestChart from "../harvest/HarvestChart";
import OrdersTimelineChart from "../harvest/OrdersTimelineChart";
import OrderStatusChart from "../harvest/OrderStatusChart";
import { IconPlus } from "../common/icons";

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

import React from "react";
import { Card, Statistic, Progress } from "antd";
import { Line } from "@ant-design/plots";

const Dashboard = () => {
  // Mock Sales Data (Last 3 Months)
  const salesData = [
    { month: "November", totalSales: 120000, percentageChange: "+12%" },
    { month: "December", totalSales: 150000, percentageChange: "+25%" },
    { month: "January", totalSales: 130000, percentageChange: "-13%" },
  ];

  // Mock Refund Data
  const refundData = {
    totalSales: 400000, // Sum of last 3 months
    totalRefunds: 15000, // Total Refunds
    refundPercentage: ((15000 / 400000) * 100).toFixed(2), // Refund Percentage
  };

  // Line Chart Configuration
  const chartConfig = {
    data: salesData.map((item) => ({
      month: item.month,
      sales: item.totalSales,
    })),
    xField: "month",
    yField: "sales",
    point: { size: 5, shape: "circle" },
    color: "#1890ff",
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Total Sales Cards */}
        {salesData.map((item, index) => (
          <div className="col-md-4 mb-3" key={index}>
            <Card bordered={false} className="shadow-sm p-3">
              <Statistic
                title={`Sales in ${item.month}`}
                value={item.totalSales}
                precision={2}
                suffix="₹"
              />
              <p
                className={
                  item.percentageChange.includes("-")
                    ? "text-danger"
                    : "text-success"
                }
              >
                Change: {item.percentageChange}
              </p>
            </Card>
          </div>
        ))}
      </div>

      <div className="row">
        {/* Sales Growth Chart */}
        <div className="col-md-8 mb-3">
          <Card
            title="Sales Growth (Last 3 Months)"
            bordered={false}
            className="shadow-sm p-3"
          >
            <Line {...chartConfig} />
          </Card>
        </div>

        {/* Refund vs Sales */}
        <div className="col-md-4 mb-3">
          <Card
            title="Refunds vs Sales"
            bordered={false}
            className="shadow-sm p-3"
          >
            <Statistic
              title="Total Sales"
              value={refundData.totalSales}
              precision={2}
              suffix="₹"
            />
            <Statistic
              title="Total Refunds"
              value={refundData.totalRefunds}
              precision={2}
              suffix="₹"
              className="mt-2"
            />
            <Progress
              percent={parseFloat(refundData.refundPercentage)}
              status={refundData.refundPercentage > 10 ? "exception" : "active"}
              className="mt-3"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

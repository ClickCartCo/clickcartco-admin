import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getOrders } from "../features/auth/authSlice";

const columns = [
  { title: "SNo", dataIndex: "key" },
  { title: "Order Details", dataIndex: "items" },
  { title: "User Email", dataIndex: "userEmail" },
  { title: "Amount", dataIndex: "amount" },
  { title: "Date", dataIndex: "date" },
  { title: "Payment Success", dataIndex: "paymentSuccess" },
  { title: "View Order", dataIndex: "product" },
  { title: "Action", dataIndex: "action" },
];

const Orders = () => {
  const dispatch = useDispatch();
  const orderState = useSelector((state) => state.auth.orders) || [];

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const data1 = orderState.map((order, index) => {
    const items = order?.items || [];
    const firstItem = items[0];
    const productTitle = firstItem?.product?.title || "N/A";
    const itemsLength = items.length;

    return {
      key: index + 1,
      items:
        itemsLength > 1
          ? `${productTitle} + ${itemsLength - 1} more`
          : productTitle,
      userEmail: order?.userEmail || "N/A",
      amount: order?.totalAmount ?? "N/A",
      date: new Date(order?.createdAt).toLocaleString(),
      paymentSuccess: order?.paymentSuccess ? "Yes" : "No",
      product: <Link to={`/admin/order/${order?._id}`}>View Orders</Link>,
      action: (
        <>
          <Link to="/" className="fs-3 text-danger">
            <BiEdit />
          </Link>
          <Link className="ms-3 fs-3 text-danger" to="/">
            <AiFillDelete />
          </Link>
        </>
      ),
    };
  });

  return (
    <div>
      <h3 className="mb-4 title">Orders</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default Orders;

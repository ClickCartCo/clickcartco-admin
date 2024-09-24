import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getOrders } from "../features/auth/authSlice";
const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Order Details",
    dataIndex: "items",
  },
  {
    title: "User Email",
    dataIndex: "userEmail",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Date",
    dataIndex: "date",
  },
  { title: "Payment Success", dataIndex: "paymentSuccess" },
  {
    title: "View Order",
    dataIndex: "product",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Orders = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, []);
  const orderState = useSelector((state) => state.auth.orders);

  const data1 = [];
  for (let i = 0; i < orderState.length; i++) {
    const itemsLength = orderState[i]?.items?.length;
    data1.push({
      key: i + 1,
      items:
        itemsLength > 1
          ? `${orderState[i].items[0].product.title}+${itemsLength}`
          : orderState[i].items[0].product.title,
      userEmail: orderState[i].userEmail,
      amount: orderState[i].totalAmount,
      date: new Date(orderState[i].createdAt).toLocaleString(),
      paymentSuccess: orderState[i].paymentSuccess,
      product: (
        <Link to={`/admin/order/${orderState[i]._id}`}>View Orders</Link>
      ),
      action: (
        <>
          <Link to="/" className=" fs-3 text-danger">
            <BiEdit />
          </Link>
          <Link className="ms-3 fs-3 text-danger" to="/">
            <AiFillDelete />
          </Link>
        </>
      ),
    });
  }
  return (
    <div>
      <h3 className="mb-4 title">Orders</h3>
      <div>{<Table columns={columns} dataSource={data1} />}</div>
    </div>
  );
};

export default Orders;

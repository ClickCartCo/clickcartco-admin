import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getOrderByID, updateOrderById } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const location = useLocation();
  const orderId = location.pathname.split("/")[3];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrderByID(orderId));
  }, []);

  const orderDetails = useSelector((state) => state.auth.orderDetails);

  const [orderStatus, setOrderStatus] = useState("pending");
  const [isOrderStatusChanged, setIsOrderStatusChanged] = useState(false);
  const [itemStatus, setItemStatus] = useState([]);
  const [isItemStatusChanged, setIsItemStatusChanged] = useState([]);
  const [trackingNumbers, setTrackingNumbers] = useState([]);
  const [isTrackingNumberChanged, setIsTrackingNumberChanged] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync orderDetails with local state when it's updated
  useEffect(() => {
    if (orderDetails?.orderNumber) {
      setOrderStatus(orderDetails.status || "pending");

      const itemStatusArray =
        orderDetails.items?.map((item) => item.status) || [];
      const itemTrackingNumberArray = orderDetails?.items?.map(
        (item) => item.trackingNumber || ""
      );

      setItemStatus(itemStatusArray);
      setTrackingNumbers(itemTrackingNumberArray);
      setIsItemStatusChanged(Array(itemStatusArray.length).fill(false));
      setIsTrackingNumberChanged(
        Array(itemTrackingNumberArray.length).fill(false)
      );
    }
  }, [orderDetails]);

  const handleOrderStatusChange = (e) => {
    setOrderStatus(e.target.value);
    if (orderDetails?.status === e.target.value) {
      setIsOrderStatusChanged(false);
    } else {
      setIsOrderStatusChanged(true);
    }
  };

  const handleItemStatusChange = (index, e) => {
    const newStatus = [...itemStatus];
    newStatus[index] = e.target.value;
    const newStatusChanged = [...isItemStatusChanged];
    newStatusChanged[index] = true;
    setItemStatus(newStatus);
    setIsItemStatusChanged(newStatusChanged);
    if (e.target.value === orderDetails?.items[index]?.status) {
      newStatusChanged[index] = false;
      setIsItemStatusChanged(newStatusChanged);
    }
  };

  // Handler for tracking number input change
  const handleTrackingNumberChange = (index, e) => {
    const newTrackingNumbers = [...trackingNumbers];
    const newTrackingChanged = [...isTrackingNumberChanged];
    newTrackingNumbers[index] = e.target.value;
    newTrackingChanged[index] = true;
    setTrackingNumbers(newTrackingNumbers);
    setIsTrackingNumberChanged(newTrackingChanged);
    if (e.target.value === "") {
      newTrackingNumbers[index] = e.target.value;
      newTrackingChanged[index] = false;
      setTrackingNumbers(newTrackingNumbers);
      setIsTrackingNumberChanged(newTrackingChanged);
    }
  };

  const updateOrderStatus = async () => {
    setIsUpdating(true);
    const payload = {
      orderId: orderDetails.orderNumber,
      orderStatus: orderStatus,
    };
    const response = await dispatch(updateOrderById({ orderId, payload }));
    if (response.meta.requestStatus === "fulfilled") {
      toast.success("Order Status Updated Successfullly!");
    }
    if (response.meta.requestStatus === "rejected") {
      toast.success("Order Status Update Failed!");
    }
    setIsOrderStatusChanged(false);
    setIsUpdating(false);
  };

  const updateItemStatus = async (itemId, index) => {
    setIsUpdating(true);
    const payload = {
      orderId: orderDetails.orderNumber,
      itemId,
      itemStatus: itemStatus[index],
    };
    const response = await dispatch(updateOrderById({ orderId, payload }));
    const newStatusChanged = [...isItemStatusChanged];
    if (response.meta.requestStatus === "fulfilled") {
      toast.success("Order Item Status Updated Successfullly!");
    }
    if (response.meta.requestStatus === "rejected") {
      toast.success("Order Item Status Update Failed!");
    }
    newStatusChanged[index] = false;
    setIsItemStatusChanged(newStatusChanged);
    setIsUpdating(false);
  };

  const updateTrackingNumber = async (itemId, index) => {
    if (trackingNumbers[index] === "") {
      toast.warn("Please fill tracking number to proceed!");
      return;
    }
    setIsUpdating(true);
    const payload = {
      orderId: orderDetails.orderNumber,
      itemId: itemId,
      trackingNumber: trackingNumbers[index],
    };
    const response = await dispatch(updateOrderById({ orderId, payload }));
    if (response.meta.requestStatus === "fulfilled") {
      toast.success("Order Tracking Number Updated Successfullly!");
    }
    if (response.meta.requestStatus === "rejected") {
      toast.error("Order Tracking Number Update Failed!");
    }
    const newTrackingChanged = [...isTrackingNumberChanged];
    newTrackingChanged[index] = false;
    setIsTrackingNumberChanged(newTrackingChanged);
  };

  const [editTracking, setEditTracking] = useState({});

  const handleEditToggle = (index) => {
    setEditTracking((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCancelEdit = (index) => {
    setEditTracking((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  if (!orderDetails) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Order Details</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5>Order Id: {orderDetails.orderNumber}</h5>
              <h5>User Email: {orderDetails.userDetails.userEmail}</h5>
              <div className="form-group">
                <label htmlFor="orderStatus">Order Status</label>
                <select
                  className="form-control"
                  id="orderStatus"
                  value={orderStatus}
                  onChange={handleOrderStatusChange}
                >
                  <option value="partially delivered">
                    Partially Delivered
                  </option>
                  <option value="completely delivered">
                    Completely Delivered
                  </option>
                  {/* <option value="partially cancelled">
                    Partially Cancelled
                  </option>
                  <option value="cancelled">Cancelled</option> */}
                  <option value="placed">Confirmed</option>
                </select>
                <button
                  className="btn btn-primary mt-2"
                  onClick={updateOrderStatus}
                  disabled={isUpdating || !isOrderStatusChanged}
                >
                  Update Order Status
                </button>
              </div>
              <div className="m-1">
                <div className="d-flex">
                  <span>
                    <h6>Total Tax Amount:</h6>
                  </span>
                  <span>
                    <p>${orderDetails.taxAmount}</p>
                  </span>
                </div>
                <div className="d-flex">
                  <span>
                    <h6>Shipping Amount:</h6>
                  </span>
                  <span>
                    <p>${orderDetails.shippingAmount}</p>
                  </span>
                </div>
                <div className="d-flex">
                  <span>
                    <h6>Total Cost:</h6>
                  </span>
                  <span>
                    <p>${orderDetails.totalAmount}</p>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6">
                  <h6>Billing Address:</h6>
                  <p>
                    {`${orderDetails?.billingAddress?.firstName} ${orderDetails?.billingAddress?.lastName}`}
                  </p>
                  <p>{orderDetails?.billingAddress?.streetAddress}</p>
                  <p>
                    {`${orderDetails?.billingAddress?.city}, ${orderDetails?.billingAddress?.state}, ${orderDetails?.billingAddress?.postalCode}`}
                  </p>
                  <p>{orderDetails?.billingAddress?.country}</p>
                  <p>Phone: {orderDetails?.billingAddress?.phoneNumber}</p>
                </div>
                <div className="col-md-6">
                  <h6>Shipping Address:</h6>
                  <p>
                    {`${orderDetails?.shippingAddress?.firstName} ${orderDetails?.shippingAddress?.lastName}`}
                  </p>
                  <p>{orderDetails.shippingAddress.streetAddress}</p>
                  <p>
                    {`${orderDetails?.shippingAddress?.city}, ${orderDetails?.shippingAddress?.state}, ${orderDetails?.shippingAddress?.postalCode}`}
                  </p>
                  <p>{orderDetails?.shippingAddress?.country}</p>
                  <p>Phone: {orderDetails?.shippingAddress?.phoneNumber}</p>
                </div>
              </div>
              <h5>Shipping Method: {orderDetails.shippingMethod}</h5>
              <h5>Payment Details:</h5>
              <h6>Payment Method Id: {orderDetails.paymentMethodId}</h6>
              <p>Card Number: {orderDetails.paymentDetails?.card_number}</p>
              <p>
                Card Expiry:{" "}
                {`${orderDetails.paymentDetails?.exp_month}/${orderDetails.paymentDetails?.exp_year}`}
              </p>
              <p>Card Brand: {orderDetails.paymentDetails.card_brand}</p>
              <h5>
                Payment Completed:{" "}
                {`${orderDetails.paymentSuccess ? "Success" : "Failed"}`}
              </h5>
            </div>
          </div>
        </div>
      </div>

      {orderDetails?.items?.map((item, index) => (
        <div className="card mb-4 shadow-sm" key={item.orderId}>
          <div className="card-header bg-secondary text-white">
            <h6 className="mb-0">Item Details</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div
                className="col-md-2"
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="img-fluid"
                  style={{
                    width: "150px",
                    height: "150px",
                  }}
                />
              </div>
              <div className="col-md-10">
                <h5>Product Name: {item.title}</h5>
                <h5>Price: ${item.price}</h5>
                <h5>Quantity: {item.quantity}</h5>

                <h5>Attributes:</h5>
                <ul className="list-unstyled">
                  {item?.attributes?.map((attr, idx) => (
                    <li key={idx}>
                      {attr.name}: {attr.value}
                    </li>
                  ))}
                </ul>
                <div className="form-group">
                  {item.status === "cancelled" ? (
                    <>
                      <h4>Item Status</h4>
                      <h5>{item.status}</h5>
                    </>
                  ) : (
                    <>
                      {" "}
                      <label htmlFor={`itemStatus-${index}`}>Item Status</label>
                      <select
                        className="form-control"
                        id={`itemStatus-${index}`}
                        value={itemStatus[index]}
                        onChange={(e) => handleItemStatusChange(index, e)}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="returned">Returned</option>
                      </select>
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => updateItemStatus(item.orderId, index)}
                        disabled={isUpdating || !isItemStatusChanged[index]}
                      >
                        Update Item Status
                      </button>
                    </>
                  )}
                </div>
                {item.status !== "cancelled" ? (
                  <div className="form-group mt-3">
                    <label>
                      <h5>Tracking Number:</h5>
                    </label>
                    {item.trackingNumber && !editTracking[index] ? (
                      <div>
                        <h6>{item.trackingNumber}</h6>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEditToggle(index)}
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Enter tracking number"
                          value={
                            trackingNumbers[index] || item.trackingNumber || ""
                          }
                          onChange={(e) => handleTrackingNumberChange(index, e)}
                        />
                        <button
                          className="btn btn-primary me-2"
                          onClick={() =>
                            updateTrackingNumber(item.orderId, index)
                          }
                          disabled={
                            isUpdating || !isTrackingNumberChanged[index]
                          }
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancelEdit(index)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;

import { AiOutlineDashboard, AiOutlineShoppingCart } from "react-icons/ai";
import { FaClipboardList } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { RiCouponLine } from "react-icons/ri";
import { ImBlog } from "react-icons/im";

export const MainLayoutMenuItems = [
  {
    key: "",
    icon: <AiOutlineDashboard className="fs-4" />,
    label: "Dashboard",
  },
  {
    key: "Catalog",
    icon: <AiOutlineShoppingCart className="fs-4" />,
    label: "Catalog",
    children: [
      {
        key: "product",
        icon: <AiOutlineShoppingCart className="fs-4" />,
        label: "Add Product",
      },
      {
        key: "list-product",
        icon: <AiOutlineShoppingCart className="fs-4" />,
        label: "Product List",
      },
      {
        key: "category",
        icon: <BiCategoryAlt className="fs-4" />,
        label: "Category",
      },
      {
        key: "list-category",
        icon: <BiCategoryAlt className="fs-4" />,
        label: "Category List",
      },
    ],
  },
  {
    key: "orders",
    icon: <FaClipboardList className="fs-4" />,
    label: "Orders",
  },
  // {
  //   key: "marketing",
  //   icon: <RiCouponLine className="fs-4" />,
  //   label: "Marketing",
  //   children: [
  //     {
  //       key: "coupon",
  //       icon: <ImBlog className="fs-4" />,
  //       label: "Add Coupon",
  //     },
  //     {
  //       key: "coupon-list",
  //       icon: <RiCouponLine className="fs-4" />,
  //       label: "Coupon List",
  //     },
  //   ],
  // },
  // {
  //   key: "enquiries",
  //   icon: <FaClipboardList className="fs-4" />,
  //   label: "Enquiries",
  // },
];

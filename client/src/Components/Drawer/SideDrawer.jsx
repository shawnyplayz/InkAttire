import React, { useState } from "react";
import { Button, Drawer, Radio, Space } from "antd";
import { FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";
const menu = [
  {
    text: "Add Product",
    link: "/createproduct",
  },
  {
    text: "Catalogue Management",
    link: "/cataloguemanagement",
  },
  {
    text: "Update Product",
    link: "/updateproduct",
  },
  {
    text: "Delete Product",
    link: "/deleteproduct",
  },
  {
    text: "View Products",
    link: "/viewproducts",
  },
  {
    text: "View Users",
    link: "/viewusers",
  },
];
function SideDrawer() {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");
  const showDrawer = () => {
    setOpen(true);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <button
        type="primary"
        onClick={showDrawer}
        className="top-1/2 fixed rounded-lg text-6xl z-10"
      >
        <div className="rounded-full bg-orange-400 border-spacing-8 p-4">
          <FaArrowRight />
        </div>
      </button>
      <Drawer
        title="Ink Attire Action Menu"
        placement={placement}
        width={500}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Close Menu</Button>
          </Space>
        }
      >
        <ul>
          {/* <li>
            <NavLink to="/createproduct">
              <div className="card hover:bg-blue-300 hover:text-white text-xl font-medium">
                Add a Product
              </div>
            </NavLink>
          </li> */}
          {menu.map((el) => {
            return (
              <li onClick={onClose}>
                <NavLink to={el.link}>
                  <div className="card hover:bg-blue-300 hover:text-white text-xl font-medium my-8">
                    {el.text}
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </Drawer>
    </>
  );
}

export default SideDrawer;

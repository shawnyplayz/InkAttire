import React, { useState } from "react";
import { Button, Drawer, Radio, Space } from "antd";
import { FaArrowRight } from "react-icons/fa";
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
        className="top-1/2 absolute rounded-lg text-6xl"
      >
        <div className="rounded-full bg-orange-400 border-spacing-8">
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
            {/* <Button type="primary" onClick={onClose}>
              OK
            </Button> */}
          </Space>
        }
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
}

export default SideDrawer;

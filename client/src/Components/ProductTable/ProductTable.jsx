import React, { useEffect, useState } from "react";
import GlobalForm from "../GlobalForm/GlobalForm";
import { Table } from "antd";
import PageWrapper from "../PageContainer/PageWrapper";
import { getAxiosCall } from "../../Axios/UniversalAxiosCalls";
import { useNavigate } from "react-router-dom";

function ProductTable(props) {
  const columns = [
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Discount (%)",
      dataIndex: "discount_percent",
      key: "discount_percent",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
  ];
  const [result, setResult] = useState(null);
  const [switchRoutes, setSwitchRoutes] = useState(false);
  const navigateTo = useNavigate();
  useEffect(() => {
    answer();
  }, []);
  const answer = async () => {
    const result = await getAxiosCall("/product");
    setResult(result.data);
  };
  return (
    <PageWrapper title={`${props.pageMode} Products`}>
      <Table
        columns={columns}
        dataSource={result}
        size="large"
        style={{
          width: "100rem",
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              navigateTo(
                props.pageMode === "View"
                  ? "/viewinner"
                  : props.pageMode === "Delete"
                  ? "/deleteinner"
                  : "/updateinner",
                { state: record }
              );
            },
          };
        }}
        scroll={{
          x: 1500,
          y: 1000,
        }}
      />
    </PageWrapper>
  );
}

export default ProductTable;

import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import PageWrapper from "../PageContainer/PageWrapper";
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from "antd";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
function CreateProduct() {
  return (
    <>
      <PageWrapper title="Add Product">
        <div className="container mx-auto p-4 text-xl">
          <form>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 ">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  SKU
                </label>
                <input
                  type="text"
                  id="SKU"
                  name="SKU"
                  className="mt-1 p-2 block w-full border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  className="mt-1 p-2 block w-full border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="mt-1 p-2 block w-full border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Length in inches
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="mt-1 p-2 block w-full border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Width in inches
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="mt-1 p-2 block w-full border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price in Rupees
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="mt-1 p-2 block w-full border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Discount in %
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="mt-1 p-2 block w-full border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Size
                </label>
                <Select
                  showSearch
                  placeholder="Select Size"
                  style={{
                    width: 200,
                    marginTop: "0.25rem",
                  }}
                  size="large"
                  options={[
                    {
                      value: "xs",
                      label: "Extra Small",
                    },
                    {
                      value: "S",
                      label: "Small",
                    },
                    {
                      value: "M",
                      label: "Medium",
                    },
                    {
                      value: "L",
                      label: "Large",
                    },
                  ]}
                  //   onChange={()}
                ></Select>
              </div>
            </div>
            <div className="my-5">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                required
                type="text"
                id="desc"
                name="desc"
                className="mt-1 p-2 block w-full border rounded-md"
              />
            </div>
            <div className="my-5">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Pictures
              </label>
              <Upload
                action="/upload.do"
                listType="picture-card"
                multiple="false"
              >
                <div>
                  <PlusOutlined />
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </div>
              </Upload>
            </div>
            <div className="acitonButtons w-full flex justify-center">
              <button
                className="my-4 text-black p-4 font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                type="submit"
              >
                Save Data
              </button>
            </div>
          </form>
        </div>
        {/* <Form
          labelCol={{
            span: 10,
          }}
          wrapperCol={{
            span: 25,
          }}
          layout="horizontal"
        >
          <Form.Item label="SKU">
            <Input type="text" size="large" />
          </Form.Item>
          <Form.Item label="Title">
            <Input type="text" size="large" />
          </Form.Item>
          <Form.Item label="Description">
            <Input type="text" size="large" />
          </Form.Item>

          <Form.Item label="InputNumber">
            <InputNumber />
          </Form.Item>
          <Form.Item label="TextArea">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Switch" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            label="Upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload action="/upload.do" listType="picture-card">
              <div>
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item label="Button">
            <Button>Button</Button>
          </Form.Item>
          <Form.Item label="Slider">
            <Slider />
          </Form.Item>
        </Form> */}
      </PageWrapper>
    </>
  );
}

export default CreateProduct;

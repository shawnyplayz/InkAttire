import React, { useState } from "react";
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
import { postAxiosCall } from "../../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
const { TextArea } = Input;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
function CreateProduct() {
  const [inputs, setInputs] = useState({});
  const submit = async (e) => {
    debugger;
    e.preventDefault();
    try {
      const answer = await postAxiosCall("/product", inputs);
      debugger;
      if (answer) {
        Swal.fire({
          title: "Success",
          text: answer?.message,
          icon: "success",
          confirmButtonText: "Great!",
        });
        setInputs({});
      }
    } catch (error) {
      Swal.fire({
        title: "error",
        text: error,
        icon: "error",
        confirmButtonText: "Alright!",
      });
    }
  };
  return (
    <>
      <PageWrapper title="Add Product">
        <div className="container mx-auto p-4 text-xl">
          <form onSubmit={(e) => submit(e)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  SKU
                </label>
                <Input
                  required
                  type="text"
                  id="sku"
                  name="sku"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({ [e.target.name]: e.target.value });
                  }}
                  value={inputs?.sku}
                />
              </div>
              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Name
                </label>
                <Input
                  type="text"
                  required
                  name="name"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({ ...inputs, [e.target.name]: e.target.value });
                  }}
                  value={inputs?.name}
                />
              </div>
              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({ ...inputs, [e.target.name]: e.target.value });
                  }}
                  value={inputs?.title}
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Length in inches
                </label>
                <Input
                  type="number"
                  id="length"
                  name="length"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    debugger;
                    setInputs({
                      ...inputs,
                      [e.target.name]: Number(e.target.value),
                    });
                  }}
                  value={inputs.length}
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Width in inches
                </label>
                <Input
                  type="number"
                  id="width"
                  name="width"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      [e.target.name]: Number(e.target.value),
                    });
                  }}
                  value={inputs.width}
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price in Rupees
                </label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      [e.target.name]: Number(e.target.value),
                    });
                  }}
                  value={inputs.price}
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Discount in %
                </label>
                <Input
                  type="number"
                  id="discount_percent"
                  name="discount_percent"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      [e.target.name]: Number(e.target.value),
                    });
                  }}
                  value={inputs.discount_percent}
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantity
                </label>
                <Input
                  required
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      [e.target.name]: Number(e.target.value),
                    });
                  }}
                  value={inputs.quantity}
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
                    width: "100%",
                    marginTop: "0.25rem",
                  }}
                  size="large"
                  value={inputs?.size}
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
                  onChange={(e) => {
                    setInputs({ ...inputs, size: e });
                  }}
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
              <TextArea
                required
                type="text"
                id="description"
                name="description"
                className="mt-1 p-2 block w-full border rounded-md"
                onChange={(e) => {
                  setInputs({ ...inputs, [e.target.name]: e.target.value });
                }}
                value={inputs?.description}
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
                multiple={false}
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
            <Input />
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

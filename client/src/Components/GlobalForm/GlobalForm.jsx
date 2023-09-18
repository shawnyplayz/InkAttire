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
  Spin,
  Switch,
  TreeSelect,
  Upload,
} from "antd";
import { postAxiosCall } from "../../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import FormItem from "antd/es/form/FormItem";
const { TextArea } = Input;
function GlobalForm(props) {
  const opt = [
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
  ];
  const [inputs, setInputs] = useState({});
  const [imageArray, setImageArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const convertAllToBase64 = async () => {
    let B64Array = {};
    let asd;
    for (let i = 0; i < imageArray.length; i++) {
      const base64String = await getBase64(imageArray[i]?.originFileObj);
      B64Array[`image_${i}`] = base64String;
    }
    let dummyObj = { productImages: B64Array };
    asd = Object.assign(inputs, dummyObj);
    setInputs(asd);
    if (
      asd?.productImages?.length === 0 ||
      !asd?.productImages ||
      asd?.productImages == undefined
    ) {
      Swal.fire({
        title: "error",
        text: "Images Required",
        icon: "error",
        confirmButtonText: "Alright!",
      });
      return;
    }
  };

  const submit = async () => {
    if (props.pageMode === "Add") {
      try {
        const answer = await postAxiosCall("/product", inputs);

        if (answer) {
          Swal.fire({
            title: "Success",
            text: answer?.message,
            icon: "success",
            confirmButtonText: "Great!",
          });
          setInputs();
          window.location.reload();
        }
      } catch (error) {
        Swal.fire({
          title: "error",
          text: error,
          icon: "error",
          confirmButtonText: "Alright!",
        });
      }
    }
  };
  const askModal = async () => {
    // e.preventDefault();

    if (!inputs.hasOwnProperty("size")) {
      Swal.fire({
        title: "Error",
        text: "Please select a size",
        icon: "error",
        confirmButtonText: "ok",
      });
      return;
    }
    await convertAllToBase64();
    Swal.fire({
      title: "info",
      text: "Are You Sure You want to Add This Data",
      icon: "info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        submit();
      }
    });
  };
  return (
    <PageWrapper title={`${props?.pageMode} Product`}>
      {props.pageMode === "Add" ? (
        <div className="container mx-auto p-4 text-xl">
          <Spin spinning={loading}>
            <Form onFinish={askModal}>
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
                      setInputs({
                        ...inputs,
                        [e.target.name]: e.target.value,
                      });
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
                      setInputs({
                        ...inputs,
                        [e.target.name]: e.target.value,
                      });
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
                    required
                    type="text"
                    id="title"
                    name="title"
                    className="mt-1 p-2 block w-full border rounded-md"
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        [e.target.name]: e.target.value,
                      });
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
                    required
                    type="number"
                    id="Length"
                    name="Length"
                    className="mt-1 p-2 block w-full border rounded-md"
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        [e.target.name]: Number(e.target.value),
                      });
                    }}
                    value={inputs?.Length}
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
                    required
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
                    value={inputs?.width}
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
                    required
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
                    value={inputs?.price}
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
                    value={inputs?.discount_percent}
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
                    value={inputs?.quantity}
                  />
                </div>
                <div>
                  <label
                    htmlFor="number"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Size
                  </label>
                  <select
                    required
                    value={inputs?.size}
                    onChange={(e) => {
                      setInputs({ ...inputs, size: e.target.value });
                    }}
                    name="size"
                    size="large"
                    className="mt-1 p-2 block w-full border rounded-md"
                    placeholder="Enter a Size"
                  >
                    {opt.map((el) => {
                      return (
                        <>
                          <option value="" selected disabled hidden>
                            Choose here
                          </option>
                          <option value={el.value}>{el.label}</option>
                        </>
                      );
                    })}
                  </select>
                  {/* <Select
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
                /> */}
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
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  // action="/upload.do"
                  listType="picture-card"
                  multiple={false}
                  name="productImages"
                  fileList={imageArray}
                  maxCount={4}
                  onChange={(e) => {
                    setImageArray(e.fileList);
                  }}
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
            </Form>
          </Spin>
        </div>
      ) : (
        ""
      )}
    </PageWrapper>
  );
}

export default GlobalForm;

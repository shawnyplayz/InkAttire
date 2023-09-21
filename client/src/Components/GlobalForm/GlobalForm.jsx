import React, { useEffect, useState } from "react";
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
import {
  deleteAxiosCall,
  postAxiosCall,
  updateAxiosCall,
} from "../../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;
function GlobalForm(props) {
  const opt = [
    {
      value: "XS",
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
  const [imageClone, setImageClone] = useState(props?.record?.productImages);
  const [imageArray, setImageArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const NavigateTo = useNavigate();
  useEffect(() => {
    if (props?.record) {
      setInputs(props.record);
    }
  }, []);
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const convertAllToBase64 = async () => {
    if (props.pageMode === "Add") {
      if (imageArray.length != 0) {
        let B64Array = [];
        let asd;
        for (let i = 0; i < imageArray.length; i++) {
          const base64String = await getBase64(imageArray[i]?.originFileObj);
          B64Array.push(base64String);
        }
        let dummyObj = { productImages: [...B64Array] };
        asd = Object.assign(inputs, { productImages: dummyObj?.productImages });
        setInputs({ ...inputs, productImages: asd });
      }
    } else {
      if (imageArray.length != 0) {
        let B64Array = [];
        let asd;
        for (let i = 0; i < imageArray.length; i++) {
          const base64String = await getBase64(imageArray[i]?.originFileObj);
          B64Array.push(base64String);
        }
        let dummyObj = [...inputs?.productImages];

        dummyObj = [...dummyObj, ...B64Array];
        asd = Object.assign(inputs, { productImages: dummyObj });
        setInputs({ ...inputs, productImages: asd });
      }
    }
  };

  const submit = async () => {
    if (
      inputs?.productImages?.length === 0 ||
      !inputs?.productImages ||
      inputs?.productImages == undefined
    ) {
      Swal.fire({
        title: "error",
        text: "Images Required",
        icon: "error",
        confirmButtonText: "Alright!",
      });
      return;
    }
    if (!inputs.hasOwnProperty("productImages")) {
      Swal.fire({
        title: "Error",
        text: "Please Upload Images",
        icon: "error",
        confirmButtonText: "ok",
      });
      return;
    }
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
  };
  const remove = async () => {
    const answer = await deleteAxiosCall("/product", inputs._id);

    console.log("answer", answer);
    if (answer) {
      Swal.fire({
        title: "Success",
        text: answer?.message,
        icon: "success",
        confirmButtonText: "Great!",
      });
      setInputs();
      NavigateTo("/deleteproduct");
    }
  };
  const update = async () => {
    if (
      inputs?.productImages?.length === 0 ||
      !inputs?.productImages ||
      inputs?.productImages == undefined
    ) {
      Swal.fire({
        title: "error",
        text: "Images Required",
        icon: "error",
        confirmButtonText: "Alright!",
      });
      return;
    }
    const answer = await updateAxiosCall("/product", inputs.sku, inputs);

    console.log("answer", answer);
    if (answer) {
      Swal.fire({
        title: "Success",
        text: answer?.message,
        icon: "success",
        confirmButtonText: "Great!",
      });
      setInputs();
      NavigateTo("/updateproduct");
    }
  };
  const askModal = async () => {
    for (const key in inputs) {
      if (Object.hasOwnProperty.call(inputs, key)) {
        if (
          typeof inputs[key] === "number" &&
          inputs[key] === 0 &&
          key != "discount_percent" &&
          key != "__v"
        ) {
          // const el = inputs[key];
          Swal.fire({
            title: "Error",
            text: `${key} can not be zero`,
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }
      }
    }
    switch (props.pageMode) {
      case "Add":
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
        break;
      case "Delete":
        Swal.fire({
          title: "info",
          text: "Are You Sure You want to Delete This Product",
          icon: "info",
          confirmButtonText: "Delete",
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            remove();
          }
        });
        break;
      case "Update":
        await convertAllToBase64();
        Swal.fire({
          title: "info",
          text: "Are You Sure You want to Add This Data",
          icon: "info",
          confirmButtonText: "Confirm",
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            update();
          }
        });
        break;
      default:
        break;
    }
  };
  const deleteImage = async (imageIndex) => {
    const dupli = inputs?.productImages;
    dupli?.splice(imageIndex, 1);
    console.log(dupli);
    setInputs({ ...inputs, productImages: dupli });
  };
  const deleteModal = (index) => {
    Swal.fire({
      title: "info",
      text: "Are You Sure You want to Delete This Picture",
      icon: "info",
      confirmButtonText: "Delete",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteImage(index);
      }
    });
  };
  return (
    <PageWrapper title={`${props?.pageMode} Product`}>
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
                  disabled={props?.pageMode !== "Add" ? true : false}
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
                  disabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
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
                  disabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
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
                  Length in cms
                </label>
                <Input
                  disabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
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
                  Width in cms
                </label>
                <Input
                  disabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
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
                  Price per Unit in Rupees
                </label>
                <Input
                  disabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
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
                  disabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
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
                  disabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
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
                  disabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
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
                disabled={
                  props?.pageMode === "Delete" || props?.pageMode === "View"
                    ? true
                    : false
                }
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
            {/* Upload Pictures */}
            {props.pageMode === "Add" || props.pageMode === "Update" ? (
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
            ) : (
              ""
            )}

            {/* Pictures */}
            {props?.pageMode !== "Add" ? (
              <div className="my-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pictures
                </label>
                <div className="w-full flex flex-row">
                  {imageClone?.map((el, index) => (
                    <div className="card" key={index}>
                      <div className="flex">
                        <img src={el} alt="asd4e" className="object-contain" />
                      </div>
                      <div className="flex flex-row justify-center items-end">
                        <button
                          className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                          onClick={() => deleteModal(index)}
                          type="button"
                        >
                          Delete Picture
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              ""
            )}
            {props.pageMode === "View" ? (
              ""
            ) : (
              <div className="acitonButtons w-full flex justify-center">
                <button
                  className="my-4 text-black p-4 font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                  type="submit"
                >
                  {props.pageMode} Data
                </button>
              </div>
            )}
          </Form>
        </Spin>
      </div>
      {/* {props.pageMode === "Add" ? (
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
                        [e.target.name]: (e.target.value).toUpperCase(),
                      });
                    }}
                    value={(inputs?.sku)}
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
      ) : props.pageMode === "Delete" ? (
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                  disabled={true}
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
                  Pictures
                </label>
                <div className="w-full flex flex-row">
                  {inputs.productImages?.map((el) => {
                    return (
                      <div className="card">
                        <img src={el} alt="asd4e" />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="acitonButtons w-full flex justify-center">
                <button
                  className="my-4 text-black p-4 font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                  type="submit"
                >
                  {props.pageMode} Data
                </button>
              </div>
            </Form>
          </Spin>
        </div>
      ) : props.pageMode === "View" ? (
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                  disabled={true}
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
                  Pictures
                </label>
                <div className="w-full flex flex-row">
                  {inputs.productImages?.map((el) => {
                    return (
                      <div className="card">
                        <img src={el} alt="asd4e" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </Form>
          </Spin>
        </div>
      ) : props.pageMode === "Update" ? (
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
                    disabled={true}
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
                    disabled={false}
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
                    disabled={false}
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
                    disabled={false}
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
                    disabled={false}
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
                    disabled={false}
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
                    disabled={false}
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
                    disabled={false}
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
                    disabled={false}
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
                  disabled={false}
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
              {imageClone?.productImages?.length != 0 ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pictures
                  </label>
                  <div className="w-full flex flex-row">
                    {imageClone?.map((el, index) => (
                      <div className="card" key={index}>
                        <div className="flex">
                          <img
                            src={el}
                            alt="asd4e"
                            className="object-contain"
                          />
                        </div>
                        <div className="flex flex-row justify-center items-end">
                          <button
                            className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                            onClick={() => deleteModal(index)}
                            type="button"
                          >
                            Delete Picture
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="acitonButtons w-full flex justify-center">
                <button
                  className="my-4 text-black p-4 font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                  type="submit"
                >
                  {props.pageMode} Data
                </button>
              </div>
            </Form>
          </Spin>
        </div>
      ) : (
        ""
      )} */}
    </PageWrapper>
  );
}

export default GlobalForm;

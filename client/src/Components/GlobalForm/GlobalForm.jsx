import React, { useEffect, useRef, useState } from "react";
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
  Slider,
  Spin,
  Switch,
  TreeSelect,
  Upload,
} from "antd";
import {
  deleteAxiosCall,
  getAxiosCall,
  postAxiosCall,
  updateAxiosCall,
} from "../../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
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
  const [clothingOptions, setClothingOptions] = useState(null);
  const [genreOptions, setGenreOptions] = useState(null);
  const [imageArray, setImageArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const priceRef = useRef();
  const quantityRef = useRef();
  const discount_percentRef = useRef();
  const NavigateTo = useNavigate();
  useEffect(() => {
    callCatalogue();
    if (props?.record) {
      setInputs(props.record);
    }
  }, []);
  useEffect(() => {
    if (
      Number(priceRef.current.input.value) === inputs?.price ||
      Number(quantityRef.current.input.value) === inputs?.quantity ||
      Number(discount_percentRef.current.input.value) ===
        inputs?.discount_percent
    ) {
      let _totalPrice = inputs.price;
      let savings;
      if (inputs.discount_percent) {
        savings = (inputs.price * inputs.discount_percent) / 100;
        _totalPrice = _totalPrice - savings;
      }

      setInputs({
        ...inputs,
        savings: savings,
        totalPrice: _totalPrice,
      });
    }
  }, [inputs?.price, inputs?.quantity, inputs?.discount_percent]);
  const callCatalogue = async () => {
    const getOptions = await getAxiosCall("/catalogue");
    let clothingOptions = getOptions?.data?.clothingType;
    let genreOptions = getOptions?.data?.genre;
    if (clothingOptions) {
      const collectClothing = clothingOptions?.map((el) => ({
        label: el.clothingType,
        value: el.clothingType,
      }));
      const collectGenre = genreOptions?.map((el) => ({
        label: el.genre,
        value: el.genre,
      }));
      setClothingOptions(collectClothing);
      setGenreOptions(collectGenre);
    }
  };
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
      const answer = await postAxiosCall("/products", inputs);

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
    const answer = await deleteAxiosCall("/products", inputs._id);

    "answer", answer;
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
    const answer = await updateAxiosCall("/products", inputs.sku, inputs);

    "answer", answer;
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
    dupli;
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
                      [e.target.name]: e.target.value.toUpperCase(),
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
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type of Clothing
                </label>
                <Select
                  required
                  isClearable
                  isMulti={false}
                  onChange={(e) => {
                    setInputs(
                      { ...inputs, clothingType: e.value },
                      () => ("inputs==>", inputs)
                    );
                  }}
                  isDisabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
                  options={clothingOptions}
                  isSearchable
                  styles={{ width: "100%" }}
                  value={{
                    label: inputs?.clothingType,
                    value: inputs?.clothingType,
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-gray-700"
                >
                  Genre
                </label>
                <Select
                  placeholder="The Theme of the Tattoo"
                  required
                  isMulti={false}
                  onChange={(e) => {
                    setInputs({ ...inputs, genre: e.value });
                  }}
                  isDisabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
                  isClearable
                  options={genreOptions}
                  isSearchable
                  value={{ label: inputs?.genre, value: inputs?.genre }}
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
                  ref={priceRef}
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
                  Quantity
                </label>
                <Input
                  disabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
                  // defaultValue={Number(1)}
                  required
                  ref={quantityRef}
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
                  Discount in % (per Unit)
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
                  ref={discount_percentRef}
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
                  Total Price per Unit
                </label>
                <Input
                  disabled={true}
                  required
                  type="number"
                  id="totalPrice"
                  name="totalPrice"
                  className="mt-1 p-2 block w-full border rounded-md"
                  value={inputs?.totalPrice}
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Savings per Unit
                </label>
                <Input
                  disabled={true}
                  required
                  type="number"
                  id="savings"
                  name="savings"
                  className="mt-1 p-2 block w-full border rounded-md"
                  value={inputs?.savings}
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
                      <div className="flex h-1/2 justify-center">
                        <img src={el} alt="asd4e" className="object-contain" />
                      </div>
                      {props.pageMode !== "View" &&
                      props.pageMode !== "Delete" ? (
                        <div className="flex flex-row justify-center items-end">
                          <button
                            className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                            onClick={() => deleteModal(index)}
                            type="button"
                          >
                            Delete Picture
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
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
    </PageWrapper>
  );
}

export default GlobalForm;

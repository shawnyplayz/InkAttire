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
  Space,
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
import { SearchOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
const { TextArea } = Input;
function GlobalForm(props) {
  const opt = [
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
    {
      value: "XL",
      label: "Extra Large",
    },
  ];
  const shadeOpt = [
    {
      value: "Light",
      label: "Light Skin",
    },
    {
      value: "Dark",
      label: "Dark Skin",
    },
  ];
  const [inputs, setInputs] = useState({});
  const [quantity, setQuantity] = useState([]);
  const [quantityDk, setQuantityDk] = useState([]);
  const [imageClone, setImageClone] = useState(props?.record?.productImages);
  const [clothingOptions, setClothingOptions] = useState(null);
  const [genreOptions, setGenreOptions] = useState(null);
  const [gender, setGender] = useState(null);
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
      Number(quantityRef.current?.input?.value) === inputs?.quantity ||
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
  }, [inputs?.price, inputs?.discount_percent]);
  useEffect(() => {
    setQuantity(props?.record?.quantity?.quantityLight);
    setQuantityDk(props?.record?.quantity?.quantityDark);
  }, [props?.record?.quantity]);
  //To check if the object is empty
  const isEmpty = () => {
    for (const prop in inputs) {
      if (Object.hasOwn(inputs, prop)) {
        return false;
      }
    }
    return true;
  };
  useEffect(() => {
    if (!isEmpty()) {
      let totalQuant = [
        {
          quantityLight: quantity,
          quantityDark: quantityDk,
        },
      ];
      setInputs({
        ...inputs,
        quantity: totalQuant[0],
      });
    }
  }, [quantity, quantityDk]);

  const callCatalogue = async () => {
    const getOptions = await getAxiosCall("/catalogue");
    let clothingOptions = getOptions?.data?.clothingType;
    let genreOptions = getOptions?.data?.genre;
    let cg = getOptions?.data?.cg;
    if (clothingOptions) {
      const collectClothing = clothingOptions?.map((el) => ({
        label: el.clothingType,
        value: el.clothingType,
      }));
      const collectGenre = genreOptions?.map((el) => ({
        label: el.genre,
        value: el.genre,
      }));
      const gender = cg?.map((el) => ({
        label: el,
        value: el,
      }));
      setClothingOptions(collectClothing);
      setGenreOptions(collectGenre);
      setGender(gender);
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
      if (imageArray?.length != 0) {
        let B64Array = [];
        let asd;
        for (let i = 0; i < imageArray?.length; i++) {
          const base64String = await getBase64(imageArray[i]?.originFileObj);
          B64Array.push(base64String);
        }
        let dummyObj = { productImages: [...B64Array] };
        debugger;
        asd = Object.assign(inputs, { productImages: dummyObj?.productImages });
        setInputs({ ...inputs, productImages: asd });
      }
    } else {
      if (imageArray?.length != 0) {
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
    debugger;
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
        allowOutsideClick: false,
      });
      return;
    }
    if (!inputs.hasOwnProperty("productImages")) {
      Swal.fire({
        title: "Error",
        text: "Please Upload Images",
        icon: "error",
        confirmButtonText: "ok",
        allowOutsideClick: false,
      });
      return;
    }
    try {
      debugger;
      const answer = await postAxiosCall("/products/createProduct", inputs);
      if (answer) {
        Swal.fire({
          title: "Success",
          text: answer?.message,
          icon: "success",
          confirmButtonText: "Great!",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            setInputs();
            window.location.reload();
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: "error",
        text: error,
        icon: "error",
        confirmButtonText: "Alright!",
        allowOutsideClick: false,
      });
    }
  };
  const remove = async () => {
    const answer = await postAxiosCall("/products/deleteProduct", inputs);
    if (answer) {
      Swal.fire({
        title: "Success",
        text: answer?.message,
        icon: "success",
        confirmButtonText: "Great!",
        allowOutsideClick: false,
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
        allowOutsideClick: false,
      });
      return;
    }

    const answer = await postAxiosCall("/products/updateProduct", inputs);
    if (answer) {
      Swal.fire({
        title: "Success",
        text: answer?.message,
        icon: "success",
        confirmButtonText: "Great!",
        allowOutsideClick: false,
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
          key != "sales" &&
          key != "__v"
        ) {
          Swal.fire({
            title: "Error",
            text: `${key} can not be zero`,
            icon: "error",
            confirmButtonText: "OK",
            allowOutsideClick: false,
          });
          return;
        }
      }
    }
    switch (props.pageMode) {
      case "Add":
        if (!quantity && !quantityDk) {
          return Swal.fire({
            title: "Error",
            text: "Please Enter Quantity",
            icon: "error",
            confirmButtonText: "ok",
            allowOutsideClick: false,
          });
        }
        let isEmptyObject_Li;
        let isEmptyObject_Dk;
        let allValuesAreZero_Li;
        let allValuesAreZero_Dk;
        if (quantity) {
          debugger;
          isEmptyObject_Li = Object.keys(quantity)?.length === 0;
          // Check if all values are zero
          allValuesAreZero_Li = Object.values(quantity)?.every(
            (value) => value === 0
          );
        }
        if (quantityDk) {
          isEmptyObject_Dk = Object.keys(quantityDk)?.length === 0;
          allValuesAreZero_Dk = Object.values(quantityDk)?.every(
            (value) => value === 0
          );
          if (
            isEmptyObject_Li ||
            (allValuesAreZero_Li && isEmptyObject_Dk) ||
            allValuesAreZero_Dk
          ) {
            return Swal.fire({
              title: "Error",
              text: "Please Enter Quantity",
              icon: "error",
              confirmButtonText: "ok",
              allowOutsideClick: false,
            });
          }
        }

        if (!inputs.hasOwnProperty("clothingType")) {
          Swal.fire({
            title: "Error",
            text: "Please select a Clothing Type",
            icon: "error",
            confirmButtonText: "ok",
            allowOutsideClick: false,
          });
          return;
        }
        if (!inputs.hasOwnProperty("genre")) {
          Swal.fire({
            title: "Error",
            text: "Please select a Genre",
            icon: "error",
            confirmButtonText: "ok",
            allowOutsideClick: false,
          });
          return;
        }
        if (!inputs.hasOwnProperty("gender")) {
          Swal.fire({
            title: "Error",
            text: "Please select a Clothing fit",
            icon: "error",
            confirmButtonText: "ok",
            allowOutsideClick: false,
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
          allowOutsideClick: false,
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
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            remove();
          }
        });
        break;
      case "Update":
        let isEmptyObject_Li_Update;
        let isEmptyObject_Dk_Update;
        let allValuesAreZero_Li_Update;
        let allValuesAreZero_Dk_Update;
        let count = 0;
        debugger;
        if (quantity) {
          isEmptyObject_Li_Update = Object.keys(quantity)?.length === 0;
          if (!isEmptyObject_Li_Update) {
            // Check if all values are zero
            allValuesAreZero_Li_Update = Object.values(quantity)?.every(
              (value) => value === 0
            );
          }
          if (allValuesAreZero_Li_Update) {
            count++;
          }
        } else {
          count++;
        }
        if (quantityDk) {
          isEmptyObject_Dk_Update = Object.keys(quantityDk)?.length === 0;
          if (!isEmptyObject_Dk_Update) {
            allValuesAreZero_Dk_Update = Object.values(quantityDk)?.every(
              (value) => value === 0
            );
          }
          if (allValuesAreZero_Dk_Update) {
            count++;
          }
        } else {
          count++;
        }
        if (count == 2) {
          return Swal.fire({
            title: "Error",
            text: "Please Enter Quantity",
            icon: "error",
            confirmButtonText: "ok",
            allowOutsideClick: false,
          });
        }
        await convertAllToBase64();
        Swal.fire({
          title: "info",
          text: "Are You Sure You want to Add This Data",
          icon: "info",
          confirmButtonText: "Confirm",
          showCancelButton: true,
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            console.log("inputs", inputs);
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
    setInputs({ ...inputs, productImages: dupli });
  };
  const deleteModal = (index) => {
    Swal.fire({
      title: "info",
      text: "Are You Sure You want to Delete This Picture",
      icon: "info",
      confirmButtonText: "Delete",
      showCancelButton: true,
      allowOutsideClick: false,
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
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type of Clothing
                </label>
                <select
                  required
                  onChange={(e) => {
                    setInputs({ ...inputs, clothingType: e.target.value });
                  }}
                  isDisabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
                  size="large"
                  className="mt-1 p-2 block w-full border rounded-md"
                  name="clothingType"
                  value={inputs?.clothingType}
                >
                  {clothingOptions?.map((el) => {
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
              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-gray-700"
                >
                  Genre
                </label>
                <select
                  placeholder="The Theme of the Tattoo"
                  required
                  onChange={(e) => {
                    setInputs({ ...inputs, genre: e.target.value });
                  }}
                  isDisabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
                  size="large"
                  className="mt-1 p-2 block w-full border rounded-md"
                  name="genre"
                  value={inputs?.genre}
                >
                  {genreOptions?.map((el) => {
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
                  Quantity - Light Skin Shade
                </label>

                {opt?.map((el) => {
                  return (
                    <Space.Compact>
                      <Input
                        style={{
                          width: "40%",
                        }}
                        defaultValue={el.label}
                        disabled
                        value={el?.label}
                      />
                      <InputNumber
                        style={{
                          width: "60%",
                        }}
                        defaultValue="0"
                        disabled={
                          props?.pageMode === "Delete" ||
                          props?.pageMode === "View"
                            ? true
                            : false
                        }
                        name={el.value}
                        onChange={(e) => {
                          debugger;
                          let asd = {
                            ...quantity,
                            [el.value]: Number(e),
                          };
                          setQuantity(asd);
                        }}
                        value={quantity?.[el.value]}
                      />
                    </Space.Compact>
                  );
                })}
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantity - Dark Skin Shade
                </label>
                {opt?.map((el) => {
                  return (
                    <Space.Compact>
                      <Input
                        style={{
                          width: "40%",
                        }}
                        defaultValue={el.label}
                        disabled
                        value={el?.label}
                      />
                      <InputNumber
                        style={{
                          width: "60%",
                        }}
                        ty
                        defaultValue="0"
                        disabled={
                          props?.pageMode === "Delete" ||
                          props?.pageMode === "View"
                            ? true
                            : false
                        }
                        name={el.value}
                        onChange={(e) => {
                          let asd = {
                            ...quantityDk,
                            [el.value]: Number(e),
                          };
                          setQuantityDk(asd);
                        }}
                        value={quantityDk?.[el.value]}
                      />
                    </Space.Compact>
                  );
                })}
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
                  value={inputs?.savings ? inputs?.savings : 0}
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender{" "}
                </label>
                <select
                  disabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
                  required
                  value={inputs?.gender}
                  onChange={(e) => {
                    setInputs({ ...inputs, gender: e.target.value });
                  }}
                  name="gender"
                  size="large"
                  className="mt-1 p-2 block w-full border rounded-md"
                >
                  {gender?.map((el) => {
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
            <div className="my-5">
              <label
                htmlFor="name"
                className="block text-7xl font-semibold text-gray-700"
              >
                Sales
              </label>
              {inputs.sales ? inputs.sales : 0}
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
                      <div className="flex h-60 justify-center">
                        <img
                          src={el?.url}
                          alt="asd4e"
                          className="object-contain"
                        />
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

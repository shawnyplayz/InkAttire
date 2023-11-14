import React, { useEffect, useState } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import { Select, Spin, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  deleteAxiosCall,
  getAxiosCall,
  postAxiosCall,
} from "../../Axios/UniversalAxiosCalls";

function CMS() {
  const [imageArray, setImageArray] = useState([]);
  const [catImage, setCatImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({});
  const [categories, setCategories] = useState({});
  const [carouselImages, setCarouselImages] = useState(null);
  const [clothingOptions, setClothingOptions] = useState([]);
  const [categoriesImg, setCategoriesImg] = useState([]);
  useEffect(() => {
    fetchCarousel();
  }, []);
  const fetchCarousel = async () => {
    const getImages = await getAxiosCall("/cms");
    const getClothingOptions = await getAxiosCall("/catalogue");
    setCarouselImages(getImages?.data?.carousel);
    setCategoriesImg(getImages?.data?.categories);
    let aggClothingOptions = getClothingOptions?.data?.clothingType.map(
      (el) => ({
        label: el.clothingType,
        value: el.clothingType,
      })
    );
    setClothingOptions(aggClothingOptions);
  };
  const deleteCarouselImages = async (id) => {
    const answer = await postAxiosCall("/cms/delete", { id });
    if (answer) {
      Swal.fire({
        title: "Success",
        text: answer?.data?.message,
        icon: "success",
        confirmButtonText: "Great!",
        allowOutsideClick: false,
      });
    }
  };
  const deleteCategoryImage = async (id) => {
    const answer = await postAxiosCall("/cms/deleteCategory", { id });
    if (answer) {
      Swal.fire({
        title: "Success",
        text: answer?.data?.message,
        icon: "success",
        confirmButtonText: "Great!",
        allowOutsideClick: false,
      });
    }
  };
  const submitCarousel = async () => {
    await convertAllToBase64();
    try {
      const answer = await postAxiosCall("/cms", inputs);
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

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const convertAllToBase64 = async (toggleCategories) => {
    if (toggleCategories) {
      if (catImage.length != 0) {
        let B64Array = [];
        let asd;
        for (let i = 0; i < catImage.length; i++) {
          const base64String = await getBase64(catImage[i]?.originFileObj);
          B64Array.push(base64String);
        }
        // let dummyObj = { catImages: [...B64Array] };

        asd = Object.assign(categories, { catImages: [...B64Array] });
        setCategories({ ...categories, catImages: [...B64Array] });
      }
    } else {
      if (imageArray.length != 0) {
        let B64Array = [];
        let asd;
        for (let i = 0; i < imageArray.length; i++) {
          const base64String = await getBase64(imageArray[i]?.originFileObj);
          B64Array.push(base64String);
        }
        let dummyObj = { carousel: [...B64Array] };
        asd = Object.assign(inputs, { carousel: dummyObj?.carousel });
        setInputs({ ...inputs, carousel: asd });
      }
    }
  };
  const deleteModal = async (id, deleteCategories) => {
    if (!deleteCategories) {
      Swal.fire({
        title: "info",
        text: "Are You Sure You want to Delete This Picture",
        icon: "info",
        confirmButtonText: "Delete",
        showCancelButton: true,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteCarouselImages(id);
          fetchCarousel();
        }
      });
    } else {
      Swal.fire({
        title: "info",
        text: "Are You Sure You want to Delete this Category",
        icon: "info",
        confirmButtonText: "Delete",
        showCancelButton: true,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteCategoryImage(id);
          fetchCarousel();
        }
      });
    }
  };
  const submitCategory = async () => {
    if (!categories.clothingType) {
      Swal.fire({
        title: "Error",
        text: "Type of Clothing not selected",
        icon: "error",
        confirmButtonText: "Alright!",
        allowOutsideClick: false,
      });
      return;
    }
    await convertAllToBase64(true);
    console.log("categories", categories);

    try {
      const answer = await postAxiosCall("/cms", categories);
      if (answer) {
        Swal.fire({
          title: "Success",
          text: answer?.message,
          icon: "success",
          confirmButtonText: "Great!",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            setCategories();
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
  return (
    <>
      <PageWrapper title="Carousel Management System">
        <div className="container mx-auto p-4 text-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            <div className="my-5 flex flex-row ">
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
                maxCount={3}
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
            <div className="my-5 flex flex-row ">
              <button
                className="my-4 p-4 flex justify-center items-center text-black font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                onClick={submitCarousel}
                disabled={imageArray.length != 0 ? false : true}
                type="button"
              >
                Save Pictures
              </button>
            </div>
          </div>
          <div className="flex flex-row justify-evenly">
            {carouselImages?.map((el, index) => {
              return (
                <div className="card" key={index}>
                  <div className="flex h-60 justify-center">
                    <img
                      src={el?.url}
                      alt="Newly added"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-row justify-center items-end">
                    <button
                      className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                      onClick={() => deleteModal(el?.public_id)}
                      type="button"
                    >
                      Delete Picture
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageWrapper>
      <PageWrapper title="Categories Management System">
        <div className="container mx-auto p-4 text-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="my-5 flex flex-row ">
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
                fileList={catImage}
                maxCount={1}
                onChange={(e) => {
                  setCatImage(e.fileList);
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
            <div className="my-5 flex flex-row ">
              <button
                className="my-4 p-4 flex justify-center items-center text-black font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                onClick={submitCategory}
                disabled={catImage.length != 0 ? false : true}
                type="button"
              >
                Map a Category
              </button>
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
                  setCategories({ ...categories, clothingType: e });
                }}
                options={clothingOptions}
                isSearchable
                styles={{ width: "100% !important" }}
                value={{
                  label: categories?.clothingType,
                  value: categories?.clothingType,
                }}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex flex-row justify-evenly">
            {categoriesImg?.map((el, index) => {
              return (
                <div className="card" key={index}>
                  <div className="flex h-60 justify-center">
                    <img
                      src={el?.categories?.url}
                      alt="Newly added"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-row justify-center items-end">
                    <label>{el?.categories?.clothingType}</label>
                  </div>
                  <div className="flex flex-row justify-center items-end">
                    <button
                      className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                      onClick={() =>
                        deleteModal(el?.categories?.public_id, true)
                      }
                      type="button"
                    >
                      Delete a Category
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

export default CMS;

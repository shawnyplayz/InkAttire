import React, { useEffect, useState } from "react";
import PageWrapper from "../Components/PageContainer/PageWrapper";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getAxiosCall, postAxiosCall } from "../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";

function Categories() {
  const [imageArray, setImageArray] = useState([]);
  const [inputs, setInputs] = useState({});
  const [categoryImg, setcategoryImg] = useState();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const getImages = await getAxiosCall("/categoriesImg");
    setcategoryImg(getImages?.data?.message);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const convertAllToBase64 = async () => {
    if (imageArray.length != 0) {
      let B64Array = [];
      let asd;
      for (let i = 0; i < imageArray.length; i++) {
        const base64String = await getBase64(imageArray[i]?.originFileObj);
        B64Array.push(base64String);
      }
      asd = Object.assign(inputs, { categoriesImg: [...B64Array] });
      setInputs({ ...inputs, categoriesImg: asd });
    }
  };
  const submitCategory = async () => {
    await convertAllToBase64();
    try {
      const answer = await postAxiosCall("/categoriesImg", inputs);
      if (answer) {
        Swal.fire({
          title: "Success",
          text: answer?.message,
          icon: "success",
          confirmButtonText: "Great!",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
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
    <PageWrapper title="Category Management System">
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
              maxCount={1}
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
              onClick={submitCategory}
              disabled={imageArray.length != 0 ? false : true}
              type="button"
            >
              Save Pictures
            </button>
          </div>
        </div>
        <div className="flex flex-row justify-evenly">
          {categoryImg?.map((el, index) => {
            return (
              <div className="card" key={index}>
                <div className="flex h-60 justify-center">
                  <img
                    src={el?.url}
                    alt="Newly added"
                    className="object-contain"
                  />
                </div>
                {/* <div className="flex flex-row justify-center items-end"></div> */}
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}

export default Categories;

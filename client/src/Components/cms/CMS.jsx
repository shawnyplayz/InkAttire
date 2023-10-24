import React, { useEffect, useState } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import { Spin, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { getAxiosCall, postAxiosCall } from "../../Axios/UniversalAxiosCalls";

function CMS() {
  const [imageArray, setImageArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({});
  const [carouselImages, setCarouselImages] = useState(null);

  useEffect(() => {
    fetchCarousel();
  }, []);
  const fetchCarousel = async () => {
    const getCarouselImages = await getAxiosCall("/cms");
    console.log("getCarouselImages.data.carousel", getCarouselImages.data);
    setCarouselImages(getCarouselImages?.data[0]?.carousel);
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
        });
      }
      setInputs();
      window.location.reload();
    } catch (error) {
      Swal.fire({
        title: "error",
        text: error,
        icon: "error",
        confirmButtonText: "Alright!",
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
  const convertAllToBase64 = async () => {
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
  };
  return (
    <PageWrapper title="Content Management System">
      <div className="container mx-auto p-4 text-xl">
        <Spin spinning={loading}>
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
            <div className="my-5 flex flex-row ">
              <button
                className="my-4 p-4 flex justify-center items-center text-black font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                type="button"
                onClick={submitCarousel}
              >
                Save Data
              </button>
            </div>
          </div>
          <div className="flex flex-row justify-evenly">
            {carouselImages?.map((el, index) => {
              return (
                <div className="card" key={index}>
                  <div className="flex h-1/2 justify-center">
                    <img
                      src={el}
                      alt="Newly added"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-row justify-center items-end">
                    <button
                      className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                      // onClick={() => deleteModal(index)}
                      type="button"
                    >
                      Delete Picture
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Spin>
      </div>
    </PageWrapper>
  );
}

export default CMS;

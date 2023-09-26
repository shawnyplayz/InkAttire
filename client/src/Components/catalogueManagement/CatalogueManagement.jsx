import React, { useState } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import { Form, Input } from "antd";
import { postAxiosCall } from "../../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";

function CatalogueManagement() {
  //   const [bodyStyle, setBodyStyle] = useState("");
  //   const [genre, setGenre] = useState("");
  const [inputs, setInputs] = useState("");
  const savestuff = async () => {
    const result = await postAxiosCall("/catalogue", {
      clothingType: inputs.clothingType,
      genre: inputs.genre,
    });
    if (result) {
      debugger;
      Swal.fire({
        title: "Success",
        text: result?.message,
        icon: "success",
        confirmButtonText: "Great!",
      });
      setInputs();
    }
  };
  return (
    <div>
      <PageWrapper title="Catalogue Management">
        <Form onFinish={savestuff}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Type of Clothing
              </label>
              <Input
                type="text"
                id="clothingType"
                name="clothingType"
                className="mt-1 p-2 block w-full border rounded-md"
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    [e.target.name]: e.target.value,
                  });
                }}
                value={inputs?.clothingType}
              />
            </div>
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Genre
              </label>
              <Input
                type="text"
                name="genre"
                id="genre"
                className="mt-1 p-2 block w-full border rounded-md"
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    [e.target.name]: e.target.value,
                  });
                }}
                value={inputs?.genre}
              />
            </div>
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
      </PageWrapper>
    </div>
  );
}

export default CatalogueManagement;

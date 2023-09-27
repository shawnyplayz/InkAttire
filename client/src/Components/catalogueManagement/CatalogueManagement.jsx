import React, { useEffect, useState } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import { Form, Input } from "antd";
import { getAxiosCall, postAxiosCall } from "../../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import Creatable from "react-select/creatable";
function CatalogueManagement() {
  //   const [bodyStyle, setBodyStyle] = useState("");
  //   const [genre, setGenre] = useState("");
  const [inputs, setInputs] = useState({});
  const [clothingOptions, setClothingOptions] = useState(null);
  const [genreOptions, setGenreOptions] = useState(null);
  useEffect(() => {
    callCatalogue();
  }, []);

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
  const saveClothing = async () => {
    const result = await postAxiosCall("/catalogue", {
      clothingType: inputs.clothingType,
    });
    if (result) {
      Swal.fire({
        title: "Success",
        text: result?.message,
        icon: "success",
        confirmButtonText: "Great!",
      }).then(() => {
        setInputs({ ...inputs, clothingType: null });
        callCatalogue();
      });
    }
  };
  const saveGenre = async () => {
    const result = await postAxiosCall("/catalogue", {
      genre: inputs.genre,
    });
    if (result) {
      Swal.fire({
        title: "Success",
        text: result?.message,
        icon: "success",
        confirmButtonText: "Great!",
      }).then(() => {
        setInputs({ ...inputs, genre: null });
        callCatalogue();
      });
    }
  };
  return (
    <div>
      <PageWrapper title="Catalogue Management">
        <Form
          // onFinish={savestuff}
          style={{ width: "50%" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Type of Clothing
              </label>
              <Creatable
                required
                isClearable
                isMulti={false}
                onChange={(e) => {
                  setInputs({ ...inputs, clothingType: e.value }, () =>
                    console.log("inputs==>", inputs)
                  );
                }}
                options={clothingOptions}
                isSearchable
                styles={{ width: "100%" }}
                value={{
                  label: inputs?.clothingType,
                  value: inputs?.clothingType,
                }}
                isOptionDisabled={(option) => {
                  let asd;
                  clothingOptions.forEach((element) => {
                    if (element.value === option.value)
                      return (asd = element.value);
                  });
                  if (option.value == asd) {
                    return true;
                  }
                }}
              />
            </div>
            <div className="acitonButtons w-full flex justify-center">
              <button
                className="my-4 text-black p-4 font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                type="button"
                onClick={saveClothing}
              >
                Save Data
              </button>
            </div>
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Genre
              </label>
              <Creatable
                placeholder="The Theme of the Tattoo"
                required
                isMulti={false}
                onChange={(e) => {
                  setInputs({ ...inputs, genre: e.value });
                }}
                isClearable
                options={genreOptions}
                isSearchable
                isOptionDisabled={(option) => {
                  let asd;
                  genreOptions.forEach((element) => {
                    if (element.value === option.value)
                      return (asd = element.value);
                  });
                  if (option.value == asd) {
                    return true;
                  }
                }}
                value={{ label: inputs?.genre, value: inputs?.genre }}
              />
            </div>
            <div className="acitonButtons w-full flex justify-center">
              <button
                className="my-4 text-black p-4 font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                type="button"
                onClick={saveGenre}
              >
                Save Data
              </button>
            </div>
          </div>
        </Form>
      </PageWrapper>
    </div>
  );
}

export default CatalogueManagement;

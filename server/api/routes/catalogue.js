const express = require("express");
const router = express.Router();
const catalogue = require("../models/catalogue");

router.get("/", async (req, res) => {
  try {
    let getCata = await catalogue.find({});
    if (getCata) {
      const clothingType = getCata?.filter((el) => {
        if (el.clothingType != undefined || !el) {
          return {
            label: el.clothingType,
            value: el.clothingType,
          };
        }
      });
      const genre = getCata?.filter((el) => {
        if (el.genre !== undefined || !el) {
          return {
            label: el.genre,
            value: el.genre,
          };
        }
      });

      getCata = { clothingType, genre };
    }
    res.status(200).json(getCata);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/", async (req, res) => {
  const createCata = new catalogue({
    clothingType: req.body?.clothingType,
    genre: req.body?.genre,
  });
  "createCata", createCata;

  if (!createCata?.clothingType && !createCata?.genre) {
    res.status(500).json({ message: "Fields cannot be empty" });
  } else if (createCata.clothingType) {
    const clothingType = await catalogue.findOne({
      clothingType: createCata.clothingType,
    });

    if (clothingType) {
      res.status(500).json({ message: "This Clothing Type already exists" });
    } else {
      try {
        ("Saving Product");
        await createCata.save();
        res.status(201).json({ message: "Successfully Added a Clothing" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  } else if (createCata.genre) {
    const genre = await catalogue.findOne({ genre: createCata.genre });
    if (genre) {
      res.status(500).json({ message: "This Genre already exists" });
    } else {
      try {
        await createCata.save();
        res.status(201).json({ message: "Successfully Added a Genre" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
  // const queryClothingType = await catalogue.findOne({
  //   clothingType: createCata.clothingType,
  // });
  // const queryGenreType = await catalogue.findOne({ genre: createCata.genre });
  // ("queryClothingType", queryClothingType);
  // ("queryGenreType", queryGenreType);

  // if (
  //   createCata?.clothingType === queryClothingType?.clothingType ||
  //   createCata?.genre === queryGenreType?.genre
  // ) {
  //   if (queryClothingType?.clothingType) {
  //     ("clothingType", queryClothingType?.clothingType);
  //     res.status(500).json({
  //       message: createCata.clothingType + " already exists",
  //     });
  //     return;
  //   } else if (queryGenreType?.genre) {
  //     ("genreType", queryGenreType?.genre);
  //     res.status(500).json({
  //       message: createCata.genre + " already exists",
  //     });
  //     return;
  //   }
  // } else {
  //   try {
  //     ("Saving Product");
  //     await createCata.save();
  //     res.status(201).json({ message: "Successfully Added a Product" });
  //   } catch (error) {
  //     res.status(500).json({ message: error });
  //   }
  // }
});
module.exports = router;

const express = require("express");
const router = express.Router();
const catalogue = require("../models/catalogue");

router.get("/", async (req, res) => {
  try {
    const getCata = await catalogue.find({});
    res.status(200).json(getCata);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/", async (req, res) => {
  const createCata = new catalogue({
    clothingType: req.body?.clothingType?.toLowerCase(),
    genre: req.body?.genre?.toLowerCase(),
  });
  console.log("createCata", createCata);
  debugger;
  if (!createCata?.clothingType && !createCata?.genre) {
    res.status(500).json({ message: "Fields cannot be empty" });
  } else if (createCata.clothingType) {
    const clothingType = await catalogue.findOne({
      clothingType: createCata.clothingType,
    });
    debugger;
    if (clothingType) {
      debugger;
      res.status(500).json({ message: "This Clothing Type already exists" });
    } else {
      try {
        console.log("Saving Product");
        await createCata.save();
        res.status(201).json({ message: "Successfully Added a Clothing" });
      } catch (error) {
        debugger;
        res.status(500).json({ message: error.message });
      }
    }
  } else if (createCata.genre) {
    debugger;
    const genre = await catalogue.findOne({ genre: createCata.genre });
    if (genre) {
      res.status(500).json({ message: "This Genre already exists" });
    } else {
      try {
        await createCata.save();
        res.status(201).json({ message: "Successfully Added a Genre" });
      } catch (error) {
        debugger;
        res.status(500).json({ message: error.message });
      }
    }
  }
  // const queryClothingType = await catalogue.findOne({
  //   clothingType: createCata.clothingType,
  // });
  // const queryGenreType = await catalogue.findOne({ genre: createCata.genre });
  // console.log("queryClothingType", queryClothingType);
  // console.log("queryGenreType", queryGenreType);

  // if (
  //   createCata?.clothingType === queryClothingType?.clothingType ||
  //   createCata?.genre === queryGenreType?.genre
  // ) {
  //   if (queryClothingType?.clothingType) {
  //     console.log("clothingType", queryClothingType?.clothingType);
  //     res.status(500).json({
  //       message: createCata.clothingType + " already exists",
  //     });
  //     return;
  //   } else if (queryGenreType?.genre) {
  //     console.log("genreType", queryGenreType?.genre);
  //     res.status(500).json({
  //       message: createCata.genre + " already exists",
  //     });
  //     return;
  //   }
  // } else {
  //   try {
  //     console.log("Saving Product");
  //     await createCata.save();
  //     res.status(201).json({ message: "Successfully Added a Product" });
  //   } catch (error) {
  //     res.status(500).json({ message: error });
  //   }
  // }
});
module.exports = router;

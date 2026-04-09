 const { responseReturn } = require("../../utiles/response");
const cloudinary = require("cloudinary").v2;
const categoryModel = require("../../models/categoryModel");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});

class categoryController {
 
   add_category = async (req, res) => {
    try {
      const { name } = req.body;

      if (!name || !name.trim()) {
        return responseReturn(res, 400, { error: "Invalid category name" });
      }

      if (!req.file) {
        return responseReturn(res, 400, { error: "Image is required" });
      }

      // 🟩 Upload to Cloudinary using buffer (since memoryStorage used)
      const result = await cloudinary.uploader.upload_stream(
        { folder: "categorys" },
        async (error, uploadResult) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return responseReturn(res, 500, { error: "Image upload failed" });
          }

          const slug = name.trim().split(" ").join("-");
          const category = await categoryModel.create({
            name: name.trim(),
            slug,
            image: uploadResult.secure_url,
          });

          return responseReturn(res, 201, {
            category,
            message: "Category Added Successfully",
          });
        }
      );

      // Write the buffer into the upload stream
      result.end(req.file.buffer);

    } catch (error) {
      console.error("Add Category Error:", error);
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  get_category = async (req, res) => {
    const { page, searchValue, parPage } = req.query;

    try {
      let skipPage = 0;
      if (parPage && page) {
        skipPage = parseInt(parPage) * (parseInt(page) - 1);
      }

      let query = {};
      if (searchValue) {
        query = { $text: { $search: searchValue } };
      }

      const categorys = await categoryModel
        .find(query)
        .skip(skipPage)
        .limit(parseInt(parPage) || 0)
        .sort({ createdAt: -1 });

      const totalCategory = await categoryModel.find(query).countDocuments();

      responseReturn(res, 200, { categorys, totalCategory });
    } catch (error) {
      console.error("Get Category Error:", error);
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  update_category = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const updateData = {};

      if (name && name.trim()) {
        updateData.name = name.trim();
        updateData.slug = name.trim().split(" ").join("-");
      }

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "categorys",
        });
        updateData.image = result.secure_url;
      }

      if (Object.keys(updateData).length === 0) {
        return responseReturn(res, 400, { error: "No valid data to update" });
      }

      const category = await categoryModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!category) {
        return responseReturn(res, 404, { error: "Category not found" });
      }

      responseReturn(res, 200, {
        category,
        message: "Category Updated successfully",
      });
    } catch (error) {
      console.error("Update Category Error:", error);
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };


  deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const deleteCategory = await categoryModel.findByIdAndDelete(categoryId);

      if (!deleteCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Delete Category Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

module.exports = new categoryController();

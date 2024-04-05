const Company = require("../models/company")
const VideoGame = require("../models/videogame")
const Platform = require("../models/platform")
const asyncHandler = require("express-async-handler")

// Display list of all companies.
exports.company_list = asyncHandler(async (req, res, next) => {
    const companyList = await Company.find({}, "name")
      .sort({name: 1})
      .exec({})

    res.render("company_list", { title: "List of Companies in Database", company_list: companyList })
  });
  
  // Display detail page for a specific company.
  exports.company_detail = asyncHandler(async (req, res, next) => {
    const [company, companyGamesDevList, companyGamesPubList, companyPlatformDevList] = await Promise.all([
      Company.findById(req.params.id).exec(),
      VideoGame.find( { developer: req.params.id }, "name").exec(),
      VideoGame.find( { publisher: req.params.id }, "name").exec(),
      Platform.find( { developer: req.params.id }, "name").exec(),
    ]);
  
    if (company === null) {
      const err = new Error("Company not found")
      err.status(404)
      return next(err);
    }
  
    res.render("company_detail", {
      title: company.name,
      company: company,
      games_developed: companyGamesDevList,
      games_published: companyGamesPubList,
      platforms_developed: companyPlatformDevList,
    });   
  });
  
  // Display company create form on GET.
  exports.company_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: company create GET");
  });
  
  // Handle company create on POST.
  exports.company_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: company create POST");
  });
  
  // Display company delete form on GET.
  exports.company_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: company delete GET");
  });
  
  // Handle company delete on POST.
  exports.company_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: company delete POST");
  });
  
  // Display company update form on GET.
  exports.company_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: company update GET");
  });
  
  // Handle company update on POST.
  exports.company_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: company update POST");
  });
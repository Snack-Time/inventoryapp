const Company = require("../models/company")
const asyncHandler = require("express-async-handler")

// Display list of all companies.
exports.company_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: company list");
  });
  
  // Display detail page for a specific company.
  exports.company_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: company detail: ${req.params.id}`);
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
const ESRB = require("../models/ESRB")
const asyncHandler = require("express-async-handler")

// Display list of all companies.
exports.esrb_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb list");
  });
  
  // Display detail page for a specific esrb.
  exports.esrb_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: esrb detail: ${req.params.id}`);
  });
  
  // Display esrb create form on GET.
  exports.esrb_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb create GET");
  });
  
  // Handle esrb create on POST.
  exports.esrb_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb create POST");
  });
  
  // Display esrb delete form on GET.
  exports.esrb_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb delete GET");
  });
  
  // Handle esrb delete on POST.
  exports.esrb_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb delete POST");
  });
  
  // Display esrb update form on GET.
  exports.esrb_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb update GET");
  });
  
  // Handle esrb update on POST.
  exports.esrb_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: esrb update POST");
  });
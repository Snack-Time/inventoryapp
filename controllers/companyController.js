const Company = require("../models/company")
const VideoGame = require("../models/videogame")
const Platform = require("../models/platform")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

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
    res.render("company_form", { title: "Create Company" })
  });
  
  // Handle company create on POST.
  exports.company_create_post = [
    body('name', 'Company name must be at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const company = new Company({ name: req.body.name });

      if (!errors.isEmpty()) {
        res.render("company_form", {
          title: "Create company",
          company: company,
          errors: errors.array(),
        });
        return
      } 
      else {
        const companyExists = await Company.findOne({ name: req.body.name }).collation({ locale: "en", strength: 2 }).exec()
        if (companyExists) {
          res.redirect(companyExists.url);
        }
        else {
          await company.save();
          res.redirect(company.url)
        }
      }
    }),
  ]
  
  // Display company delete form on GET.
  exports.company_delete_get = asyncHandler(async (req, res, next) => {
    const [company, companyGamesDevList, companyGamesPubList, companyPlatformDevList] = await Promise.all([
      Company.findById(req.params.id).exec(),
      VideoGame.find( { developer: req.params.id }, "name").exec(),
      VideoGame.find( { publisher: req.params.id }, "name").exec(),
      Platform.find( { developer: req.params.id }, "name").exec(),
    ]);

    if (company === null) {
      res.redirect('catalog/companies');
    }

    res.render("company_delete", {
      title: "Delete Company",
      company: company,
      games_developed: companyGamesDevList,
      games_published: companyGamesPubList,
      platforms_developed: companyPlatformDevList,
    })
  });
  
  // Handle company delete on POST.
  exports.company_delete_post = asyncHandler(async (req, res, next) => {
    const [company, companyGamesDevList, companyGamesPubList, companyPlatformDevList] = await Promise.all([
      Company.findById(req.params.id).exec(),
      VideoGame.find( { developer: req.params.id }, "name").exec(),
      VideoGame.find( { publisher: req.params.id }, "name").exec(),
      Platform.find( { developer: req.params.id }, "name").exec(),
    ]);

    if (companyGamesDevList.length > 0 || companyGamesPubList.length > 0 || companyPlatformDevList.length > 0) {
      const companyItemCheck = 1;
      res.render("company_delete", {
        title: "Delete Company",
        company: company,
        games_developed: companyGamesDevList,
        games_published: companyGamesPubList,
        platforms_developed: companyPlatformDevList,
        company_item_check: companyItemCheck,
      });
      return;
    }
    else {
      await Company.findByIdAndDelete(req.body.companyid);
      res.redirect('/catalog/companies')
    }
  });
  
  // Display company update form on GET.
  exports.company_update_get = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id)

    if (company === null) {
      const err = new Error("Company not found")
      err.status = 404
      return next(err)
    }

    res.render("company_form", { title: "Create Company", company: company });
  });
  
  // Handle company update on POST.
  exports.company_update_post = [
    body('name', 'Company name must be at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const company = new Company({ name: req.body.name, _id: req.params.id});

      if (!errors.isEmpty()) {
        res.render("company_form", {
          title: "Create company",
          company: company,
          errors: errors.array(),
        });
        return
      } 
      else {
          await Company.findByIdAndUpdate(req.params.id, company);
          res.redirect(company.url)
        }
      }
    ),
  ]
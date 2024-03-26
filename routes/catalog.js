const express = require('express')
const router = express.Router();

const videogame_controller = require("../controllers/videogameController");
const company_controller = require("../controllers/companyController");
const platform_controller = require("../controllers/platformController");
const genre_controller = require("../controllers/genreController");
const ESRB_controller = require("../controllers/ESRBController");
const game_instance_controller = require("../controllers/gameinstanceController");

// Home page
router.get('/', videogame_controller.index);

// Video Game controller routes
router.get("/videogame/create", videogame_controller.videogame_create_get);

router.post("/videogame/create", videogame_controller.videogame_create_post);

router.get("/videogame/:id/delete", videogame_controller.videogame_delete_get);

router.post("/videogame/:id/delete", videogame_controller.videogame_delete_post);

router.get("/videogame/:id/update", videogame_controller.videogame_update_get);

router.post("/videogame/:id/update", videogame_controller.videogame_update_post);

router.get("/videogame/:id", videogame_controller.videogame_detail);

router.get("/videogames", videogame_controller.videogame_list);

// Company controller routes
router.get("/company/create", company_controller.company_create_get);

router.post("/company/create", company_controller.company_create_post);

router.get("/company/:id/delete", company_controller.company_delete_get);

router.post("/company/:id/delete", company_controller.company_delete_post);

router.get("/company/:id/update", company_controller.company_update_get);

router.post("/company/:id/update", company_controller.company_update_post);

router.get("/company/:id", company_controller.company_detail);

router.get("/companies", company_controller.company_list);

// Platform controller routes
router.get("/platform/create", platform_controller.platform_create_get);

router.post("/platform/create", platform_controller.platform_create_post);

router.get("/platform/:id/delete", platform_controller.platform_delete_get);

router.post("/platform/:id/delete", platform_controller.platform_delete_post);

router.get("/platform/:id/update", platform_controller.platform_update_get);

router.post("/platform/:id/update", platform_controller.platform_update_post);

router.get("/platform/:id", platform_controller.platform_detail);

router.get("/platforms", platform_controller.platform_list);

// Genre controller routes
router.get("/genre/create", genre_controller.genre_create_get);

router.post("/genre/create", genre_controller.genre_create_post);

router.get("/genre/:id/delete", genre_controller.genre_delete_get);

router.post("/genre/:id/delete", genre_controller.genre_delete_post);

router.get("/genre/:id/update", genre_controller.genre_update_get);

router.post("/genre/:id/update", genre_controller.genre_update_post);

router.get("/genre/:id", genre_controller.genre_detail);

router.get("/genres", genre_controller.genre_list);

// ESRB controller routes
router.get("/ESRB/create", ESRB_controller.esrb_create_get);

router.post("/ESRB/create", ESRB_controller.esrb_create_post);

router.get("/ESRB/:id/delete", ESRB_controller.esrb_delete_get);

router.post("/ESRB/:id/delete", ESRB_controller.esrb_delete_post);

router.get("/ESRB/:id/update", ESRB_controller.esrb_update_get);

router.post("/ESRB/:id/update", ESRB_controller.esrb_update_post);

router.get("/ESRB/:id", ESRB_controller.esrb_detail);

router.get("/ESRBRatings", ESRB_controller.esrb_list);

// Video Game Instance controller routes
router.get("/gameinstance/create", game_instance_controller.gameinstance_create_get);

router.post("/gameinstance/create", game_instance_controller.gameinstance_create_post);

router.get("/gameinstance/:id/delete", game_instance_controller.gameinstance_delete_get);

router.post("/gameinstance/:id/delete", game_instance_controller.gameinstance_delete_post);

router.get("/gameinstance/:id/update", game_instance_controller.gameinstance_update_get);

router.post("/gameinstance/:id/update", game_instance_controller.gameinstance_update_post);

router.get("/gameinstance/:id", game_instance_controller.gameinstance_detail);

router.get("/gameinstances", game_instance_controller.gameinstance_list);

module.exports = router;
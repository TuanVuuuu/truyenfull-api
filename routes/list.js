const listController = require("../controller/listController");
const router = require("express").Router()


// GET LIST NOVEL
router.get("/", listController.getListNewNovel);

router.get('/:novel', listController.getNovelDetail)

module.exports = router
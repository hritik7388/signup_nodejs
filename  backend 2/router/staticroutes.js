const router=require('express').Router()
const static=require('../controller/static')
router.get('/staticList',static.staticList)
router.get('/staticView',static.staticView)
router.put('/staticEdit',static.staticEdit)

module.exports=router
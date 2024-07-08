"use strict";
const { Router } = require("express")
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const validatorService = require("./validator.service");
const ethers = require("ethers");

const router = Router()

router.post("/validate", async (req, res) => {
    var proofOfTask = req.body.proofOfTask;
    var data = req.body.data;

    try {
        const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(['address'], data)

        const result = await validatorService.validate(proofOfTask, decodedData);
        console.log('Vote:', result ? 'Approve' : 'Not Approved');
        return res.status(200).send(new CustomResponse(result));
    } catch (error) {
        // console.log(error)
        return res.status(500).send(new CustomError("Something went wrong", {}));
    }
})

module.exports = router

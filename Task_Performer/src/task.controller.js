"use strict";
const { Router } = require("express")
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const oracleService = require("./oracle.service");
const dalService = require("./dal.service");

const router = Router()

router.post("/execute", async (req, res) => {
    console.log("Executing task");

    try {
        var taskDefinitionId = Number(req.body.taskDefinitionId) || 0;
        console.log(`taskDefinitionId: ${taskDefinitionId}`);

        const result = await oracleService.getPrice("ETHUSDT");
        result.price = req.body.fakePrice || result.price;
        const cid = await dalService.publishJSONToIpfs(result);
        const data = "hello";

        // proof of task (on IPFS) has:
            // chain id
            // everything necessary to query on chain
                // contract address & the method to query & the requirement
            // the value which was found on chain
            // MVP: the address to add to the mapping
            // upgrade: merkle stuff
        // data has:
            // MVP: address to add to the mapping
            // upgrade: new merkle root

        // TODO: how to verify the data and proof of task field is equivalent??
        

        await dalService.sendTask(cid, data, taskDefinitionId);
        return res.status(200).send(new CustomResponse({proofOfTask: cid, data: data, taskDefinitionId: taskDefinitionId}, "Task executed successfully"));
    } catch (error) {
        console.log(error)
        return res.status(500).send(new CustomError("Something went wrong", {}));
    }
})


module.exports = router

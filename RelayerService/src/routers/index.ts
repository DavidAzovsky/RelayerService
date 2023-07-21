import express from "express";
import httpStatus from "http-status";
import { forwardRequest } from "../config";
import { body, validationResult } from "express-validator";
import CryptoJS from "crypto-js";

import { verifyMetaTx, makeTransaction } from "../services";

const router = express.Router();

router.get("/health-check", (req: any, res: any) => res.send("OK!!!"));

router.get(
  "/encryptPrivateKey",
  [
    body("privatekey")
      .exists()
      .notEmpty()
      .withMessage("privatekey is required"),
    body("secretkey").exists().notEmpty().withMessage("secretkey is required"),
  ],
  (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const encryptPrivateKey = CryptoJS.AES.encrypt(
      req.body.privatekey,
      req.body.secretkey
    ).toString();
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "SUCCESS",
      encryptedPrivateKey: encryptPrivateKey,
    });
  }
);

router.get(
  "/decryptPrivateKey",
  [
    body("value").exists().notEmpty().withMessage("privatekey is required"),
    body("secretkey").exists().notEmpty().withMessage("secretkey is required"),
  ],
  (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    var bytes = CryptoJS.AES.decrypt(req.body.value, req.body.secretkey);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "SUCCESS",
      getPrivateKey: originalText,
    });
  }
);

let forwardReqs: forwardRequest[] = [];
let signs: any[] = [];

router.post(
  "/metatx",
  [
    body("caller").exists().notEmpty().withMessage("caller is required"),
    body("targetToken")
      .exists()
      .notEmpty()
      .withMessage("targetToken is required"),
    body("tokenAmount")
      .exists()
      .notEmpty()
      .withMessage("tokenAmount is required"),
    body("nonce").exists().notEmpty().withMessage("nonce is required"),
    body("expireTime")
      .exists()
      .notEmpty()
      .withMessage("expireTime is required"),
    body("callData").exists().notEmpty().withMessage("callData is required"),
    body("signature").exists().notEmpty().withMessage("signature is required"),
  ],
  (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let forwardReq: forwardRequest = {
        from: req.body.caller,
        target: req.body.targetToken,
        tokenAmount: req.body.tokenAmount.toString(),
        nonce: req.body.nonce,
        expireTime: req.body.expireTime,
        data: req.body.callData,
      };

      // verifyMetaTx(forwardReq, req.body.signature).then(async (result) => {
      //   if (result) {
      //     console.log(`Result is ${result}`);
      //     const hash = await makeTransaction(forwardReq, req.body.signature);

      //     return res.status(httpStatus.OK).json({
      //       status: httpStatus.OK,
      //       message: "SUCCESS",
      //       transactionHash: hash,
      //     });
      //   } else {
      //     return res.status(httpStatus.BAD_REQUEST).json({
      //       status: httpStatus.BAD_REQUEST,
      //       message: "SOMETHING_WRONG",
      //       transactionHash: "",
      //     });
      //   }
      // });

      verifyMetaTx(forwardReq, req.body.signature).then(async (result) => {
        if (result) {
          forwardReqs.push(forwardReq);
          signs.push(req.body.signature);

          return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "VERIFIED",
            transactionHash: "",
          });
        } else {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: "SOMETHING_WRONG",
            transactionHash: "",
          });
        }
      });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = httpStatus.BAD_REQUEST;
      }
      return res.status(err.statusCode).json(err);
    }
  }
);

const timer = 60 * 1000;
setInterval(async () => {
  try {
    console.log("Auto batch called by timer");

    if (
      forwardReqs != null &&
      forwardReqs.length != 0 &&
      forwardReqs.length == signs.length
    ) {
      const hash = await makeTransaction(forwardReqs, signs);
      console.log("hash: ", hash);
      forwardReqs = [];
      signs = [];
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.log("error:" + error.message);
  }
}, timer);

export default router;

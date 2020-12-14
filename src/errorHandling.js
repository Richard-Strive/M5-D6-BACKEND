const express = require("express");

const notFoundErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    res.status(404).send("ERROR! Not Found!!! Keep serching but NOT HERE");
  }
  next(err);
};
const unauthorizedErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 401) {
    res
      .status(401)
      .send("ERROR! NOT AUTHORIZED.YOU THINK YOU ARE A MR.ROBOT???");
  }
  next(err);
};
const forbiddenErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 403) {
    res.status(403).send(err.message);
    /*("ERROR!!! FORBIDDEN. DON'T TRY IT AGAIN FAKE HACKER")*/
  }
  next(err);
};
const badRequestErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 400) {
    res.status(400).send(err.message);
  }
  next(err);
};
const catchAllErrorHandler = (err, req, res, next) => {
  if (!err.headersSent)
    res
      .status(err.httpStatusCode || 500)
      .send("Just wanna trow a GENERIC ERROR");
};

module.exports = {
  notFoundErrorHandler,
  unauthorizedErrorHandler,
  forbiddenErrorHandler,
  badRequestErrorHandler,
  catchAllErrorHandler,
};

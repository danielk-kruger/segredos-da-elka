exports.SucessResponse = (res, msg) => {
  return res.status(200).json({ status: 1, msg });
};

exports.SucessResponseWithData = (res, msg, data) => {
  return res.status(200).json({ status: 1, msg, data });
};

exports.ErrorResponse = (res, msg) => {
  return res.status(500).json({ status: 0, msg });
};

exports.NotFoundResponse = (res, msg) => {
  return res.status(404).json({ status: 0, msg });
};

exports.ValidationErrorWithData = (res, msg, data) => {
  return res.status(400).json({ status: 0, msg, data });
};

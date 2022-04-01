exports.setProductAuthor = (req, res, next) => {
  req.body.createdBy = req.user._id
  next()
}

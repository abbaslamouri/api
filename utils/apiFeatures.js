class ApiFeatures {
  constructor(query, queryObj) {
    this.query = query
    this.queryObj = queryObj
  }

  filter() {
    // filter query
    const newQueryObj = { ...this.queryObj }
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword', 'populate']
    excludedFields.forEach((el) => delete newQueryObj[el])

    // Advanced filtering
    let queryStr = JSON.stringify(newQueryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  search() {
    if (this.queryObj.keyword) {
      const regex = new RegExp(this.queryObj.keyword, 'i')
      this.query = this.query.or({ $text: { $search: this.queryObj.keyword } })
      // this.query = this.query.or([{ name: { $regex: regex } }, { mimetype: { $regex: regex } }])
    }
    return this
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('dateCreated')
    }
    return this
  }

  fields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  paginate() {
    const page = this.queryObj.page * 1 || 1
    const limit = this.queryObj.limit * 1 || 100
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}

module.exports = ApiFeatures

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        //Filtering
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        //Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
        // let query = Tour.find(JSON.parse(queryStr));
    }

    sort() {
        if (this.queryString.sort) {
            const order = JSON.stringify(this.queryString.sort).replace(/,/g, ' ');
            this.query = this.query.sort(JSON.parse(order));
        } else {
            this.query = this.query.sort('createdAt');
        }

        return this;
    }

    limitFields() {
        //field limiting
        if (this.queryString.fields) {
            const fields = this.queryString.fields.replace(/,/g, ' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        //Pagination

        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        this.query = this.query.skip((page - 1) * limit).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;

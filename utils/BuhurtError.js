class BuhurtError extends Error{
    constructor(message, status){
        super(message, status)

        this.name = this.constructor.name
        this.status = status
    }
    statusCode(){
        return this.status
    }
}

module.exports = BuhurtError

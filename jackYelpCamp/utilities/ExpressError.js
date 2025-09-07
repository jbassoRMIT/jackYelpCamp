//This is where we define out custom error class, to be exported 
class ExpressError extends Error{
    constructor(message,status){
        super();
        this.message=message;
        this.status=status;
    }
}

module.exports=ExpressError;
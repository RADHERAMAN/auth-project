class BaseDto {
    static validate(data){
        const {error, value} = this.constructor.schema.validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
        if(error) {
            throw error;
        }

        return value;
    }
}
 export default BaseDto;
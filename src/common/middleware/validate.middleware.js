const validate = (Dto) => {
    return (req, res, next) => {
        const validateData = Dto.validate(req.body);

        req.body = validateData;

        next()
    };
};

export default validate;
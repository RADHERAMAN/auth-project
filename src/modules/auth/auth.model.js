import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import { boolean, date, required } from "joi";

const userSchema = new mongoose.Schema (
    {
        name: {
            type : String,
            trim : true,
            minLength : 3,
            maxLength : 50,
            required : [true, "name is required"],

        },

        email : {
            type: String,
            trim : true,
            required : [true, " Email is required"],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
            select: false,
        },
        role: {
            type: String,
            enum: ["customer", "seller", "admin"],
            default: "customer",
        },
        isVerified: {
            type: boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            select: false,
        },
        refreshToken: {
            type: String,
            select: false,
        },
        resetPasswordToken: {
            type: String,
            select: false,

        },
        resetPasswordExpires: {
            type: Date,
            select: false,
        },

    },

    {
        timestamps: true,
    }
);

// hash password before saving

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12)
    next();
});

// compare entered password with hashed password

userSchema.methods.comparePassword = async function (clearTextPassword) {
    return bcrypt.compare(clearTextPassword, this.password)
};

const User = mongoose.model("User", userSchema);

export default User;
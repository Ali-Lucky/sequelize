const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const sequelize = new Sequelize("test", "postgres", "123456", {
    dialect: "postgres"
});

sequelize.authenticate().then(() => {
    console.log("Postgres connected..");
}).catch((err) => {
    console.log(err);
});

const Student = sequelize.define("student", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return this.getDataValue("name").toUpperCase();
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: {
            args: true,
            msg: "Email already registered"
        },
        validate: {
            isEmail: {
                args: true,
                msg: "Invalid email"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        validate: {
            len: {
                args: [6, 15],
                msg: "Password must be between 6 and 15 characters",
            },
        },
        set(value) {
            const hash = bcrypt.hashSync(value, 10);
            this.setDataValue("password", hash);
        },
    },
    fvrtClass: {
        type: DataTypes.STRING,
        defaultValue: "CS",
        validate: {
            isIn: {
                args: [["ME", "CS", "EC", "EE", "IT"]],
                msg: "Invalid class"
            }
        }
    },
    year: {
        type: DataTypes.INTEGER
    }
});

// The sync and create should be executed in an asynchronous context.
(async () => {
    try {
        await sequelize.sync({ alter: true });
        const student = await Student.create({
            name: "Lucky",
            email: "lucky@example.com",
            password: "Lucky123",
            year: 2020,
            fvrtClass: "EC"
        });
        console.log(student.toJSON());
    } catch (err) {
        console.log(err.message);
    }
})();

module.exports = { sequelize };

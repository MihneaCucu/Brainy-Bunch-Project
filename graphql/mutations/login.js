const LoggedInUserResponse = require("../types/LoggedInUserResponse");
const LoginCredentialsInputType = require("../inputTypes/LoginCredentialsInputType");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../../constants");
const db = require("../../models");
const bcrypt = require("bcrypt");
const { GraphQLUnionType } = require("graphql");
const FailedAuthenticationResponse = require("../types/FailedAuthenticationResponse");

const Login = {
    type: new GraphQLUnionType({
        name: 'LoginUnion',
        types: [LoggedInUserResponse, FailedAuthenticationResponse],
        resolveType: (value) => {
            if(value.token) {
                return 'LoggedInUser';
            }

            return 'FailedAuthentication';
        }
    }),
    args: {
        input: {
            type: LoginCredentialsInputType
        }
    },
    resolve: async (_, args) => {
        const { username, password } = args.input;

        console.log('Login attempt:', { username, password: password ? password : 'undefined' });

        const user = await db.User.findOne({ where: { username } });

        if(!user) {
            console.log('User not found:', username);
            return {
              reason: "User not found",
            }
        }

        console.log('User found:', { id: user.id, username: user.username, hasPassword: !!user.password });

        const passwordMatch = await bcrypt.compare(password, user.password);


        console.log('Password match:', passwordMatch);

        if (passwordMatch) {
            const token = jwt.sign({
                sub: user.id,
            }, JWT_SECRET_KEY);

            console.log('Login successful, token generated');
            return {
                id: user.id,
                token,
            };
        }

        console.log('Password mismatch');
        return {
          reason: "Incorrect Password",
        }
    }
}

module.exports = Login;

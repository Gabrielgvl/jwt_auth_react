import useJwtAuth, { JwtAuthProvider } from "./src/useJwtAuth";

module.exports.JwtAuthProvider = JwtAuthProvider;
module.exports.useJwtAuth = useJwtAuth;
module.exports = {
    JwtAuthProvider, useJwtAuth
}
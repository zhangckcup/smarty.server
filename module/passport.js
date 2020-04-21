const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const DB = require("./MysqlModule");

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      const user = await DB.selectWhere('users', '*', {user_name: jwt_payload.name});
      if (user.length) {
        return done(null, {...user[0], user_password:'******'});
      } else {
        return done(null, false);
      }
    }
  ));
}
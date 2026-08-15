import passport from 'passport';

export const jwtAuthStrategy = passport.authenticate('jwt', { session: false });

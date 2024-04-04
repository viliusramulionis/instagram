const auth = (req, res, next) => {
    if(req.session.user)
        return next();
    
    res.sendStatus(401);
}

export default auth;
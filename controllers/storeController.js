exports.myMiddleware = (req, res, next) => {
    req.name = 'Baris';
    res.cookie('name', 'Hello Baris', { maxAge: 9000 });
    if(req.name === 'Baris') {
        throw Error('We have error');
    }
    next();
}

exports.homePage = (req, res) => {
    res.render('index');
}
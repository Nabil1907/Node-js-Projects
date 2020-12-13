exports.get404Page = (req,res,next)=>{
    res.status(404).render('404',{ 
        path:'',
        pagetitle:'Page Not Found'
        ,
        isAuth:req.login})
};
const router = require('express').Router();
const cubeService = require('../services/cubeService')


router.get('/create', (req, res) => {
    res.render('create');
})



router.post('/create', async (req, res)=> {
    const cube = req.body;
    //Validate
    if (cube.name.length < 2){
        return res.status(400).send('Invalid Request')
    }
    //Save data
    try {
        await cubeService.save(cube)
        res.redirect('/')
    } catch (error) {
        res.staturs(400).send(error);

    }

    //Redirect to page
})

module.exports = router;
const router = require('express').Router();
const cubeService = require('../services/cubeService');
const accessoryService = require('../services/accessoryService');
const { isAuth } = require('../middlewares/authMiddleware');


router.get('/create', isAuth,  (req, res) => {
    res.render('create');
})



router.post('/create', isAuth, async (req, res)=> {
    const cube = req.body;
    cube.owner = req.user._id
    console.log(cube.owner)
    //Validate
    if (cube.name.length < 2){
        return res.status(400).send('Invalid Request')
    }
    //Save data
    try {
        await cubeService.create(cube)
        res.redirect('/')
    } catch (error) {
        res.status(400).send(error);

    }

    //Redirect to page
});


router.get('/details/:id', async (req, res) => {
    const cube = await cubeService.getOne(req.params.id).lean();
    const isOwner = cube.owner == req.user?._id

    res.render('details', { cube, isOwner })
});

router.get('/:cubeId/attach-accessory', async (req, res) => {
    const cube = await cubeService.getOne(req.params.cubeId).lean();

    const accessories = await accessoryService.getAllWithout(cube.accessories).lean()
    res.render('accessory/attach', {cube, accessories});
})

router.post('/:cubeId/attach-accessory', async (req, res) => {
    const accessoryId = req.body.accessory;

    await cubeService.attachAccessory(req.params.cubeId, accessoryId);

    res.redirect(`/cube/details/${req.params.cubeId}`);
});



router.get('/:cubeId/edit', isAuth, async (req, res) => {
    const cube = await cubeService.getOne(req.params.cubeId).lean();

    if (cube.owner != req.user._id){
        //TODO add message
        return res.redirect('/404')
    }

    cube[`difficultyLevel${cube.difficultyLevel}`] = true;

    if(!cube){
        return res.redirect('/404')
    }

    res.render('cube/edit', { cube });
})

router.post('/:cubeId/edit', async (req, res) => {
    let modifiedCube = await cubeService.edit(req.params.cubeId, req.body)


    res.redirect(`/cube/details/${modifiedCube._id}`);
})

router.get('/:cubeId/delete', async (req, res) => {
    const cube = await cubeService.getOne(req.params.cubeId).lean();
    //TODO: add is owner validation

    res.render('cube/delete', {cube})
})


router.post('/:cubeId/delete', async(req, res) => {
    //TODO try catch
    await cubeService.delete(req.params.cubeId);

    res.redirect('/')
})


module.exports = router;

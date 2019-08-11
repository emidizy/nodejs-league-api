//Initialize express router 
const router = require('express').Router();

//Request Interceptor
const reqInterceptor = require('../interceptors/request-token');

// Controllers
const adminSignUpController = require('../controllers/admin/signupController');
const adminLoginController = require('../controllers/admin/loginController');
const signupController = require('../controllers/user/signup-controller');
const loginController = require('../controllers/user/login-controller');
const teamsController = require('../controllers/admin/teamsController');
const fixturesController = require('../controllers/admin/fixturesController');
const activityController = require('../controllers/user/activity-controller');
const searchController = require('../controllers/public/searchController');

//APP ROUTES
router.get('/', (req, res) => {
    
    res.json({
        status: 'Api is Live',
        message: 'Welcome to Premier League API hub. Developed by Diala Emmanuel'
    })
});
router.post('/user/signup', signupController.register);
router.post('/user/login', loginController.signIn);

router.post('/admin/signup', adminSignUpController.register);
router.post('/admin/login', adminLoginController.signIn);

router.post('/admin/teams/add', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, teamsController.create);
router.get('/admin/teams/:id?', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, teamsController.viewTeams);
router.put('/admin/teams/edit', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, teamsController.modifyTeam);
router.delete('/admin/teams/delete/:id', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, teamsController.deleteTeam);

router.post('/admin/fixtures/add', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, fixturesController.create);
router.get('/admin/fixtures/:id?', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, fixturesController.viewFixtures);
router.put('/admin/fixtures/edit', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, fixturesController.modifyFixture);
router.delete('/admin/fixtures/delete/:id', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, fixturesController.deleteFixture);
router.post('/admin/fixtures/url/generate', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, fixturesController.generateFixtureUrl);

router.get('/user/activity/teams/:id?', reqInterceptor.validateToken, activityController.viewTeams);
router.get('/user/activity/fixtures/:status', reqInterceptor.validateToken, activityController.viewFixturesByStatus);

router.get('/search-url/*', searchController.viewFixturesByUrl);
router.post('/search/league', searchController.searchLeague);

module.exports = router;
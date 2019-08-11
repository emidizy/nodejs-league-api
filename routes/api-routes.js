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
router.get('/', (req, res) => res.redirect('/api'))
    .get('/api', (req, res) => {
        res.json({
            status: 'Api is Live',
            message: 'Welcome to Premier League API hub. Developed by Diala Emmanuel'
        });
    });
router.post('/api/user/signup', signupController.register);
router.post('/api/user/login', loginController.signIn);

router.post('/api/admin/signup', adminSignUpController.register);
router.post('/api/admin/login', adminLoginController.signIn);

router.post('/api/admin/teams/add', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, teamsController.create);
router.get('/api/admin/teams/:id?', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, teamsController.viewTeams);
router.put('/api/admin/teams/edit', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, teamsController.modifyTeam);
router.delete('/api/admin/teams/delete/:id', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, teamsController.deleteTeam);

router.post('/api/admin/fixtures/add', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, fixturesController.create);
router.get('/api/admin/fixtures/:id?', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, fixturesController.viewFixtures);
router.put('/api/admin/fixtures/edit', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, fixturesController.modifyFixture);
router.delete('/api/admin/fixtures/delete/:id', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, fixturesController.deleteFixture);
router.post('/api/admin/fixtures/url/generate', reqInterceptor.validateToken, reqInterceptor.confirmAdminRole, fixturesController.generateFixtureUrl);

router.get('/api/user/activity/teams/:id?', reqInterceptor.validateToken, activityController.viewTeams);
router.get('/api/user/activity/fixtures/:status', reqInterceptor.validateToken, activityController.viewFixturesByStatus);

router.get('/api/search-url/*', searchController.viewFixturesByUrl);
router.post('/api/search/league', searchController.searchLeague);

module.exports = router;
import koaRouter from 'koa-router';
import Github from '../controllers/github';
import user from '../controllers/helper/user';
import cache from '../controllers/helper/cache';
import locale from '../controllers/helper/locale';
import session from '../controllers/helper/session';
import query from '../controllers/helper/query';
import platform from '../controllers/helper/platform';
import analyse from '../controllers/helper/analyse';

const router = koaRouter({
  prefix: '/github'
});

// zen & octocat
router.get(
  '/zen',
  Github.getZen
);
router.get(
  '/octocat',
  Github.getOctocat
);

// repos
router.get(
  '/repos',
  user.checkSession(session.requiredSessions),
  cache.get('repos'),
  Github.getUserRepos,
  cache.set()
);
router.get(
  '/shareData',
  user.checkSession(['userId', 'githubLogin']),
  Github.getStareData
);
router.get(
  '/updateTime',
  user.checkSession(['userId', 'githubLogin']),
  Github.getUpdateTime
);
// refresh github datas
router.get(
  '/refresh',
  user.checkSession(['userId', 'githubLogin']),
  Github.refreshDatas,
  cache.del()
);
router.get(
  '/repos/:reposName',
  user.checkSession(session.requiredSessions),
  Github.getRepository
);
router.get(
  '/user',
  user.checkSession(['userId']),
  cache.get('user'),
  Github.getUser,
  cache.set()
);
router.post(
  '/user/toggleShare',
  user.checkSession(['userId', 'githubLogin']),
  Github.toggleShare,
);
router.get(
  '/repos/commits',
  user.checkSession(session.requiredSessions),
  cache.get('commits'),
  Github.getReposCommits,
  cache.set()
);
router.get(
  '/repos/:reposName/commits',
  user.checkSession(session.requiredSessions),
  Github.getRepositoryCommits
);
router.get(
  '/:login',
  platform.checkPlatform,
  analyse.collect,
  locale,
  Github.sharePage
);
router.get(
  '/:login/share',
  cache.get('sharedUser'),
  Github.getSharedUser,
  cache.set()
);
router.get(
  '/:login/shareInfo',
  cache.get('sharedInfo'),
  Github.getStareInfo,
  cache.set()
);


module.exports = router;

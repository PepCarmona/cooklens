import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import { notify } from '../shared/Notifications/NotifiactionState';
import createAuthenticationService from '../auth/AuthenticationService';
import { authState } from '../auth/AuthenticationState';

const { verifyUser } = createAuthenticationService(authState);

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { showAddRecipe: true },
  },
  {
    path: '/recipes',
    name: 'RecipesMainView',
    component: () =>
      import(
        /* webpackChunkName: "recipes" */ '../recipes/components/RecipesListAndSearch.vue'
      ),
    meta: { invertedBG: true, showAddRecipe: true },
  },
  {
    path: '/recipe/:title',
    name: 'RecipeDetails',
    component: () =>
      import(
        /* webpackChunkName: "recipeDetails" */ '../recipes/components/RecipeDetails.vue'
      ),
    props: (route) => ({ id: route.query.id, random: route.query.random }),
    meta: { invertedBG: true },
  },
  {
    path: '/recipe/form',
    name: 'CreateRecipe',
    component: () =>
      import(
        /* webpackChunkName: "createRecipe" */ '../recipes/components/CreateRecipe.vue'
      ),
  },
  {
    path: '/auth',
    name: 'Authentication',
    component: () =>
      import(
        /* webpackChunkName: "authentication" */ '../auth/components/Authentication.vue'
      ),
    meta: { noFooter: true, noHeader: true },
    beforeEnter: (to, from, next) => {
      const code = to.query.code?.toString();

      if (!code) {
        next();
        return;
      }

      verifyUser(code)
        .then(() => next({ name: 'Profile' }))
        .catch((err) => {
          next();
          notify(err, 'error');
        });
    },
    children: [
      {
        path: '',
        redirect: { name: 'login' },
      },
      {
        path: 'login',
        name: 'login',
        component: () =>
          import(
            /* webpackChunkName: "login" */ '../auth/components/Login.vue'
          ),
        props: (route) => ({
          nextUrl: route.query.nextUrl,
        }),
      },
      {
        path: 'register',
        name: 'register',
        component: () =>
          import(
            /* webpackChunkName: "register" */ '../auth/components/Register.vue'
          ),
        props: (route) => ({
          nextUrl: route.query.nextUrl,
        }),
      },
      {
        path: 'forgotPassword',
        name: 'forgotPassword',
        component: () =>
          import(
            /* webpackChunkName: "forgotPassword" */ '../auth/components/ForgotPassword.vue'
          ),
      },
      {
        path: 'recover',
        name: 'recover',
        component: () =>
          import(
            /* webpackChunkName: "passwordRecovery" */ '../auth/components/PasswordRecovery.vue'
          ),
        props: (route) => ({
          token: route.query.token,
          mail: route.query.mail,
        }),
        beforeEnter: (to, from, next) => {
          const { mail, token } = to.query;

          if (mail && token) {
            next();
            return;
          }

          notify('No recovery token provided', 'error');
          next({ name: 'login' });
        },
      },
    ],
  },
  {
    path: '/profile',
    component: () =>
      import(
        /* webpackChunkName: "profileWrapper" */ '../profile/components/ProfileWrapper.vue'
      ),
    children: [
      {
        path: '',
        name: 'Profile',
        component: () =>
          import(
            /* webpackChunkName: "profile" */ '../profile/components/Profile.vue'
          ),
        meta: { requireAuth: true },
      },
      {
        path: 'ownRecipes',
        name: 'ownRecipes',
        component: () =>
          import(
            /* webpackChunkName: "ownRecipes" */ '../profile/components/MyRecipes.vue'
          ),
        meta: { requireAuth: true, showAddRecipe: true },
      },
      {
        path: 'favRecipes',
        name: 'favRecipes',
        component: () =>
          import(
            /* webpackChunkName: "favRecipes" */ '../profile/components/MyFavRecipes.vue'
          ),
        meta: { requireAuth: true },
      },
      {
        path: 'myMealPlan',
        name: 'myMealPlan',
        component: () =>
          import(
            /* webpackChunkName: "mealPlan" */ '../profile/components/MyMealPlan/MyMealPlan.vue'
          ),
        meta: { requireAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

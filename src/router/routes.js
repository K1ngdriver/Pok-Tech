const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", component: () => import("pages/LoginPage.vue") },
      { path: "/register", component: () => import("pages/RegisterPage.vue") },
      { path: "/menu", component: () => import("pages/MenuPage.vue") },
      {
        path: "/pokedex",
        component: () => import("src/pages/PokedexPage.vue"),
      },
      {
        path: "/pokedex/:name",
        component: () => import("pages/PokemonDetail.vue"),
      },
      {
        path: "/guess-pokemon",
        component: () => import("pages/GuessPokemonPage.vue"),
      },
      {
        path: "/choice-companion",
        component: () => import("pages/ChoiceCompanion.vue"),
      },
      {
        path: "/nickname-companion/:pokemonId",
        component: () => import("pages/NicknameCompanion.vue"),
      },
      {
        path: "/my-companion/:pokemonId",
        component: () => import("pages/MyCompanionPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

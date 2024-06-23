const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", component: () => import("pages/MenuPage.vue") },
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

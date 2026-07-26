import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Sem restauração de rolagem: numa página de venda, devolver o visitante ao ponto onde
    // ele parou da última vez faz ele reabrir o site no meio, sem entender por quê. Ele tem
    // que abrir na primeira tela, que é onde está a oferta.
    scrollRestoration: false,
    defaultPreloadStaleTime: 0,
  });

  return router;
};

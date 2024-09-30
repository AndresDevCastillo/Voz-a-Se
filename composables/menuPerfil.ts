export const menuPerfil = () => {
  const menuPerfil = [
    {
      label: "Proyectos",
      items: [
        {
          label: "Mis Semilleros",
          icon: "pi pi-plus",
        },
        {
          label: "Mis Proyectos",
          icon: "pi pi-search",
        },
      ],
    },
    {
      label: "Perfil",
      items: [
        {
          label: "Configuración",
          icon: "pi pi-cog",
        },
        {
          label: "Salir",
          icon: "pi pi-sign-out",
        },
      ],
    },
  ];
  return menuPerfil;
};

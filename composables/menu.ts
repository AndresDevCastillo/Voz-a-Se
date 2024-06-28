export const menu = () => {
  const menuAdmin = [
    { separator: true },
    {
      label: "Administrador",
      items: [
        {
          label: "Competencias",
          icon: "pi pi-graduation-cap",
          route: "/admin/competencias",
        },
        {
          label: "Salas",
          icon: "pi pi-comments",
          route: "/admin/salas",
        },
      ],
    },
    { separator: true },
    {
      label: "Instrutor",
      items: [
        {
          label: "Competencias",
          icon: "pi pi-graduation-cap",
          route: "/instructor/competencias",
        },
      ],
    },

    { separator: true },
    {
      label: "Administración",
      items: [
        {
          label: "Cerrar sesión",
          icon: "pi pi-sign-out",
          route: "/logout",
        },
      ],
    },
  ];
  return menuAdmin;
};

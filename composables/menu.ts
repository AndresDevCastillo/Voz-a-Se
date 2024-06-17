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

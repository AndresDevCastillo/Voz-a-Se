export const menu = () => {
  const userState = useUserStore();

  const menuRoot = [
    { separator: true },
    {
      label: "Administrador",
      items: [
        {
          label: "Administradores",
          icon: "pi pi-user-edit",
          route: "/admin/admin",
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

  const menuAdmin = [
    { separator: true },
    {
      label: "Administrador",
      items: [
        {
          label: "Usuarios",
          icon: "pi pi-user-edit",
          route: "/admin/usuarios",
        },
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

  const menuInstructor = [
    { separator: true },
    {
      label: "Instrutor",
      items: [
        {
          label: "Competencias",
          icon: "pi pi-graduation-cap",
          route: "/instructor/competencias",
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

  const menuAprendiz = [
    { separator: true },
    {
      label: "Aprendiz",
      items: [
        {
          label: "Salas",
          icon: "pi pi-comments",
          route: "/admin/salas",
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

  const user = userState.getUser();
  let menu;
  switch (user?.rol) {
    case "Root":
      menu = menuRoot;
      break;

    case "Admin":
      menu = menuAdmin;
      break;

    case "Instructor":
      menu = menuInstructor;
      break;

    case "Aprendiz":
      menu = menuAprendiz;
      break;

    default:
      menu = menuAdmin;
      break;
  }

  return menu;
};

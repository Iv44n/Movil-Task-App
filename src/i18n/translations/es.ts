const es = {
  priorityOptions: {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta'
  },
  datePicker: {
    placeholder: 'Selecciona una fecha',
    day: 'Día',
    month: 'Mes',
    year: 'Año',
    clearDate: 'Limpiar fecha'
  },
  auth: {
    login: {
      title: 'Bienvenido de vuelta',
      subtitle: 'Hoy es un nuevo día. Es tu día. Tú lo moldeas. Inicia sesión para empezar a gestionar tus proyectos.',
      form: {
        emailAddress: 'Correo Electrónico',
        password: 'Contraseña',
        forgotPassword: '¿Olvidaste tu contraseña?'
      },
      actions: {
        signInLoading: 'Cargando...',
        signIn: 'Iniciar sesión'
      },
      promptText: '¿No tienes una cuenta?',
      actionText: 'Registrarse'
    },
    dividerText: 'O continuar con',
    register: {
      title: 'Registrarse',
      subtitle: 'Comienza a construir tus propios proyectos. Regístrate para continuar.',
      form: {
        firstName: 'Nombre',
        lastName: 'Apellido',
        emailAddress: 'Correo Electrónico',
        password: 'Elige una contraseña segura'
      },
      actions: {
        signUpLoading: 'Cargando...',
        signUp: 'Registrarse'
      },
      promptText: '¿Ya tienes una cuenta?',
      actionText: 'Iniciar sesión'
    },
    verifyEmail: {
      title: 'Verificar correo electrónico',
      subtitle: 'Por favor, introduce el código de verificación enviado a %{emailAddress}',
      verificationFailed: 'La verificación ha fallado',
      anErrorOccurred: 'Ha ocurrido un error',
      incompleteCode: 'Código incompleto',
      pleaseEnterFullCode: 'Por favor, introduce el código de verificación completo.',
      verifying: 'Verificando...',
      verify: 'Verificar'
    }
  },
  home: {
    headerTexts: {
      greeting: 'Hola, %{name}!',
      youHave: 'Tienes',
      projects: {
        one: '%{count} Proyecto',
        other: '%{count} Proyectos'
      }
    },
    emptyState: {
      title: 'No tienes proyectos',
      subtitle: 'Toca para crear uno'
    },
    card: {
      progress: 'Progreso',
      whitoutCategory: 'Sin categoría'
    },
    addProjectModal: {
      title: 'Crear Nuevo Proyecto',
      form: {
        project: 'Proyecto',
        projectName: 'Nombre del Proyecto',
        projectNamePlaceholder: 'Introduce el nombre del proyecto',
        description: 'Descripción',
        descriptionPlaceholder: 'Añade una descripción (opcional)',
        categoryPlaceholder: 'Selecciona una categoría',
        category: 'Categoría',
        newCategory: 'Nueva Categoría',
        newCategoryTitle: 'Crear Nueva Categoría',
        newCategoryPlaceholder: 'Introduce el nombre de la categoría',
        projectColor: 'Color del Proyecto',
        errors: {
          projectNameRequired: 'Nombre del proyecto es requerido',
          projectNameMinLength: 'Nombre del proyecto debe tener al menos 3 caracteres',
          projectNameMaxLength: 'Nombre del proyecto debe tener como máximo 100 caracteres',
          descriptionMinLength: 'Descripción debe tener al menos 3 caracteres',
          descriptionMaxLength: 'Descripción debe tener como máximo 1000 caracteres',
          categoryRequired: 'Categoría es requerida',
          projectColorRequired: 'Color del proyecto es requerido'
        }
      },
      actions: {
        cancel: 'Cancelar',
        create: 'Crear %{name}'
      }
    },
    progressInfo: {
      title: 'Tu progreso',
      priorityTasks: 'Tareas Prioritarias',
      completed: 'Completadas',
      in_progress: 'En Progreso',
      task: 'Tarea',
      tasks: 'Tareas'
    }
  },
  projectDetails: {
    headerTitle: 'Detalles',
    errorNotLoggedIn: 'Por favor, inicia sesión para ver el proyecto',
    errorProjectNotFound: 'Proyecto no encontrado',
    deleteProjectTitle: 'Eliminar proyecto',
    deleteProjectMessage:
      '¿Estás seguro de que quieres eliminar este proyecto? Esto también eliminará todas las tareas.',
    delete: 'Eliminar',
    cancel: 'Cancelar',
    emptyAll: 'No hay tareas todavía.',
    emptyStatus: 'No hay tareas %{status}.',
    emptySubtext: 'Toca el botón + para añadir una tarea',
    createTaskError: 'No se pudo crear la tarea',
    updateTaskError: 'No se pudo actualizar la tarea',
    deleteProjectError: 'No se pudo eliminar el proyecto',
    status: {
      plural: {
        all: 'Todo',
        pending: 'Pendientes',
        in_progress: 'En Progreso',
        completed: 'Completadas'
      }
    },
    options: {
      edit: 'Editar Proyecto',
      delete: 'Eliminar Proyecto'
    },
    editProject: {
      title: 'Editar Proyecto',
      actions: {
        update: 'Actualizar Proyecto'
      }
    },
    editTask: {
      title: 'Editar Tarea',
      actions: {
        update: 'Actualizar Tarea'
      }
    },
    taskCard: {
      progress: 'Progreso'
    },
    taskOptions: {
      edit: 'Editar',
      markAsCompleted: 'Marcar como completada',
      delete: 'Eliminar'
    },
    addTaskModal: {
      title: 'Crear nueva tarea',
      taskTitleLabel: 'Título de la tarea',
      taskTitlePlaceholder: '¿Qué necesita ser hecho?',
      taskTitleRequired: 'El título de la tarea es obligatorio',
      descriptionLabel: 'Descripción (opcional)',
      descriptionPlaceholder: 'Añadir más detalles...',
      priorityLabel: 'Prioridad',
      startDateLabel: 'Fecha de inicio',
      dueDateLabel: 'Fecha de fin',
      cancel: 'Cancelar',
      create: 'Crear tarea'
    },
    subTaskPage: {
      emptyState: {
        title: 'No hay subtareas todavía.',
        subtext: 'Toca el botón + para añadir una subtarea'
      },
      info: {
        startDateLabel: 'Inicio',
        dueDateLabel: 'Fin',
        priorityLabel: 'Prioridad',
        subTaskLabel: 'Subtareas',
        notSetDate: 'Sin Fecha'
      },
      list: {
        newTask: 'Nueva Tarea'
      }
    },
    dateLabels: {
      startToday: 'Empieza hoy',
      dueToday: 'Termina hoy',
      started: 'Empezó el %{date}',
      start: 'Empieza el %{date}',
      overdue: 'Terminó el %{date}',
      due: 'Termina el %{date}'
    }
  },
  errors: {
    title: 'Error',
    updateTaskFailed: 'Error al actualizar la tarea'
  },
  profile: {
    header: 'Perfil',
    headerSubtitle: 'Gestiona tu perfil y preferencias',
    menu: {
      account: {
        title: 'Cuenta',
        subtitle: 'Gestiona tus preferencias de cuenta'
      },
      notifications: {
        title: 'Notificaciones',
        subtitle: 'Notificaciones y alertas'
      },
      security: {
        title: 'Seguridad',
        subtitle: 'Contraseña y autenticación'
      },
      privacyPolicy: {
        title: 'Políticas de Privacidad',
        subtitle: 'Políticas de privacidad y términos de servicio'
      },
      language: {
        title: 'Idioma',
        subtitle: 'Selecciona tu idioma de preferencia',
        routePage: {
          title: 'Idioma',
          subtitle: 'Selecciona tu idioma de preferencia',
          currentLanguage: 'Idioma Actual',
          availableLanguages: 'Idiomas Disponibles'
        }
      }
    },
    actions: {
      signOut: 'Cerrar sesión'
    }
  }
} as const

export default es

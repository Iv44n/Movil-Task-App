const en = {
  priorityOptions: {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  },
  auth: {
    login: {
      title: 'Welcome back',
      subtitle: 'Today is a new day. It\'s your day. You shape it. Sign in to start managing your projects.',
      form: {
        emailAddress: 'Email Address',
        password: 'Password',
        forgotPassword: 'Forgot Password?'
      },
      actions: {
        signInLoading: 'Loading...',
        signIn: 'Sign In'
      },
      promptText: 'Don\'t have an account?',
      actionText: 'Sign Up'
    },
    dividerText: 'Or continue with',
    register: {
      title: 'Create an account',
      subtitle: 'Start building your own projects. Sign up to continue.',
      form: {
        firstName: 'First Name',
        lastName: 'Last Name',
        emailAddress: 'Email Address',
        password: 'Choose a secure password'
      },
      actions: {
        signUpLoading: 'Loading...',
        signUp: 'Sign Up'
      },
      promptText: 'Already have an account?',
      actionText: 'Sign In'
    }
  },
  home: {
    headerTexts: {
      greeting: 'Hi, %{name}!',
      youHave: 'You have',
      projects: {
        one: '%{count} Project',
        other: '%{count} Projects'
      }
    },
    emptyState: {
      title: 'You have no projects',
      subtitle: 'Tap to create one'
    },
    card: {
      progress: 'Progress',
      whitoutCategory: 'Without Category'
    },
    addProjectModal: {
      title: 'Create New Project',
      form: {
        project: 'Project',
        projectName: 'Project Name',
        projectNamePlaceholder: 'Enter project name',
        description: 'Description',
        descriptionPlaceholder: 'Add project description (optional)',
        category: 'Category',
        categoryPlaceholder: 'Select a category',
        newCategory: 'New Category',
        newCategoryTitle: 'Create New Category',
        newCategoryPlaceholder: 'Enter category name',
        projectColor: 'Project Color',
        errors: {
          projectNameRequired: 'Project name is required',
          projectNameMinLength: 'Project name must be at least 3 characters long',
          projectNameMaxLength: 'Project name must be at most 100 characters long',
          descriptionMaxLength: 'Description must be at most 1000 characters long',
          categoryRequired: 'Category is required',
          projectColorRequired: 'Project color is required'
        }
      },
      actions: {
        cancel: 'Cancel',
        create: 'Create %{name}',
        createNewCategory: 'Create New Category'
      }
    },
    progressInfo: {
      title: 'Your progress',
      priorityTasks: 'Priority Tasks',
      completed: 'Completed',
      in_progress: 'In Progress',
      task: 'Task',
      tasks: 'Tasks'
    },
    toDoList: {
      title: 'To Do List'
    }
  },
  projectDetails: {
    headerTitle: 'Details',
    errorProjectNotFound: 'Project not found',
    deleteProjectTitle: 'Delete Project',
    deleteProjectMessage:
      'Are you sure you want to delete this project? This will also delete all tasks.',
    delete: 'Delete',
    cancel: 'Cancel',
    emptyAll: 'No tasks yet.',
    emptyStatus: 'No %{status} tasks.',
    emptySubtext: 'Tap the + button to add a task',
    createTaskError: 'Failed to create task',
    updateTaskError: 'Failed to update task',
    deleteProjectError: 'Failed to delete project',
    status: {
      plural: {
        all: 'All',
        pending: 'Pending',
        in_progress: 'In Progress',
        completed: 'Completed'
      }
    },
    options: {
      edit: 'Edit Project',
      delete: 'Delete Project'
    },
    taskCard: {
      progress: 'Progress'
    },
    addTaskModal: {
      title: 'Create New Task',
      taskTitleLabel: 'Task Title',
      taskTitlePlaceholder: 'What needs to be done?',
      taskTitleRequired: 'Task title is required',
      descriptionLabel: 'Description (optional)',
      descriptionPlaceholder: 'Add more details...',
      priorityLabel: 'Priority',
      startDateLabel: 'Start Date',
      startDatePlaceholder: 'YYYY-MM-DD (optional)',
      dueDateLabel: 'Due Date',
      dueDatePlaceholder: 'YYYY-MM-DD (optional)',
      cancel: 'Cancel',
      create: 'Create Task'
    },
    subTaskPage: {
      emptyState: {
        title: 'No subtasks yet.',
        subtext: 'Tap the + button to add a subtask'
      },
      info: {
        startDateLabel: 'Start Date',
        dueDateLabel: 'Due Date',
        priorityLabel: 'Priority',
        subTaskLabel: 'Subtasks',
        notSetDate: 'Not Set'
      },
      list: {
        newTask: 'New Task'
      }
    }
  },
  profile: {
    header: 'Profile',
    headerSubtitle: 'Manage your profile and preferences',
    menu: {
      account: {
        title: 'Account',
        subtitle: 'Manage your account preferences'
      },
      notifications: {
        title: 'Notifications',
        subtitle: 'Push notifications and alerts'
      },
      security: {
        title: 'Security',
        subtitle: 'Password and authentication'
      },
      privacyPolicy: {
        title: 'Privacy Policy',
        subtitle: 'Privacy policy and terms of service'
      },
      language: {
        title: 'Language',
        subtitle: 'Select your preferred language',
        routePage: {
          title: 'Language',
          subtitle: 'Select your preferred language',
          currentLanguage: 'Current Language',
          availableLanguages: 'Available Languages'
        }
      }
    },
    actions: {
      signOut: 'Sign Out'
    }
  }
} as const

export default en

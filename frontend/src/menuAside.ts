import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS'
  },
  {
    href: '/campaigns/campaigns-list',
    label: 'Campaigns',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiFlag' in icon ? icon['mdiFlag' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_CAMPAIGNS'
  },
  {
    href: '/events/events-list',
    label: 'Events',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiCalendar' in icon ? icon['mdiCalendar' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_EVENTS'
  },
  {
    href: '/feedbacks/feedbacks-list',
    label: 'Feedbacks',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiMessage' in icon ? icon['mdiMessage' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_FEEDBACKS'
  },
  {
    href: '/initiatives/initiatives-list',
    label: 'Initiatives',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiLightbulbOutline' in icon ? icon['mdiLightbulbOutline' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_INITIATIVES'
  },
  {
    href: '/leaders/leaders-list',
    label: 'Leaders',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiAccount' in icon ? icon['mdiAccount' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_LEADERS'
  },
  {
    href: '/news/news-list',
    label: 'News',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiNewspaper' in icon ? icon['mdiNewspaper' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_NEWS'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },

 {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS'
  },
]

export default menuAside

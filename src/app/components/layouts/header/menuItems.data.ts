import { MenuItem } from 'primeng/api';

interface DataModelMenuItem extends MenuItem {
  service: string,
  addRouterLink: string[],
  listRouterLink: string[],
}

export const MenuItems: MenuItem[] = [
  {
    label: $localize`Home`,
    icon: 'pi pi-home',
    routerLink: [ '/home' ],
  },
  {
    separator: true
  },
  {
    label: $localize`Histories`,
    icon: 'pi pi-chart-line',
    routerLink: [ '/home/histories' ],
  },
]

export const DataModelMenuItems: DataModelMenuItem[] = [
  {
    label: $localize`Devices`,
    icon: 'pi pi-sitemap',
    service: 'device',
    addRouterLink: [ '/home/devices/add' ],
    listRouterLink: [ '/home/devices' ],
  },
]

export const LogoutMenuItem = {
  label: $localize`Sign out`,
  icon: 'pi pi-sign-out',
};

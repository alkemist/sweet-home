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
]

export const DataModelMenuItems: DataModelMenuItem[] = [
  {
    label: $localize`Devices`,
    service: 'device',
    addRouterLink: [ '/home/devices/add' ],
    listRouterLink: [ '/home/devices' ],
  },
]

export const LogoutMenuItem = {
  label: $localize`Sign out`,
  icon: 'pi pi-sign-out',
};

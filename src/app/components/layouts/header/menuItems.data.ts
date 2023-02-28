import { MenuItem } from 'primeng/api';

export const MenuItems: MenuItem[] = [
  {
    label: $localize`Home`,
    icon: 'pi pi-home',
    routerLink: [ '/home' ]
  },
  {
    separator: true
  },
  {
    label: $localize`Devices`,
    icon: 'pi pi-list',
    routerLink: [ '/home/devices' ]
  },
  {
    separator: true
  },
]

export const LogoutMenuItem = {
  label: $localize`Sign out`,
  icon: 'pi pi-sign-out',
};

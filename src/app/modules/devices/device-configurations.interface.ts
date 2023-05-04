export interface DeviceDefinitions {
  infoCommandFilters?: Record<string, Record<string, string>>,
  actionCommandFilters?: Record<string, Record<string, string>>,
  configurationFilters?: Record<string, string>,
  customParams?: string[]
}

export interface DeviceConfigurations {
  infoCommandFilters: Record<string, Record<string, string>>,
  actionCommandFilters: Record<string, Record<string, string>>,
  configurationFilters: Record<string, string>,
  customParameters: string[]
}

import { Kottage, NomadInfo } from '../hooks/propertyHooks';

export const NOMAD_PASS_PRICE = 49;
export const NOMAD_WIFI_THRESHOLD = 100;

export const getDefaultNomadInfo = (): NomadInfo => ({
  isVerified: false,
  wifiBackupAvailable: false,
  coworkingAccess: false,
  privateWorkspace: false,
  ergonomicDeskChair: false,
  monitorRental: false,
  quietRoomAccess: false,
});

export const isNomadVerified = (
  property?: Pick<Kottage, 'nomad'> | null
): boolean => Boolean(property?.nomad?.isVerified);

export const getNomadPerkLabels = (
  nomad?: NomadInfo,
  options: { includeWifiSpeed?: boolean } = {}
): string[] => {
  if (!nomad) {
    return [];
  }

  const perks: string[] = [];
  if ((nomad.wifiSpeedMbps || 0) >= NOMAD_WIFI_THRESHOLD) {
    perks.push(
      options.includeWifiSpeed && nomad.wifiSpeedMbps
        ? `${nomad.wifiSpeedMbps} Mbps Wi-Fi`
        : 'Fast Wi-Fi'
    );
  }
  if (nomad.coworkingAccess) {
    perks.push('Coworking Access');
  }
  if (nomad.privateWorkspace) {
    perks.push('Private Workspace');
  }
  if (nomad.ergonomicDeskChair) {
    perks.push('Ergonomic Desk');
  }
  if (nomad.monitorRental) {
    perks.push('Monitor Rental');
  }
  if (nomad.wifiBackupAvailable) {
    perks.push('Wi-Fi Backup');
  }
  if (nomad.quietRoomAccess) {
    perks.push('Quiet Room Access');
  }

  return perks;
};

export const getNomadBookingPerks = (property?: Pick<Kottage, 'nomad'>) => ({
  coworkingAccess: Boolean(property?.nomad?.coworkingAccess),
  fastWifi: (property?.nomad?.wifiSpeedMbps || 0) >= NOMAD_WIFI_THRESHOLD,
  privateWorkspace: Boolean(property?.nomad?.privateWorkspace),
});

export const getNomadLocationLabel = (property: Pick<Kottage, 'address'>) =>
  property.address?.city || property.address?.state || 'Jamaica';

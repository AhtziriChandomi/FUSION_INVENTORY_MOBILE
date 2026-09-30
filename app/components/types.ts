export type Option = { value: number; label: string };

// value 0 = "sin cambio" (el backend conserva el valor actual del activo)
export type Changes = { organization: Option; center: Option; location: Option; status: Option };

// Location no está aquí: depende del centro y se carga aparte (LocationSelect)
export type Catalogs = { organizations: Option[]; centers: Option[]; statuses: Option[] };

export type ReviewRow = {
  assetNumber: string;
  changes: Changes;  // valores que se aplicarán (del lote o individuales)
  edited: boolean;   // true = tiene valores individuales
  changed: boolean;  // true = tiene al menos un campo por cambiar
};

export const NO_CHANGE: Option = { value: 0, label: 'No change' };

export const emptyChanges = (): Changes => ({
  organization: NO_CHANGE,
  center: NO_CHANGE,
  location: NO_CHANGE,
  status: NO_CHANGE,
});

export const hasAnyChange = (c: Changes) =>
  c.organization.value !== 0 || c.center.value !== 0 || c.location.value !== 0 || c.status.value !== 0;

// Si cambias el centro, la location nueva es obligatoria (la anterior era del otro centro)
export const needsLocation = (c: Changes) => c.center.value !== 0 && c.location.value === 0;
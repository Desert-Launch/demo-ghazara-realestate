export {
  createProperty,
  deleteProperty,
  fetchProperties,
  fetchProperty,
  setPropertyStatus,
  toPropertyFormValues,
  toPropertyInput,
  updateProperty,
  type PropertyInput,
} from "./api";
export {
  propertyKeys,
  useCreateProperty,
  useDeleteProperty,
  useProperties,
  useProperty,
  usePublicProperties,
  useSetPropertyStatus,
  useUpdateProperty,
} from "./hooks/use-properties";
export {
  PROPERTY_FORM_DEFAULTS,
  makePropertyFormSchema,
  type PropertyFormValues,
} from "./schema";
export { similarProperties } from "./similar";
export {
  PROPERTY_STATUS_META,
  PROPERTY_TYPE_META,
  closingStatusFor,
  type PropertyStatusMeta,
  type PropertyTypeMeta,
} from "./taxonomy";
export { FacadePlate, type PlateView } from "./components/facade-plate";
export { AdminPropertiesView } from "./components/admin-properties-view";
export { AdminPropertyTable } from "./components/admin-property-table";
export { PropertyCard, PropertyCardSkeleton } from "./components/property-card";
export { PropertyDetail } from "./components/property-detail";
export { PropertyFormDialog } from "./components/property-form-dialog";
export { PropertyGallery } from "./components/property-gallery";
export { StatusBadge, TransactionPill } from "./components/property-badges";
export { SpecList } from "./components/spec-list";

export interface CategorySeed {
  id: string; // Fixed UUID for seed predictability
  name: string;
  slug: string;
}

export const CATEGORIES_SEED: CategorySeed[] = [
  {
    id: "10000000-0000-4000-a000-000000000001",
    name: "Traffic",
    slug: "traffic",
  },
  {
    id: "10000000-0000-4000-a000-000000000002",
    name: "Vehicles",
    slug: "vehicle",
  },
  {
    id: "10000000-0000-4000-a000-000000000003",
    name: "Documents",
    slug: "documents",
  },
  {
    id: "10000000-0000-4000-a000-000000000004",
    name: "Government",
    slug: "government",
  },
  {
    id: "10000000-0000-4000-a000-000000000005",
    name: "Tax",
    slug: "tax",
  },
  {
    id: "10000000-0000-4000-a000-000000000006",
    name: "Business",
    slug: "business",
  },
  {
    id: "10000000-0000-4000-a000-000000000007",
    name: "Police",
    slug: "police",
  },
  {
    id: "10000000-0000-4000-a000-000000000008",
    name: "Municipal",
    slug: "municipal",
  },
];

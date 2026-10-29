// UX-Spec §1.2. Delivery zones in Business-Facts.md map districts to fees.
export const districtsByProvince = {
  Western: ['Colombo', 'Gampaha', 'Kalutara'],
  Central: ['Kandy', 'Matale', 'Nuwara Eliya'],
  Southern: ['Galle', 'Matara', 'Hambantota'],
  Northern: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
  Eastern: ['Batticaloa', 'Ampara', 'Trincomalee'],
  'North Western': ['Kurunegala', 'Puttalam'],
  'North Central': ['Anuradhapura', 'Polonnaruwa'],
  Uva: ['Badulla', 'Monaragala'],
  Sabaragamuwa: ['Ratnapura', 'Kegalle'],
} as const;

export type Province = keyof typeof districtsByProvince;
export type District = (typeof districtsByProvince)[Province][number];

export const districts = Object.values(districtsByProvince)
  .flat()
  .sort() as District[];

export function provinceForDistrict(district: District): Province {
  const entry = Object.entries(districtsByProvince).find(([, list]) =>
    (list as readonly string[]).includes(district),
  );
  return entry![0] as Province;
}

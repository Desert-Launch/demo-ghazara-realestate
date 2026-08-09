import type { District } from "@/types";

/**
 * Reference geometry for the drawn district panel on /properties and /contact.
 *
 * This is a stylised diagram, not a map: no tiles, no map library, no
 * coordinates. Positions are relative and only roughly follow how these
 * districts actually sit against each other in north Riyadh — north at the top,
 * Al Arid furthest out, Hittin down to the south-west.
 *
 * The viewBox is 0 0 100 100 in both axes, so every number here is a percentage
 * and the panel scales to any width.
 */
export interface DistrictShape {
  id: District;
  /** SVG polygon points inside the 100×100 viewBox. */
  points: string;
  /** Where the label and the pin cluster sit. */
  centre: { x: number; y: number };
}

export const DISTRICT_SHAPES: DistrictShape[] = [
  {
    id: "arid",
    points: "34,3 68,5 72,21 46,25 31,19",
    centre: { x: 51, y: 14 },
  },
  {
    id: "qirawan",
    points: "8,17 33,19 35,37 13,39 5,29",
    centre: { x: 21, y: 28 },
  },
  {
    id: "narjis",
    points: "37,23 69,21 71,43 39,45",
    centre: { x: 54, y: 33 },
  },
  {
    id: "rabie",
    points: "73,23 97,27 95,47 71,45",
    centre: { x: 84, y: 35 },
  },
  {
    id: "malqa",
    points: "13,42 34,44 34,69 11,67",
    centre: { x: 23, y: 56 },
  },
  {
    id: "yasmin",
    points: "37,47 69,47 67,67 35,65",
    centre: { x: 52, y: 57 },
  },
  {
    id: "sahafah",
    points: "71,49 95,51 93,71 69,69",
    centre: { x: 82, y: 60 },
  },
  {
    id: "hittin",
    points: "10,71 34,73 32,95 7,93",
    centre: { x: 21, y: 83 },
  },
];

/** The two arterials the districts hang off, drawn as thin rules. */
export const DISTRICT_ROADS = [
  { id: "anas-ibn-malik", d: "M2,46 L98,44" },
  { id: "king-salman", d: "M36,2 L34,98" },
  { id: "northern-ring", d: "M2,70 L98,72" },
];

const SHAPE_BY_ID = new Map(DISTRICT_SHAPES.map((shape) => [shape.id, shape]));

export function districtCentre(id: District): { x: number; y: number } {
  return SHAPE_BY_ID.get(id)?.centre ?? { x: 50, y: 50 };
}

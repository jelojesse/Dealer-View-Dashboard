// @ts-nocheck
// Host map pins from Figma "Locator Page V2" (Map Pin 2869:56123, Category Icons 2869:58169).
// A pin = border layer + fill layer in the host's status colour, with the white category icon inside.
// "Clicked" adds the soft glow from the design. SVGs live in src/assets/locator (downloaded from Figma).
import PIN from '../assets/locator/pin.svg?raw';
import PIN_BORDER from '../assets/locator/pin-hover.svg?raw';
import GLOW from '../assets/locator/pin-clicked-glow.svg?raw';
import gym from '../assets/locator/cat-gym.svg?raw';
import convenience from '../assets/locator/cat-convenience-store.svg?raw';
import mall from '../assets/locator/cat-mall-supermarket.svg?raw';
import fastFood from '../assets/locator/cat-fast-food.svg?raw';
import pharmacy from '../assets/locator/cat-pharmacy.svg?raw';
import library from '../assets/locator/cat-library.svg?raw';
import hospital from '../assets/locator/cat-hospital.svg?raw';
import apartments from '../assets/locator/cat-apartments.svg?raw';
import buildings from '../assets/locator/cat-big-buildings.svg?raw';
import airport from '../assets/locator/cat-airport.svg?raw';
import gas from '../assets/locator/cat-gas-station.svg?raw';
import bus from '../assets/locator/cat-bus-stop.svg?raw';
import church from '../assets/locator/cat-church.svg?raw';

var ICONS = { gym: gym, 'convenience store': convenience, 'mall/supermarket': mall, 'fast food': fastFood, pharmacy: pharmacy, library: library,
  hospital: hospital, apartments: apartments, 'big buildings': buildings, airport: airport, 'gas station': gas, 'bus stop': bus, church: church };

/* Status colours: fill + border (online values are the Figma tokens Pin/Online #3ADB30, Pin - Border/Online #0BBA00). */
export var PIN_COLORS = {
  online: { fill: '#3ADB30', border: '#0BBA00', rgb: [0.227451, 0.858824, 0.188235] },
  pending: { fill: '#FFA500', border: '#D98A00', rgb: [1, 0.647, 0] },
  offline: { fill: '#E73535', border: '#B81F1F', rgb: [0.906, 0.208, 0.208] }
};

/* Map the app's host categories onto the 13 Figma category icons. */
var CAT_MAP = {
  restaurant: 'fast food', cafe: 'fast food', bakery: 'fast food', bar: 'fast food', 'fast food': 'fast food', 'coffee': 'fast food',
  gym: 'gym', fitness: 'gym',
  pharmacy: 'pharmacy',
  dental: 'hospital', clinic: 'hospital', veterinary: 'hospital', hospital: 'hospital', hospitals: 'hospital',
  grocery: 'mall/supermarket', retail: 'mall/supermarket', 'pet store': 'mall/supermarket', mall: 'mall/supermarket', supermarket: 'mall/supermarket',
  'liquor store': 'convenience store', 'convenience store': 'convenience store', laundry: 'convenience store',
  'auto service': 'gas station', 'gas station': 'gas station',
  hotel: 'big buildings', salon: 'big buildings', barber: 'big buildings', office: 'big buildings',
  apartments: 'apartments', library: 'library', airport: 'airport', 'bus stop': 'bus stop', church: 'church'
};
export function categoryKey(category) { return CAT_MAP[String(category || '').toLowerCase()] || 'big buildings'; }
function strip(svg) { return svg.replace(/\s(preserveAspectRatio|overflow|style)="[^"]*"/g, ''); }
function sized(svg, attrs) { return strip(svg).replace('<svg', '<svg ' + attrs); }

/* Category icon SVG (white by default; pass a colour for chips). */
export function categoryIcon(category, color, size) {
  var svg = ICONS[categoryKey(category)];
  if (color) svg = svg.replace(/fill="white"/gi, 'fill="' + color + '"').replace(/fill="#fff(fff)?"/gi, 'fill="' + color + '"');
  return sized(svg, 'width="' + (size || 14) + '" height="' + (size || 14) + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true"');
}

/* Full pin markup for a Leaflet divIcon: 30×40, anchor at the tip. */
export function pinHtml(status, category, clicked) {
  var c = PIN_COLORS[status] || PIN_COLORS.online;
  var border = sized(PIN_BORDER, 'class="mp-border" width="30" height="40"').replace(/#0BBA00/gi, c.border);
  var fill = sized(PIN, 'class="mp-fill"').replace(/#3ADB30/gi, c.fill);
  var glow = clicked ? sized(GLOW, 'class="mp-glow"').replace(/#0BBA00/gi, c.border)
    .replace('0 0 0 0 0.227451 0 0 0 0 0.858824 0 0 0 0 0.188235', '0 0 0 0 ' + c.rgb[0] + ' 0 0 0 0 ' + c.rgb[1] + ' 0 0 0 0 ' + c.rgb[2])
    .replace(/filter0_d_0_396/g, 'mpglow_' + status) : '';
  return '<span class="mp' + (clicked ? ' is-clicked' : '') + '">' + glow + border + fill + '<span class="mp-cat">' + categoryIcon(category) + '</span></span>';
}

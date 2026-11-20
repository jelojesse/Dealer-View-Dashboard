// @ts-nocheck
// Mock data for the Admin view (Dealers list + single Dealer page). Merged into D in mockData.js,
// so pages read it as D.dealers, D.dealerActivity, D.impersonations, D.programmatic, D.territory.
// Values follow the Figma "Dealers Page V2 – NTV360" frames. Edit freely.

var PHOTOS = [
  'images/f31035d36ea14a442085349a66032fb9.jpg', 'images/00a9efca3bfe9d27b9efdfc8e2059e1a.jpg', 'images/02b29c7340204f5ef58d946101ef7179.jpg',
  'images/0454fc2c195f0f36db40016f48589ca7.jpg', 'images/0627c2363858277fcaaa53752275874e.jpg', 'images/071fd1b30a9fd087421447c24a93d410.jpg'
];

/* [alias, business, contact, ageMonths, lic total, unassigned, online, offline, hosts scheduled, total, active, adv total, active, status, risk, city/state, since] */
var ROWS = [
  ['001-IBNLI', 'Ibanez Lighting Inc.', 'Jesse Ibanez', 14, 97, 6, 71, 20, 2, 43, 40, 24, 21, 'Active', 'ontrack', 'Tuscaloosa, AL', 'September 2, 2025'],
  ['JSD-DLR', '483-Sunset Park Miami', 'Iguana', 3, 2, 1, 0, 4, 0, 1, 0, 0, 0, 'Active', 'atrisk', 'Miami, FL', 'August 12, 2026'],
  ['DRK-PSY', 'Waffle Inc.', 'Jsan Dealerr', 6, 5, 2, 3, 0, 1, 0, 0, 0, 1, 'Active', 'ontrack', 'Orlando, FL', 'May 3, 2026'],
  ['YNKN-BRGR', 'Bebedor Inc.', 'Josh', 1, 0, 0, 0, 2, 0, 1, 0, 0, 0, 'Active', 'atrisk', 'Austin, TX', 'October 1, 2026'],
  ['RNLD', 'Yunken Burger', 'Seev Rantillan', 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 'Active', 'atrisk', 'Houston, TX', 'November 2, 2026'],
  ['487-FL', 'Subway Surfer', 'Digong', 12, 3, 4, 0, 0, 2, 1, 0, 0, 0, 'Active', 'ontrack', 'Tampa, FL', 'November 8, 2025'],
  ['NN-HS', 'Heartstarter', 'Charlie Spring', 8, 0, 1, 2, 3, 0, 0, 0, 1, 0, 'Active', 'ontrack', 'Denver, CO', 'March 14, 2026'],
  ['SERAPH', 'Seraph Skin', 'Sobi Sourn55o', 5, 2, 0, 1, 1, 0, 0, 1, 0, 0, 'Active', 'highrisk', 'Phoenix, AZ', 'June 20, 2026'],
  ['JSAN-DLR', 'Transparent Iguana', 'Jay Dealer', 1, 2, 1, 0, 3, 1, 2, 0, 1, 0, 'Inactive', 'ontrack', 'Atlanta, GA', 'October 6, 2026'],
  ['Manuel', 'Iguana Inc.', 'Quezon Doe', 1, 2, 1, 0, 3, 1, 2, 0, 1, 0, 'Inactive', 'ontrack', 'Savannah, GA', 'October 9, 2026'],
  ['FNL-PRSBTTN', 'Healthey', 'Kevin Durant', 3, 3, 2, 1, 4, 2, 1, 1, 0, 1, 'Inactive', 'highrisk', 'Oakland, CA', 'August 1, 2026'],
  ['485-BH', '485-Downtown Miami', 'Carlos Rivera', 6, 5, 3, 2, 6, 3, 4, 3, 2, 0, 'Inactive', 'highrisk', 'Miami, FL', 'May 18, 2026'],
  ['482-FL', 'Test Corporation', 'Abbie Ville', 16, 188, 12, 86, 102, 4, 188, 86, 71, 68, 'Active', 'ontrack', 'Abbeville, SC SE', 'July 15, 2025'],
  ['ATL-GRP', 'Aztech Foundations', 'Mara Lopez', 9, 14, 2, 10, 2, 1, 9, 8, 6, 5, 'Active', 'ontrack', 'Birmingham, AL', 'February 2, 2026'],
  ['BLU-WAVE', 'Blue Wave Media', 'Tom Hardy', 4, 7, 1, 4, 2, 0, 5, 4, 3, 2, 'Active', 'atrisk', 'Mobile, AL', 'July 30, 2026']
];

var TAGS = { ontrack: ['On Track', 'Q-Team', 'Trained'], atrisk: ['At Risk', 'Q-Team'], highrisk: ['High Risk', 'Needs Training'] };

var dealers = ROWS.map(function (r, i) {
  return {
    id: 'd' + (i + 1), alias: r[0], business: r[1], contact: r[2], age: r[3],
    lic: { total: r[4], unassigned: r[5], online: r[6], offline: r[7], lan: Math.round(r[4] * 0.53), wifi: Math.round(r[4] * 0.53) },
    hosts: { scheduled: r[8], total: r[9], active: r[10] },
    adv: { total: r[11], active: r[12] },
    status: r[13], risk: r[14], location: r[15], since: r[16], tags: TAGS[r[14]], photo: PHOTOS[i % PHOTOS.length]
  };
});

/* Activity log rows: [target, user, role, module, action, datetime, detail] */
var dealerActivity = [
  ['Assigned a license', 'Joe Admin', 'Super Admin', 'Host', 'Assigned', '10/01/26 04:41 PM', 'License #144 assigned to Plaza O’ George.'],
  ['Created a screen', 'Joe Admin', 'Super Admin', 'Screen', 'Created', '10/01/26 03:14 PM', 'Screen “Food Industry Screen 2403” created with Standard Template V2.'],
  ['Modified the host', 'Noob Inc.', 'Dealer', 'Host', 'Updated', '10/01/26 01:58 PM', 'Business hours changed for Pinewood Fitness.'],
  ['Unassigned a license', 'Noob Inc.', 'Dealer', 'Host', 'Unassigned', '05/05/26 03:37 PM', 'License #12 unassigned from Hub City Diner.'],
  ['Assigned a license', 'Togy Dealer Admin', 'Dealer Admin', 'Host', 'Assigned', '05/05/26 03:37 PM', 'License #9 assigned to Gold’s Gym Parker.'],
  ['Created a screen', 'Joe Admin', 'Super Admin', 'Screen', 'Created', '05/05/26 03:37 PM', 'Screen “Lobby Portrait” created.'],
  ['Modified the host', 'Noob Inc.', 'Dealer', 'Host', 'Updated', '05/05/26 03:37 PM', 'Host address corrected.'],
  ['Assigned a license', 'Joe Admin', 'Super Admin', 'Host', 'Assigned', '05/05/26 03:37 PM', 'License #3 assigned to Anytime Fitness.'],
  ['Unassigned a license', 'Joe Admin', 'Super Admin', 'Host', 'Unassigned', '05/05/26 03:37 PM', 'License #22 unassigned from Planet Gym.'],
  ['Uploaded content', 'Togy Dealer Admin', 'Dealer Admin', 'Media', 'Created', '04/28/26 11:02 AM', '3 videos uploaded to Media Library.'],
  ['Modified a playlist', 'Noob Inc.', 'Dealer', 'Playlist', 'Updated', '04/27/26 09:15 AM', 'The Sedaap Hero Promo: 2 items reordered.'],
  ['Deleted an advertiser', 'Joe Admin', 'Super Admin', 'Advertiser', 'Unassigned', '04/20/26 05:44 PM', 'Advertiser “Headband Movers” removed.']
].map(function (r, i) { return { id: 'ac' + (i + 1), target: r[0], user: r[1], role: r[2], module: r[3], action: r[4], at: r[5], detail: r[6] }; });

/* Impersonate log rows: [impersonator, note, start, end, duration] */
var impersonations = [
  ['Joe Admin', 'Verified user credentials and reset password for account recovery', '10/01/24 09:15 AM', '10/02/24 10:30 AM', '1h 15m 00s'],
  ['Joe Admin', 'Diagnosed connectivity issue and updated network settings', '10/03/24 02:45 PM', '10/03/24 04:00 PM', '1h 15m 10s'],
  ['Mara Support', 'Assisted with email sync problems and cleared cache', '10/04/24 11:10 AM', '10/04/24 12:20 PM', '1h 10m 50s'],
  ['Joe Admin', 'Reviewed account settings and enabled two-factor authentication', '10/05/24 03:05 PM', '10/05/24 04:20 PM', '1h 15m 15s'],
  ['Mara Support', 'Resolved billing discrepancy and updated payment information', '10/06/24 08:00 AM', '10/06/24 09:10 AM', '1h 10m 30s'],
  ['Joe Admin', 'Troubleshot app crashes and cleared corrupted user data', '10/07/24 01:30 PM', '10/07/24 02:45 PM', '1h 15m 05s'],
  ['Joe Admin', 'Assisted with profile customization and restored default settings', '10/08/24 10:20 AM', '10/08/24 11:35 AM', '1h 15m 00s'],
  ['Mara Support', 'Investigated unauthorized access alerts and secured account', '10/09/24 05:00 PM', '10/09/24 06:15 PM', '1h 15m 10s']
].map(function (r, i) { return { id: 'im' + (i + 1), who: r[0], note: r[1], start: r[2], end: r[3], duration: r[4] }; });

var programmatic = ['Pixabay', 'Pexels', 'Storyblocks', 'Shutterstock', 'Envato Elements', 'Videvo'].map(function (name, i) {
  return { id: 'pg' + (i + 1), name: name, on: i !== 3, hosts: ['312-Aurora Collision Center', '312-Cakes by Karen', '312-Colorado’s Pro Gym'].map(function (h, k) { return { id: 'pg' + (i + 1) + 'h' + k, name: h, on: !(i === 2 && k === 1) }; }) };
});

var territory = {
  name: 'Aztech Foundations', state: 'Alabama', lng: '42.1114339', lat: '-72.5655066', area: '15.2 km²', created: 'July 14, 2025',
  host: { name: 'Summit Fitness', status: 'Active', address: '123 Muscle Beach Rd, Cooling, AL 35449', category: 'Tourist Attraction', licenses: ['License # 10', 'License # 29'], coords: '39.7415974, -104.9893819',
    hours: [['Monday', '10:00 AM - 08:00 PM'], ['Tuesday', '10:00 AM - 08:00 PM'], ['Wednesday', '10:00 AM - 08:00 PM'], ['Thursday', '10:00 AM - 08:00 PM'], ['Friday', '10:00 AM - 08:00 PM'], ['Saturday', '09:00 AM - 08:00 PM'], ['Sunday', '10:00 AM - 08:00 PM']] },
  // Polygon in a 800×520 map viewBox.
  shape: '520,40 548,40 520,170 528,250 640,262 650,430 600,470 470,450 410,420 360,380 335,240 395,240 430,180 450,120'
};

/* Dealers analytics (Figma "Show Analytics" state). */
var dealerSeries = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  active: [42, 28, 31, 38, 44, 38, 49, 51, 61, 75, 96, 91],
  onboarding: [12, 7, 1, 3, 2, 7, 4, 7, 13, 6, 7, 5],
  risk: { ontrack: [16, 23, 33, 41, 42, 39, 47, 41, 30, 8, 42, 23], atrisk: [24, 26, 44, 11, 7, 9, 19, 39, 47, 40, 2, 7], highrisk: [55, 49, 37, 26, 22, 10, 6, 1, 0, 2, 1, 11] }
};

export var ADMIN = { dealers: dealers, dealerActivity: dealerActivity, impersonations: impersonations, programmatic: programmatic, territory: territory, dealerSeries: dealerSeries };

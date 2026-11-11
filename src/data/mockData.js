// Mock data shared by every Dealer View page (dealer, hosts, advertisers, licenses,
// screens, playlists, media, channels, tags). Edit values here to change what the UI shows.
// Image paths like "images/<id>.jpg" point at public/images (placeholders; replace with real files of the same name).
export const D = {
  "dealer": {
    "code": "001-IBNLI",
    "name": "Ibanez Lighting Inc.",
    "short": "Ibanez Lighting"
  },
  "B": {
    "btb": "images/ch-beyond-the-blue.jpg",
    "telescope": "images/star-garden-observatory.jpg",
    "starlens": "images/starlit-river.jpg",
    "orbit": "images/planet-grove.jpg",
    "steak": "images/comet-meadow.jpg",
    "porkchop": "images/the-moonlight-garden.jpg",
    "salad": "images/galactic-forest-gathering.jpg",
    "astral": "images/astral-grove-library.jpg",
    "buynow": "images/forest-beneath-the-nebula.jpg",
    "banso": "images/celestial-tree-of-life.jpg",
    "advert": "images/dancing-aurora.jpg",
    "zSteak": "images/comet-meadow-hero.jpg",
    "zBottle": "images/mirrors-of-the-wetlands.jpg",
    "zBuy": "images/explorer-with-map.jpg",
    "zWood": "images/vast-empty-mountain.jpg",
    "oranges": "images/hadal-amphipod.jpg",
    "map": "images/5b2e0dcf217c7df2f651979c9ad77235.jpg"
  },
  "terr": [
    [
      735,
      235
    ],
    [
      905,
      215
    ],
    [
      985,
      250
    ],
    [
      1000,
      330
    ],
    [
      965,
      405
    ],
    [
      870,
      440
    ],
    [
      770,
      430
    ],
    [
      720,
      380
    ],
    [
      712,
      300
    ]
  ],
  "territory": {
    "name": "Tuscaloosa–Birmingham Territory",
    "state": "Alabama",
    "area": "4,812 km²",
    "created": "Jul 14, 2025"
  },
  "hosts": [
    {
      "id": "h1",
      "name": "Plaza O’ George",
      "category": "Restaurant",
      "address": "100 University Blvd",
      "city": "Tuscaloosa",
      "state": "AL",
      "zip": "35401",
      "status": "Active",
      "mx": 977.1,
      "my": 284.0,
      "lat": 33.460051,
      "lng": -87.095868,
      "photo": "images/f31035d36ea14a442085349a66032fb9.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Oct 1, 2026",
      "lic": [
        "l1",
        "l44",
        "l87"
      ]
    },
    {
      "id": "h2",
      "name": "Sunrise Diner",
      "category": "Restaurant",
      "address": "137 McFarland Blvd",
      "city": "Northport",
      "state": "AL",
      "zip": "35414",
      "status": "Active",
      "mx": 774.0,
      "my": 247.6,
      "lat": 33.520659,
      "lng": -87.486458,
      "photo": "images/9c0f78293758033c038e452ab3445fa5.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Oct 8, 2026",
      "lic": [
        "l2",
        "l45",
        "l88"
      ]
    },
    {
      "id": "h3",
      "name": "Main St Pharmacy",
      "category": "Pharmacy",
      "address": "174 Greensboro Ave",
      "city": "Birmingham",
      "state": "AL",
      "zip": "35427",
      "status": "Active",
      "mx": 748.9,
      "my": 389.0,
      "lat": 33.285001,
      "lng": -87.534798,
      "photo": "images/2de7073d659fa227749c8f0299496129.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Oct 15, 2026",
      "lic": [
        "l3",
        "l46",
        "l89"
      ]
    },
    {
      "id": "h4",
      "name": "Harbor View Hotel",
      "category": "Hotel",
      "address": "211 Lurleen Wallace Blvd",
      "city": "Hoover",
      "state": "AL",
      "zip": "35440",
      "status": "Active",
      "mx": 844.9,
      "my": 336.7,
      "lat": 33.372091,
      "lng": -87.350159,
      "photo": "images/bbaf85c5b94c73e37b4cbffa9a642166.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Oct 22, 2026",
      "lic": [
        "l4",
        "l47",
        "l90"
      ]
    },
    {
      "id": "h5",
      "name": "Bean & Leaf Cafe",
      "category": "Cafe",
      "address": "248 Skyland Blvd",
      "city": "Alabaster",
      "state": "AL",
      "zip": "35453",
      "status": "Active",
      "mx": 950.4,
      "my": 301.3,
      "lat": 33.431208,
      "lng": -87.147229,
      "photo": "images/f2c9944edfb94cbe0a09023cec5e30b5.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Sep 2, 2026",
      "lic": [
        "l5",
        "l48",
        "l91"
      ]
    },
    {
      "id": "h6",
      "name": "Iron Works Gym",
      "category": "Gym",
      "address": "285 5th Ave N",
      "city": "Bessemer",
      "state": "AL",
      "zip": "35466",
      "status": "Active",
      "mx": 758.1,
      "my": 297.1,
      "lat": 33.438157,
      "lng": -87.517058,
      "photo": "images/c51d296b0dad7f7ba90c8108bd8d63f3.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Sep 9, 2026",
      "lic": [
        "l6",
        "l49",
        "l92"
      ]
    },
    {
      "id": "h7",
      "name": "Bright Smile Dental",
      "category": "Dental",
      "address": "322 Highway 31",
      "city": "Vestavia Hills",
      "state": "AL",
      "zip": "35479",
      "status": "Active",
      "mx": 771.7,
      "my": 412.8,
      "lat": 33.245257,
      "lng": -87.490884,
      "photo": "images/3150cc95c587f5d4777692f813e16534.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Sep 16, 2026",
      "lic": [
        "l7",
        "l50",
        "l93"
      ]
    },
    {
      "id": "h8",
      "name": "Quick Lube Center",
      "category": "Auto Service",
      "address": "359 Valleydale Rd",
      "city": "Homewood",
      "state": "AL",
      "zip": "35492",
      "status": "Active",
      "mx": 930.1,
      "my": 361.4,
      "lat": 33.330919,
      "lng": -87.18641,
      "photo": "images/ec827ec7c42f6fc992bed1db57a88695.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Sep 23, 2026",
      "lic": [
        "l8",
        "l51"
      ]
    },
    {
      "id": "h9",
      "name": "Glow Studio Salon",
      "category": "Salon",
      "address": "396 Lorna Rd",
      "city": "Pelham",
      "state": "AL",
      "zip": "35505",
      "status": "Active",
      "mx": 981.7,
      "my": 260.3,
      "lat": 33.499535,
      "lng": -87.087066,
      "photo": "images/f31035d36ea14a442085349a66032fb9.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Aug 3, 2026",
      "lic": [
        "l9",
        "l52"
      ]
    },
    {
      "id": "h10",
      "name": "Tony’s Pizzeria",
      "category": "Restaurant",
      "address": "433 Main St",
      "city": "Calera",
      "state": "AL",
      "zip": "35518",
      "status": "Active",
      "mx": 837.8,
      "my": 282.9,
      "lat": 33.461779,
      "lng": -87.363903,
      "photo": "images/9c0f78293758033c038e452ab3445fa5.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Aug 10, 2026",
      "lic": [
        "l10",
        "l53"
      ]
    },
    {
      "id": "h11",
      "name": "Fresh Market Grocery",
      "category": "Grocery",
      "address": "470 University Blvd",
      "city": "Trussville",
      "state": "AL",
      "zip": "35531",
      "status": "Active",
      "mx": 892.5,
      "my": 250.0,
      "lat": 33.516652,
      "lng": -87.258574,
      "photo": "images/2de7073d659fa227749c8f0299496129.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Aug 17, 2026",
      "lic": [
        "l11",
        "l54"
      ]
    },
    {
      "id": "h12",
      "name": "Andrew’s Fitness Gym",
      "category": "Gym",
      "address": "507 McFarland Blvd",
      "city": "Cottondale",
      "state": "AL",
      "zip": "35544",
      "status": "Active",
      "mx": 870.0,
      "my": 291.6,
      "lat": 33.447262,
      "lng": -87.301942,
      "photo": "images/bbaf85c5b94c73e37b4cbffa9a642166.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Aug 24, 2026",
      "lic": [
        "l12",
        "l55"
      ]
    },
    {
      "id": "h13",
      "name": "Riverbend Bistro",
      "category": "Restaurant",
      "address": "544 Greensboro Ave",
      "city": "Brookwood",
      "state": "AL",
      "zip": "35557",
      "status": "Active",
      "mx": 809.2,
      "my": 251.0,
      "lat": 33.515063,
      "lng": -87.418926,
      "photo": "images/f2c9944edfb94cbe0a09023cec5e30b5.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Jul 4, 2026",
      "lic": [
        "l13",
        "l56"
      ]
    },
    {
      "id": "h14",
      "name": "Crimson Tide Sports Bar",
      "category": "Bar",
      "address": "581 Lurleen Wallace Blvd",
      "city": "Tuscaloosa",
      "state": "AL",
      "zip": "35570",
      "status": "Active",
      "mx": 899.7,
      "my": 239.2,
      "lat": 33.53469,
      "lng": -87.244846,
      "photo": "images/c51d296b0dad7f7ba90c8108bd8d63f3.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Jul 11, 2026",
      "lic": [
        "l14",
        "l57"
      ]
    },
    {
      "id": "h15",
      "name": "Magnolia Vet Clinic",
      "category": "Veterinary",
      "address": "618 Skyland Blvd",
      "city": "Northport",
      "state": "AL",
      "zip": "35583",
      "status": "Active",
      "mx": 835.5,
      "my": 241.3,
      "lat": 33.531132,
      "lng": -87.36819,
      "photo": "images/3150cc95c587f5d4777692f813e16534.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Jul 18, 2026",
      "lic": [
        "l15",
        "l58"
      ]
    },
    {
      "id": "h16",
      "name": "Northport Auto Spa",
      "category": "Auto Service",
      "address": "655 5th Ave N",
      "city": "Birmingham",
      "state": "AL",
      "zip": "35596",
      "status": "Active",
      "mx": 765.5,
      "my": 299.2,
      "lat": 33.434699,
      "lng": -87.502907,
      "photo": "images/ec827ec7c42f6fc992bed1db57a88695.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Jul 25, 2026",
      "lic": [
        "l16",
        "l59"
      ]
    },
    {
      "id": "h17",
      "name": "Druid City Coffee",
      "category": "Cafe",
      "address": "692 Highway 31",
      "city": "Hoover",
      "state": "AL",
      "zip": "35609",
      "status": "Active",
      "mx": 944.1,
      "my": 258.5,
      "lat": 33.502443,
      "lng": -87.159412,
      "photo": "images/f31035d36ea14a442085349a66032fb9.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Jun 5, 2026",
      "lic": [
        "l17",
        "l60"
      ]
    },
    {
      "id": "h18",
      "name": "Lakeview Laundromat",
      "category": "Laundry",
      "address": "729 Valleydale Rd",
      "city": "Alabaster",
      "state": "AL",
      "zip": "35622",
      "status": "Active",
      "mx": 903.6,
      "my": 410.0,
      "lat": 33.249949,
      "lng": -87.237282,
      "photo": "images/9c0f78293758033c038e452ab3445fa5.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Jun 12, 2026",
      "lic": [
        "l18",
        "l61"
      ]
    },
    {
      "id": "h19",
      "name": "Peppa Flame Lounge",
      "category": "Bar",
      "address": "766 Lorna Rd",
      "city": "Bessemer",
      "state": "AL",
      "zip": "35635",
      "status": "Active",
      "mx": 777.8,
      "my": 235.9,
      "lat": 33.540116,
      "lng": -87.479219,
      "photo": "images/2de7073d659fa227749c8f0299496129.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Jun 19, 2026",
      "lic": [
        "l19",
        "l62"
      ]
    },
    {
      "id": "h20",
      "name": "Southern Smoke BBQ",
      "category": "Restaurant",
      "address": "803 Main St",
      "city": "Vestavia Hills",
      "state": "AL",
      "zip": "35648",
      "status": "Inactive",
      "mx": 854.4,
      "my": 390.2,
      "lat": 33.282994,
      "lng": -87.331981,
      "photo": "images/bbaf85c5b94c73e37b4cbffa9a642166.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Jun 26, 2026",
      "lic": [
        "l20",
        "l63"
      ]
    },
    {
      "id": "h21",
      "name": "Alabaster Family Dental",
      "category": "Dental",
      "address": "840 University Blvd",
      "city": "Homewood",
      "state": "AL",
      "zip": "35661",
      "status": "Active",
      "mx": 883.4,
      "my": 380.5,
      "lat": 33.299211,
      "lng": -87.27606,
      "photo": "images/f2c9944edfb94cbe0a09023cec5e30b5.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "May 6, 2026",
      "lic": [
        "l21",
        "l64"
      ]
    },
    {
      "id": "h22",
      "name": "Calera Car Wash",
      "category": "Auto Service",
      "address": "877 McFarland Blvd",
      "city": "Pelham",
      "state": "AL",
      "zip": "35674",
      "status": "Active",
      "mx": 940.1,
      "my": 326.6,
      "lat": 33.389083,
      "lng": -87.167138,
      "photo": "images/c51d296b0dad7f7ba90c8108bd8d63f3.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "May 13, 2026",
      "lic": [
        "l22",
        "l65"
      ]
    },
    {
      "id": "h23",
      "name": "Hoover Urgent Care",
      "category": "Clinic",
      "address": "914 Greensboro Ave",
      "city": "Calera",
      "state": "AL",
      "zip": "35407",
      "status": "Active",
      "mx": 930.4,
      "my": 385.7,
      "lat": 33.290549,
      "lng": -87.185792,
      "photo": "images/3150cc95c587f5d4777692f813e16534.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "May 20, 2026",
      "lic": [
        "l23",
        "l66"
      ]
    },
    {
      "id": "h24",
      "name": "Vestavia Bakehouse",
      "category": "Bakery",
      "address": "951 Lurleen Wallace Blvd",
      "city": "Trussville",
      "state": "AL",
      "zip": "35420",
      "status": "Active",
      "mx": 841.4,
      "my": 381.1,
      "lat": 33.298168,
      "lng": -87.356994,
      "photo": "images/ec827ec7c42f6fc992bed1db57a88695.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "May 27, 2026",
      "lic": [
        "l24",
        "l67"
      ]
    },
    {
      "id": "h25",
      "name": "Bessemer Barber Co.",
      "category": "Barber",
      "address": "988 Skyland Blvd",
      "city": "Cottondale",
      "state": "AL",
      "zip": "35433",
      "status": "Active",
      "mx": 904.8,
      "my": 247.4,
      "lat": 33.521008,
      "lng": -87.235052,
      "photo": "images/f31035d36ea14a442085349a66032fb9.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Apr 7, 2026",
      "lic": [
        "l25",
        "l68"
      ]
    },
    {
      "id": "h26",
      "name": "Homewood Yoga Loft",
      "category": "Fitness",
      "address": "1025 5th Ave N",
      "city": "Brookwood",
      "state": "AL",
      "zip": "35446",
      "status": "Active",
      "mx": 723.5,
      "my": 309.0,
      "lat": 33.41837,
      "lng": -87.583721,
      "photo": "images/9c0f78293758033c038e452ab3445fa5.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Apr 14, 2026",
      "lic": [
        "l26",
        "l69"
      ]
    },
    {
      "id": "h27",
      "name": "Pelham Pet Supply",
      "category": "Pet Store",
      "address": "1062 Highway 31",
      "city": "Tuscaloosa",
      "state": "AL",
      "zip": "35459",
      "status": "Active",
      "mx": 744.0,
      "my": 398.5,
      "lat": 33.269197,
      "lng": -87.544234,
      "photo": "images/2de7073d659fa227749c8f0299496129.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Apr 21, 2026",
      "lic": [
        "l27",
        "l70"
      ]
    },
    {
      "id": "h28",
      "name": "Trussville Tire Pros",
      "category": "Auto Service",
      "address": "1099 Valleydale Rd",
      "city": "Northport",
      "state": "AL",
      "zip": "35472",
      "status": "Inactive",
      "mx": 960.5,
      "my": 296.8,
      "lat": 33.43861,
      "lng": -87.127958,
      "photo": "images/bbaf85c5b94c73e37b4cbffa9a642166.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Apr 1, 2026",
      "lic": [
        "l28",
        "l71"
      ]
    },
    {
      "id": "h29",
      "name": "Midfield Market",
      "category": "Grocery",
      "address": "1136 Lorna Rd",
      "city": "Birmingham",
      "state": "AL",
      "zip": "35485",
      "status": "Active",
      "mx": 875.6,
      "my": 332.2,
      "lat": 33.379583,
      "lng": -87.2912,
      "photo": "images/f2c9944edfb94cbe0a09023cec5e30b5.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Mar 8, 2026",
      "lic": [
        "l29",
        "l72"
      ]
    },
    {
      "id": "h30",
      "name": "Cottondale Diner",
      "category": "Restaurant",
      "address": "1173 Main St",
      "city": "Hoover",
      "state": "AL",
      "zip": "35498",
      "status": "Active",
      "mx": 751.8,
      "my": 327.9,
      "lat": 33.386858,
      "lng": -87.529207,
      "photo": "images/c51d296b0dad7f7ba90c8108bd8d63f3.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Mar 15, 2026",
      "lic": [
        "l30",
        "l73"
      ]
    },
    {
      "id": "h31",
      "name": "Moundville Mercantile",
      "category": "Retail",
      "address": "1210 University Blvd",
      "city": "Alabaster",
      "state": "AL",
      "zip": "35511",
      "status": "Active",
      "mx": 720.2,
      "my": 287.6,
      "lat": 33.454053,
      "lng": -87.590089,
      "photo": "images/3150cc95c587f5d4777692f813e16534.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Mar 22, 2026",
      "lic": [
        "l31",
        "l74"
      ]
    },
    {
      "id": "h32",
      "name": "Fosters Feed & Seed",
      "category": "Retail",
      "address": "1247 McFarland Blvd",
      "city": "Bessemer",
      "state": "AL",
      "zip": "35524",
      "status": "Active",
      "mx": 772.3,
      "my": 419.5,
      "lat": 33.234103,
      "lng": -87.489866,
      "photo": "images/ec827ec7c42f6fc992bed1db57a88695.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Mar 2, 2026",
      "lic": [
        "l32",
        "l75"
      ]
    },
    {
      "id": "h33",
      "name": "Brookwood Pharmacy",
      "category": "Pharmacy",
      "address": "1284 Greensboro Ave",
      "city": "Vestavia Hills",
      "state": "AL",
      "zip": "35537",
      "status": "Active",
      "mx": 880.5,
      "my": 413.9,
      "lat": 33.24357,
      "lng": -87.281729,
      "photo": "images/f31035d36ea14a442085349a66032fb9.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Feb 9, 2026",
      "lic": [
        "l33",
        "l76"
      ]
    },
    {
      "id": "h34",
      "name": "Coaling Coffee Co.",
      "category": "Cafe",
      "address": "1321 Lurleen Wallace Blvd",
      "city": "Homewood",
      "state": "AL",
      "zip": "35550",
      "status": "Active",
      "mx": 853.3,
      "my": 398.8,
      "lat": 33.268695,
      "lng": -87.333955,
      "photo": "images/9c0f78293758033c038e452ab3445fa5.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Feb 16, 2026",
      "lic": [
        "l34",
        "l77"
      ]
    },
    {
      "id": "h35",
      "name": "Vance Truck Stop",
      "category": "Gas Station",
      "address": "1358 Skyland Blvd",
      "city": "Pelham",
      "state": "AL",
      "zip": "35563",
      "status": "Active",
      "mx": 787.4,
      "my": 412.3,
      "lat": 33.24616,
      "lng": -87.460741,
      "photo": "images/2de7073d659fa227749c8f0299496129.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Feb 23, 2026",
      "lic": [
        "l35",
        "l78"
      ]
    },
    {
      "id": "h36",
      "name": "McCalla Kitchen",
      "category": "Restaurant",
      "address": "1395 5th Ave N",
      "city": "Calera",
      "state": "AL",
      "zip": "35576",
      "status": "Active",
      "mx": 824.8,
      "my": 359.8,
      "lat": 33.333685,
      "lng": -87.38876,
      "photo": "images/bbaf85c5b94c73e37b4cbffa9a642166.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Feb 3, 2026",
      "lic": [
        "l36",
        "l79"
      ]
    },
    {
      "id": "h37",
      "name": "Helena Hair Bar",
      "category": "Salon",
      "address": "1432 Highway 31",
      "city": "Trussville",
      "state": "AL",
      "zip": "35589",
      "status": "Active",
      "mx": 787.8,
      "my": 392.4,
      "lat": 33.279392,
      "lng": -87.459957,
      "photo": "images/f2c9944edfb94cbe0a09023cec5e30b5.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Jan 10, 2025",
      "lic": [
        "l37",
        "l80"
      ]
    },
    {
      "id": "h38",
      "name": "Irondale Cafe",
      "category": "Cafe",
      "address": "1469 Valleydale Rd",
      "city": "Cottondale",
      "state": "AL",
      "zip": "35602",
      "status": "Active",
      "mx": 933.4,
      "my": 259.6,
      "lat": 33.500685,
      "lng": -87.179986,
      "photo": "images/c51d296b0dad7f7ba90c8108bd8d63f3.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Jan 17, 2025",
      "lic": [
        "l38",
        "l81"
      ]
    },
    {
      "id": "h39",
      "name": "Fairfield Fitness",
      "category": "Gym",
      "address": "1506 Lorna Rd",
      "city": "Brookwood",
      "state": "AL",
      "zip": "35615",
      "status": "Active",
      "mx": 894.8,
      "my": 330.8,
      "lat": 33.381921,
      "lng": -87.254303,
      "photo": "images/3150cc95c587f5d4777692f813e16534.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Jan 24, 2025",
      "lic": [
        "l39",
        "l82"
      ]
    },
    {
      "id": "h40",
      "name": "Leeds Liquor & Wine",
      "category": "Liquor Store",
      "address": "1543 Main St",
      "city": "Tuscaloosa",
      "state": "AL",
      "zip": "35628",
      "status": "Active",
      "mx": 819.6,
      "my": 410.3,
      "lat": 33.249456,
      "lng": -87.398941,
      "photo": "images/ec827ec7c42f6fc992bed1db57a88695.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Jan 4, 2025",
      "lic": [
        "l40",
        "l83"
      ]
    },
    {
      "id": "h41",
      "name": "Gardendale Grill",
      "category": "Restaurant",
      "address": "1580 University Blvd",
      "city": "Northport",
      "state": "AL",
      "zip": "35641",
      "status": "Active",
      "mx": 831.9,
      "my": 266.0,
      "lat": 33.490031,
      "lng": -87.375145,
      "photo": "images/f31035d36ea14a442085349a66032fb9.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Dec 11, 2025",
      "lic": [
        "l41",
        "l84"
      ]
    },
    {
      "id": "h42",
      "name": "Tarrant Tacos",
      "category": "Restaurant",
      "address": "1617 McFarland Blvd",
      "city": "Birmingham",
      "state": "AL",
      "zip": "35654",
      "status": "Inactive",
      "mx": 963.4,
      "my": 292.9,
      "lat": 33.445089,
      "lng": -87.122313,
      "photo": "images/9c0f78293758033c038e452ab3445fa5.jpg",
      "hours": "Mon–Fri 10:00 AM – 8:00 PM",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": false
        },
        {
          "name": "Vistar Media",
          "on": false
        }
      ],
      "created": "Dec 18, 2025",
      "lic": [
        "l42",
        "l85"
      ]
    },
    {
      "id": "h43",
      "name": "Center Point Cleaners",
      "category": "Laundry",
      "address": "1654 Greensboro Ave",
      "city": "Hoover",
      "state": "AL",
      "zip": "35667",
      "status": "Active",
      "mx": 803.4,
      "my": 427.1,
      "lat": 33.221542,
      "lng": -87.429957,
      "photo": "images/2de7073d659fa227749c8f0299496129.jpg",
      "hours": "Open 24 hours",
      "dma": "Birmingham (Ann & Tusc)",
      "networks": [
        {
          "name": "Retail Vision",
          "on": true
        },
        {
          "name": "Vistar Media",
          "on": true
        }
      ],
      "created": "Dec 25, 2025",
      "lic": [
        "l43",
        "l86"
      ]
    }
  ],
  "licenses": [
    {
      "id": "l1",
      "key": "e15722bd-870b-4fd9-9d0a-a0c8c6201cce",
      "alias": "License #101",
      "host": "h1",
      "status": "disabled",
      "type": "Ad",
      "net": "",
      "speed": "36 MB/s",
      "anydesk": "721 314 800",
      "anypw": "N9GAVJP9",
      "install": "Oct 1, 2026",
      "request": "Oct 15, 2026",
      "screen": "s1",
      "tags": []
    },
    {
      "id": "l2",
      "key": "37b998cc-f9d8-4e82-9885-c686e77f154a",
      "alias": "License #102",
      "host": "h2",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "428 383 712",
      "anypw": "QN49RT75",
      "install": "Oct 8, 2026",
      "request": "Oct 22, 2026",
      "screen": "s2",
      "tags": []
    },
    {
      "id": "l3",
      "key": "222cb811-3e91-49fc-89c0-ad3ed40e3c95",
      "alias": "License #103",
      "host": "h3",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "591 269 630",
      "anypw": "S6UEY45F",
      "install": "Oct 15, 2026",
      "request": "Sep 2, 2026",
      "screen": "s3",
      "tags": []
    },
    {
      "id": "l4",
      "key": "da9540d5-a17c-4090-a4be-c2ee67c57e19",
      "alias": "License #104",
      "host": "h4",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "692 424 474",
      "anypw": "SW3SBMKX",
      "install": "Oct 22, 2026",
      "request": "Sep 9, 2026",
      "screen": "s4",
      "tags": []
    },
    {
      "id": "l5",
      "key": "39135eb7-7202-432d-bb8d-f2044091ea1e",
      "alias": "License #105",
      "host": "h5",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "741 717 221",
      "anypw": "QS9HTS7M",
      "install": "Sep 2, 2026",
      "request": "Sep 16, 2026",
      "screen": "s5",
      "tags": []
    },
    {
      "id": "l6",
      "key": "cb76894b-ae1a-43ec-918b-5aef2fecbde0",
      "alias": "License #106",
      "host": "h6",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "722 193 559",
      "anypw": "FM2MNZH5",
      "install": "Sep 9, 2026",
      "request": "Sep 23, 2026",
      "screen": "s6",
      "tags": []
    },
    {
      "id": "l7",
      "key": "688666f1-788f-4798-8435-710ebb19e903",
      "alias": "License #107",
      "host": "h7",
      "status": "ready",
      "type": "Ad",
      "net": "",
      "speed": "36 MB/s",
      "anydesk": "556 661 427",
      "anypw": "W9GGF68P",
      "install": "",
      "request": "Aug 3, 2026",
      "screen": "s7",
      "tags": []
    },
    {
      "id": "l8",
      "key": "64d30b01-6e1b-4e3b-a5ab-3a98a5f12fc5",
      "alias": "License #108",
      "host": "h8",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "992 354 960",
      "anypw": "PYZSF92Y",
      "install": "Sep 23, 2026",
      "request": "Aug 10, 2026",
      "screen": "s8",
      "tags": []
    },
    {
      "id": "l9",
      "key": "1b679b99-dfe4-45ea-bbef-3b6c91958a9e",
      "alias": "License #109",
      "host": "h9",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "274 505 272",
      "anypw": "SCWVEMPV",
      "install": "Aug 3, 2026",
      "request": "Aug 17, 2026",
      "screen": "s9",
      "tags": []
    },
    {
      "id": "l10",
      "key": "87353ca5-c353-4eb7-8670-a3f280eff062",
      "alias": "License #110",
      "host": "h10",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "700 668 995",
      "anypw": "62QYPT5T",
      "install": "Aug 10, 2026",
      "request": "Aug 24, 2026",
      "screen": "s10",
      "tags": []
    },
    {
      "id": "l11",
      "key": "e77e947d-d768-43f9-987d-671edd51e1bf",
      "alias": "License #111",
      "host": "h11",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "249 234 744",
      "anypw": "PMFNFX6T",
      "install": "Aug 17, 2026",
      "request": "Jul 4, 2026",
      "screen": "s11",
      "tags": []
    },
    {
      "id": "l12",
      "key": "385fd129-ddd4-4ac0-bae0-c7eab963500a",
      "alias": "License #112",
      "host": "h12",
      "status": "disabled",
      "type": "Ad",
      "net": "",
      "speed": "18 MB/s",
      "anydesk": "783 989 445",
      "anypw": "EDQJDBNR",
      "install": "Aug 24, 2026",
      "request": "Jul 11, 2026",
      "screen": "s12",
      "tags": []
    },
    {
      "id": "l13",
      "key": "fef8cfe4-29ee-4b33-b403-634db6aa5e81",
      "alias": "License #113",
      "host": "h13",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "483 423 846",
      "anypw": "FJ82N4GX",
      "install": "Jul 4, 2026",
      "request": "Jul 18, 2026",
      "screen": "s13",
      "tags": []
    },
    {
      "id": "l14",
      "key": "e019891d-8617-4bfd-946a-1ace53508115",
      "alias": "License #114",
      "host": "h14",
      "status": "offline",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "396 385 213",
      "anypw": "C85KE3DR",
      "install": "Jul 11, 2026",
      "request": "Jul 25, 2026",
      "screen": "s14",
      "tags": []
    },
    {
      "id": "l15",
      "key": "9355b142-27b9-4582-adcc-768b4b11d5ea",
      "alias": "License #115",
      "host": "h15",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "888 517 309",
      "anypw": "WB5U5UW9",
      "install": "Jul 18, 2026",
      "request": "Jun 5, 2026",
      "screen": "s15",
      "tags": []
    },
    {
      "id": "l16",
      "key": "da795346-6967-40db-be69-750e90a76a4c",
      "alias": "License #116",
      "host": "h16",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "946 944 430",
      "anypw": "W4CXZH3G",
      "install": "Jul 25, 2026",
      "request": "Jun 12, 2026",
      "screen": "s16",
      "tags": []
    },
    {
      "id": "l17",
      "key": "b0d00dbd-944b-4edf-b76d-17a004ac1552",
      "alias": "License #117",
      "host": "h17",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "373 580 434",
      "anypw": "R52FYVR9",
      "install": "Jun 5, 2026",
      "request": "Jun 19, 2026",
      "screen": "s17",
      "tags": []
    },
    {
      "id": "l18",
      "key": "3706c753-ca0b-444d-ad92-ac1c9bb1c770",
      "alias": "License #118",
      "host": "h18",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "710 357 697",
      "anypw": "ZFDAUXHU",
      "install": "Jun 12, 2026",
      "request": "Jun 26, 2026",
      "screen": "s18",
      "tags": []
    },
    {
      "id": "l19",
      "key": "2c940400-c44f-42ca-9f07-d6caf9055885",
      "alias": "License #119",
      "host": "h19",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "298 543 928",
      "anypw": "EJGU6AYX",
      "install": "Jun 19, 2026",
      "request": "May 6, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l20",
      "key": "0f70d599-74e5-45ff-a5dd-d30cd9134011",
      "alias": "License #120",
      "host": "h20",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "920 170 358",
      "anypw": "RVMF5JJE",
      "install": "Jun 26, 2026",
      "request": "May 13, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l21",
      "key": "e6d74be4-2101-4275-82ab-18bde6b12b97",
      "alias": "License #121",
      "host": "h21",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "392 291 869",
      "anypw": "DCDPXPUK",
      "install": "May 6, 2026",
      "request": "May 20, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l22",
      "key": "0a936208-0d33-469e-91b6-d78e5c06445b",
      "alias": "License #122",
      "host": "h22",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "651 398 460",
      "anypw": "C9DH2JJP",
      "install": "May 13, 2026",
      "request": "May 27, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l23",
      "key": "acb95a3f-5b51-4d6e-aecc-ccfe453ba6ad",
      "alias": "License #123",
      "host": "h23",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "839 358 792",
      "anypw": "QB4MU9S9",
      "install": "May 20, 2026",
      "request": "Apr 7, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l24",
      "key": "13ae7b79-f8eb-4fa7-99ea-92d72162864f",
      "alias": "License #124",
      "host": "h24",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "515 304 528",
      "anypw": "5ADHZGSN",
      "install": "May 27, 2026",
      "request": "Apr 14, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l25",
      "key": "82840178-c69a-4f77-92a0-2405538680f1",
      "alias": "License #125",
      "host": "h25",
      "status": "ready",
      "type": "Ad",
      "net": "",
      "speed": "36 MB/s",
      "anydesk": "198 778 685",
      "anypw": "GRBFCSNU",
      "install": "",
      "request": "Apr 21, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l26",
      "key": "a6dd1a7c-12fd-43e5-9cef-b390b0c85452",
      "alias": "License #126",
      "host": "h26",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "376 343 779",
      "anypw": "NYQYU2JY",
      "install": "Apr 14, 2026",
      "request": "Apr 1, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l27",
      "key": "c2585488-b765-4b6d-b1fb-049fb9289993",
      "alias": "License #127",
      "host": "h27",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "861 236 272",
      "anypw": "GRME7ZAN",
      "install": "Apr 21, 2026",
      "request": "Mar 8, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l28",
      "key": "f619eab6-5d02-496e-9a42-2a1f772d2bbc",
      "alias": "License #128",
      "host": "h28",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "449 415 517",
      "anypw": "EC9DMKT7",
      "install": "Apr 1, 2026",
      "request": "Mar 15, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l29",
      "key": "100ff704-b6cc-489d-bc87-91511ac648eb",
      "alias": "License #129",
      "host": "h29",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "629 361 535",
      "anypw": "EZACETD9",
      "install": "Mar 8, 2026",
      "request": "Mar 22, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l30",
      "key": "186f66da-6140-4073-b199-9da0b595e07e",
      "alias": "License #130",
      "host": "h30",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "826 659 456",
      "anypw": "7P88RZC6",
      "install": "Mar 15, 2026",
      "request": "Mar 2, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l31",
      "key": "df3438fa-f705-441e-ba6e-1cf11d7aae6c",
      "alias": "License #131",
      "host": "h31",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "948 414 121",
      "anypw": "MU7H3BY9",
      "install": "Mar 22, 2026",
      "request": "Feb 9, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l32",
      "key": "8bc71463-0974-4989-9a0d-960037a407ad",
      "alias": "License #132",
      "host": "h32",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "848 673 467",
      "anypw": "KPSSS7WD",
      "install": "Mar 2, 2026",
      "request": "Feb 16, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l33",
      "key": "682e0b95-0952-4ef7-902a-b2f17d721398",
      "alias": "License #133",
      "host": "h33",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "811 703 766",
      "anypw": "E3QJ3WAK",
      "install": "Feb 9, 2026",
      "request": "Feb 23, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l34",
      "key": "3b888097-040c-4ce5-b8e1-aa1d9bcb0ee1",
      "alias": "License #134",
      "host": "h34",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "794 810 293",
      "anypw": "MN7QNRGK",
      "install": "Feb 16, 2026",
      "request": "Feb 3, 2026",
      "screen": null,
      "tags": []
    },
    {
      "id": "l35",
      "key": "713b07db-288a-46f8-81aa-98e43a244999",
      "alias": "License #135",
      "host": "h35",
      "status": "disabled",
      "type": "Ad",
      "net": "",
      "speed": "18 MB/s",
      "anydesk": "273 509 477",
      "anypw": "AEWYUF3U",
      "install": "Feb 23, 2026",
      "request": "Jan 10, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l36",
      "key": "eb2d1684-93be-4848-aed1-3633ca3bf583",
      "alias": "License #136",
      "host": "h36",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "516 192 395",
      "anypw": "RMRFAK6U",
      "install": "Feb 3, 2026",
      "request": "Jan 17, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l37",
      "key": "a9639df9-ba16-405b-9427-6e8cfeb7f141",
      "alias": "License #137",
      "host": "h37",
      "status": "offline",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "493 461 259",
      "anypw": "AQS5D3CM",
      "install": "Jan 10, 2025",
      "request": "Jan 24, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l38",
      "key": "b0e8e618-822e-4052-840c-c5fbd07e8912",
      "alias": "License #138",
      "host": "h38",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "672 371 191",
      "anypw": "YYPNP88V",
      "install": "Jan 17, 2025",
      "request": "Jan 4, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l39",
      "key": "88f8cce3-2d04-4a6d-9fd6-14667b799144",
      "alias": "License #139",
      "host": "h39",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "667 188 326",
      "anypw": "HEBUJQHS",
      "install": "Jan 24, 2025",
      "request": "Dec 11, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l40",
      "key": "65beeca4-ecea-4237-b1b9-a510616e3804",
      "alias": "License #140",
      "host": "h40",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "490 933 499",
      "anypw": "7XCFHRHJ",
      "install": "Jan 4, 2025",
      "request": "Dec 18, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l41",
      "key": "a2738ca9-04b5-403e-b7d4-96b2a44bf6c3",
      "alias": "License #141",
      "host": "h41",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "114 382 641",
      "anypw": "2CQANY7T",
      "install": "Dec 11, 2025",
      "request": "Dec 25, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l42",
      "key": "187ce117-7aa0-4102-8b0d-abfa5ceee52c",
      "alias": "License #142",
      "host": "h42",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "365 452 916",
      "anypw": "HTCFXCQA",
      "install": "Dec 18, 2025",
      "request": "Dec 5, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l43",
      "key": "bbe0389a-e697-4ce1-bec8-b41841eb7c8e",
      "alias": "License #143",
      "host": "h43",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "107 733 383",
      "anypw": "RUE6GHNT",
      "install": "Dec 25, 2025",
      "request": "Nov 12, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l44",
      "key": "1606dba2-09e4-44d3-8be6-354951425a11",
      "alias": "License #144",
      "host": "h1",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "384 749 249",
      "anypw": "AMAFCZGK",
      "install": "Dec 5, 2025",
      "request": "Nov 19, 2025",
      "screen": "s1",
      "tags": []
    },
    {
      "id": "l45",
      "key": "97f2fbf9-6efe-4b1e-9c3b-9f87c6faf2e9",
      "alias": "License #145",
      "host": "h2",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "760 460 838",
      "anypw": "T88QYC8S",
      "install": "Nov 12, 2025",
      "request": "Nov 26, 2025",
      "screen": "s2",
      "tags": []
    },
    {
      "id": "l46",
      "key": "4a66cfb6-18b5-4a0d-9320-b3e220953819",
      "alias": "License #146",
      "host": "h3",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "988 985 370",
      "anypw": "9Q69Y288",
      "install": "Nov 19, 2025",
      "request": "Nov 6, 2025",
      "screen": "s3",
      "tags": []
    },
    {
      "id": "l47",
      "key": "8c1679d9-c8d3-4274-9cc4-e5f92709396e",
      "alias": "License #147",
      "host": "h4",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "904 573 791",
      "anypw": "8MW9QDSG",
      "install": "Nov 26, 2025",
      "request": "Oct 13, 2025",
      "screen": "s4",
      "tags": []
    },
    {
      "id": "l48",
      "key": "09ea935b-4e95-44a8-ba8b-b05445794014",
      "alias": "License #148",
      "host": "h5",
      "status": "offline",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "404 584 669",
      "anypw": "923YSRF3",
      "install": "Nov 6, 2025",
      "request": "Oct 20, 2025",
      "screen": "s5",
      "tags": []
    },
    {
      "id": "l49",
      "key": "0efd50d5-2ddb-4912-9a73-8f4135f34be1",
      "alias": "License #149",
      "host": "h6",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "564 588 208",
      "anypw": "Q4KNJV8Q",
      "install": "Oct 13, 2025",
      "request": "Oct 27, 2025",
      "screen": "s6",
      "tags": []
    },
    {
      "id": "l50",
      "key": "cffd9608-d2bb-43e1-b25e-9907606c2082",
      "alias": "License #150",
      "host": "h7",
      "status": "offline",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "630 644 354",
      "anypw": "XDH4DANZ",
      "install": "Oct 20, 2025",
      "request": "Oct 7, 2025",
      "screen": "s7",
      "tags": []
    },
    {
      "id": "l51",
      "key": "59906b69-a772-4044-934c-73b002579c58",
      "alias": "License #151",
      "host": "h8",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "299 817 380",
      "anypw": "GUC9CAK4",
      "install": "Oct 27, 2025",
      "request": "Sep 14, 2025",
      "screen": "s8",
      "tags": []
    },
    {
      "id": "l52",
      "key": "41b80d57-9b8c-4a15-88d3-384fe9213169",
      "alias": "License #152",
      "host": "h9",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "949 647 469",
      "anypw": "E7AA22KC",
      "install": "Oct 7, 2025",
      "request": "Sep 21, 2025",
      "screen": "s9",
      "tags": []
    },
    {
      "id": "l53",
      "key": "a9c95f43-3562-49b3-85e8-937820149ee1",
      "alias": "License #153",
      "host": "h10",
      "status": "disabled",
      "type": "Ad",
      "net": "",
      "speed": "18 MB/s",
      "anydesk": "402 104 668",
      "anypw": "XZ8R4T84",
      "install": "Sep 14, 2025",
      "request": "Sep 1, 2025",
      "screen": "s10",
      "tags": []
    },
    {
      "id": "l54",
      "key": "e2135f0d-52f1-48c8-9cef-dddda5ed60c9",
      "alias": "License #154",
      "host": "h11",
      "status": "online",
      "type": "Ad",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "233 799 627",
      "anypw": "54U99YTB",
      "install": "Sep 21, 2025",
      "request": "Sep 8, 2025",
      "screen": "s11",
      "tags": []
    },
    {
      "id": "l55",
      "key": "e189c8c4-dcbf-464a-a391-9178aaeb7235",
      "alias": "License #155",
      "host": "h12",
      "status": "offline",
      "type": "Ad",
      "net": "WiFi",
      "speed": "36 MB/s",
      "anydesk": "534 174 176",
      "anypw": "3CQEAZMG",
      "install": "Sep 1, 2025",
      "request": "Aug 15, 2025",
      "screen": "s12",
      "tags": []
    },
    {
      "id": "l56",
      "key": "0efbffda-3cec-479c-81c2-fe7e1a188714",
      "alias": "License #156",
      "host": "h13",
      "status": "online",
      "type": "Menu",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "988 868 356",
      "anypw": "H29XKX23",
      "install": "Sep 8, 2025",
      "request": "Aug 22, 2025",
      "screen": "s13",
      "tags": []
    },
    {
      "id": "l57",
      "key": "8d7fa788-2a4f-4f1d-bcad-b15aebadf459",
      "alias": "License #157",
      "host": "h14",
      "status": "online",
      "type": "Menu",
      "net": "WiFi",
      "speed": "18 MB/s",
      "anydesk": "920 735 824",
      "anypw": "G9U5YN35",
      "install": "Aug 15, 2025",
      "request": "Aug 2, 2025",
      "screen": "s14",
      "tags": []
    },
    {
      "id": "l58",
      "key": "bc532888-83c5-45c5-a073-793455870663",
      "alias": "License #158",
      "host": "h15",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "36 MB/s",
      "anydesk": "979 182 450",
      "anypw": "K8S63NH7",
      "install": "Aug 22, 2025",
      "request": "Aug 9, 2025",
      "screen": "s15",
      "tags": []
    },
    {
      "id": "l59",
      "key": "e4a13bb2-39be-4d81-9018-956f292a7c7d",
      "alias": "License #159",
      "host": "h16",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "350 446 792",
      "anypw": "73Y9HVBX",
      "install": "Aug 2, 2025",
      "request": "Jul 16, 2025",
      "screen": "s16",
      "tags": []
    },
    {
      "id": "l60",
      "key": "6cf83692-92e2-459c-82d6-b5a0b7fa95ad",
      "alias": "License #160",
      "host": "h17",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "836 237 170",
      "anypw": "QW3NGGXM",
      "install": "Aug 9, 2025",
      "request": "Jul 23, 2025",
      "screen": "s17",
      "tags": []
    },
    {
      "id": "l61",
      "key": "93397b7b-9357-4b54-97d9-7dae058da75a",
      "alias": "License #161",
      "host": "h18",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "36 MB/s",
      "anydesk": "964 512 370",
      "anypw": "Y67MQSFZ",
      "install": "Jul 16, 2025",
      "request": "Jul 3, 2025",
      "screen": "s18",
      "tags": []
    },
    {
      "id": "l62",
      "key": "9cee3d5d-12ca-4ac6-b378-51e9395dde49",
      "alias": "License #162",
      "host": "h19",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "625 655 576",
      "anypw": "QYJMS58Z",
      "install": "Jul 23, 2025",
      "request": "Jul 10, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l63",
      "key": "581769e0-6303-4413-9958-1b800b2d1861",
      "alias": "License #163",
      "host": "h20",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "929 400 243",
      "anypw": "QV856SX8",
      "install": "Jul 3, 2025",
      "request": "Jun 17, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l64",
      "key": "1ee63d34-b8ab-45fc-97bb-7c6935f202ce",
      "alias": "License #164",
      "host": "h21",
      "status": "disabled",
      "type": "Menu",
      "net": "",
      "speed": "36 MB/s",
      "anydesk": "985 657 690",
      "anypw": "VCBABQAM",
      "install": "Jul 10, 2025",
      "request": "Jun 24, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l65",
      "key": "96fef840-4e1b-4c0e-b60a-c52a2894aaed",
      "alias": "License #165",
      "host": "h22",
      "status": "disabled",
      "type": "Menu",
      "net": "",
      "speed": "18 MB/s",
      "anydesk": "535 359 739",
      "anypw": "QR3K2NGN",
      "install": "Jun 17, 2025",
      "request": "Jun 4, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l66",
      "key": "ada7be25-9a17-4d7f-bab2-e0892c7a04bc",
      "alias": "License #166",
      "host": "h23",
      "status": "disabled",
      "type": "Menu",
      "net": "",
      "speed": "18 MB/s",
      "anydesk": "666 237 526",
      "anypw": "UG53EMEM",
      "install": "Jun 24, 2025",
      "request": "Jun 11, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l67",
      "key": "de44770d-71da-414e-a686-6a9bb5ef5f54",
      "alias": "License #167",
      "host": "h24",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "36 MB/s",
      "anydesk": "416 947 891",
      "anypw": "DV42AYKU",
      "install": "Jun 4, 2025",
      "request": "May 18, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l68",
      "key": "64346fa0-c4c8-4cb7-9da0-d8632771b57a",
      "alias": "License #168",
      "host": "h25",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "458 791 111",
      "anypw": "YVNGHACX",
      "install": "Jun 11, 2025",
      "request": "May 25, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l69",
      "key": "9c5ffe71-bc76-470e-a2c3-db6abe351cb3",
      "alias": "License #169",
      "host": "h26",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "446 687 446",
      "anypw": "4G4ZPCTC",
      "install": "May 18, 2025",
      "request": "May 5, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l70",
      "key": "98e58219-c502-430a-b625-aea5c6e50222",
      "alias": "License #170",
      "host": "h27",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "36 MB/s",
      "anydesk": "393 539 826",
      "anypw": "KTPQZ2WC",
      "install": "May 25, 2025",
      "request": "May 12, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l71",
      "key": "b0f8f575-215d-49fa-bf63-075fae15e457",
      "alias": "License #171",
      "host": "h28",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "915 523 569",
      "anypw": "K3BZAF2B",
      "install": "May 5, 2025",
      "request": "Apr 19, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l72",
      "key": "3c18659c-60fb-4c09-9a10-b4894b0ff42b",
      "alias": "License #172",
      "host": "h29",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "656 853 282",
      "anypw": "HCYY7B5B",
      "install": "May 12, 2025",
      "request": "Apr 26, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l73",
      "key": "8d33ef33-230b-4bce-b214-6842cfa17f91",
      "alias": "License #173",
      "host": "h30",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "36 MB/s",
      "anydesk": "364 299 466",
      "anypw": "5KJAKQPB",
      "install": "Apr 19, 2025",
      "request": "Apr 6, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l74",
      "key": "4c6d53e6-16c8-4149-a448-cff49b6c8196",
      "alias": "License #174",
      "host": "h31",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "486 244 164",
      "anypw": "688MRGMG",
      "install": "Apr 26, 2025",
      "request": "Apr 13, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l75",
      "key": "3a314463-4435-4ca3-9f13-348176669ad2",
      "alias": "License #175",
      "host": "h32",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "376 442 125",
      "anypw": "STYAAG7Y",
      "install": "Apr 6, 2025",
      "request": "Mar 20, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l76",
      "key": "e125dbf3-0afc-41b1-a258-0e69658d3e44",
      "alias": "License #176",
      "host": "h33",
      "status": "offline",
      "type": "Menu",
      "net": "LAN",
      "speed": "36 MB/s",
      "anydesk": "175 871 785",
      "anypw": "HEJGTFJX",
      "install": "Apr 13, 2025",
      "request": "Mar 27, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l77",
      "key": "ea392d85-f5d0-424a-8704-e9b13c509d67",
      "alias": "License #177",
      "host": "h34",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "297 397 576",
      "anypw": "Q62WSV6X",
      "install": "Mar 20, 2025",
      "request": "Mar 7, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l78",
      "key": "108c6409-50d8-4303-a529-87792f8be7b4",
      "alias": "License #178",
      "host": "h35",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "418 317 897",
      "anypw": "5ENXW8WH",
      "install": "Mar 27, 2025",
      "request": "Mar 14, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l79",
      "key": "90b63e94-8280-44ee-abb4-dfcb394e9cf5",
      "alias": "License #179",
      "host": "h36",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "36 MB/s",
      "anydesk": "585 292 277",
      "anypw": "XHASJRPQ",
      "install": "Mar 7, 2025",
      "request": "Feb 21, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l80",
      "key": "e284307a-c085-4629-9aba-540ce379eec2",
      "alias": "License #180",
      "host": "h37",
      "status": "online",
      "type": "Menu",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "994 507 919",
      "anypw": "ZXFCV4CM",
      "install": "Mar 14, 2025",
      "request": "Feb 1, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l81",
      "key": "b7075a3c-ed1e-4f42-881c-0e694371eff1",
      "alias": "License #181",
      "host": "h38",
      "status": "disabled",
      "type": "Menu",
      "net": "",
      "speed": "18 MB/s",
      "anydesk": "628 428 421",
      "anypw": "N9ECSQWH",
      "install": "Feb 21, 2025",
      "request": "Feb 8, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l82",
      "key": "c18aa68f-bfc9-4315-8d7e-0642032700ef",
      "alias": "License #182",
      "host": "h39",
      "status": "online",
      "type": "Closed",
      "net": "LAN",
      "speed": "36 MB/s",
      "anydesk": "977 667 989",
      "anypw": "G9H3TZES",
      "install": "Feb 1, 2025",
      "request": "Feb 15, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l83",
      "key": "151499c0-bb17-4fe4-8330-59306ccbed7b",
      "alias": "License #183",
      "host": "h40",
      "status": "online",
      "type": "Closed",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "804 871 467",
      "anypw": "7XZDS6CS",
      "install": "Feb 8, 2025",
      "request": "Jan 22, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l84",
      "key": "a90e518a-f0c4-42ec-9319-9ca1317bc3ab",
      "alias": "License #184",
      "host": "h41",
      "status": "online",
      "type": "Closed",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "818 135 917",
      "anypw": "D826B3U2",
      "install": "Feb 15, 2025",
      "request": "Jan 2, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l85",
      "key": "f286baa7-b290-4819-8f17-78b02fb615ac",
      "alias": "License #185",
      "host": "h42",
      "status": "online",
      "type": "Closed",
      "net": "LAN",
      "speed": "36 MB/s",
      "anydesk": "758 897 809",
      "anypw": "9CZ3AF5Z",
      "install": "Jan 22, 2025",
      "request": "Jan 9, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l86",
      "key": "0cad8de8-11bf-4b37-8558-a6198a435e0f",
      "alias": "License #186",
      "host": "h43",
      "status": "ready",
      "type": "Closed",
      "net": "",
      "speed": "18 MB/s",
      "anydesk": "379 724 587",
      "anypw": "VVKPWHMA",
      "install": "",
      "request": "Jan 16, 2025",
      "screen": null,
      "tags": []
    },
    {
      "id": "l87",
      "key": "39e8f8e9-f90d-41a7-9937-8943e507dc10",
      "alias": "License #187",
      "host": "h1",
      "status": "online",
      "type": "Closed",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "870 176 389",
      "anypw": "DQTNUAR2",
      "install": "Jan 9, 2025",
      "request": "Dec 23, 2025",
      "screen": "s1",
      "tags": []
    },
    {
      "id": "l88",
      "key": "38670661-bd3d-4a5b-9a34-272ed6f2900b",
      "alias": "License #188",
      "host": "h2",
      "status": "online",
      "type": "Closed",
      "net": "LAN",
      "speed": "36 MB/s",
      "anydesk": "730 103 427",
      "anypw": "QJZHVVCQ",
      "install": "Jan 16, 2025",
      "request": "Dec 3, 2025",
      "screen": "s2",
      "tags": []
    },
    {
      "id": "l89",
      "key": "9b8f7a01-0804-49ee-8072-7b842908768f",
      "alias": "License #189",
      "host": "h3",
      "status": "pending",
      "type": "Closed",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "113 825 547",
      "anypw": "BXZWVURH",
      "install": "",
      "request": "Dec 10, 2025",
      "screen": "s3",
      "tags": []
    },
    {
      "id": "l90",
      "key": "be45ef65-96d3-46bd-93e7-a37ec3772f9b",
      "alias": "License #190",
      "host": "h4",
      "status": "online",
      "type": "Closed",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "689 539 322",
      "anypw": "8JBYS7FG",
      "install": "Dec 3, 2025",
      "request": "Dec 17, 2025",
      "screen": "s4",
      "tags": []
    },
    {
      "id": "l91",
      "key": "4657bb91-afb6-4ec5-b2ea-1bd8dc00392d",
      "alias": "License #191",
      "host": "h5",
      "status": "online",
      "type": "Closed",
      "net": "LAN",
      "speed": "36 MB/s",
      "anydesk": "890 263 321",
      "anypw": "25ASW44W",
      "install": "Dec 10, 2025",
      "request": "Nov 24, 2025",
      "screen": "s5",
      "tags": []
    },
    {
      "id": "l92",
      "key": "d82ad01f-dd78-4504-b173-a8664cddb3d3",
      "alias": "License #192",
      "host": "h6",
      "status": "pending",
      "type": "Closed",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "180 377 164",
      "anypw": "RTKKMWAJ",
      "install": "",
      "request": "Nov 4, 2025",
      "screen": "s6",
      "tags": []
    },
    {
      "id": "l93",
      "key": "6647a24e-ea14-4428-8689-89902b2295c2",
      "alias": "License #193",
      "host": "h7",
      "status": "online",
      "type": "Closed",
      "net": "LAN",
      "speed": "18 MB/s",
      "anydesk": "273 694 161",
      "anypw": "BX842QUF",
      "install": "Nov 24, 2025",
      "request": "Nov 11, 2025",
      "screen": "s7",
      "tags": []
    },
    {
      "id": "l94",
      "key": "55b37942-4c1a-4e19-a31d-1c2637c6f205",
      "alias": "License #194",
      "host": null,
      "status": "unassigned",
      "type": "Ad",
      "net": "",
      "speed": "",
      "anydesk": "",
      "anypw": "",
      "install": "",
      "request": "",
      "screen": null,
      "tags": []
    },
    {
      "id": "l95",
      "key": "217df71a-6157-47c5-bcb3-623a1e3dfbb5",
      "alias": "License #195",
      "host": null,
      "status": "unassigned",
      "type": "Ad",
      "net": "",
      "speed": "",
      "anydesk": "",
      "anypw": "",
      "install": "",
      "request": "",
      "screen": null,
      "tags": []
    },
    {
      "id": "l96",
      "key": "500b8952-3268-497e-affe-fa2c4f44fc29",
      "alias": "License #196",
      "host": null,
      "status": "unassigned",
      "type": "Ad",
      "net": "",
      "speed": "",
      "anydesk": "",
      "anypw": "",
      "install": "",
      "request": "",
      "screen": null,
      "tags": []
    },
    {
      "id": "l97",
      "key": "927b2968-cfcc-483a-8476-919cb51cb937",
      "alias": "License #197",
      "host": null,
      "status": "unassigned",
      "type": "Ad",
      "net": "",
      "speed": "",
      "anydesk": "",
      "anypw": "",
      "install": "",
      "request": "",
      "screen": null,
      "tags": []
    }
  ],
  "advertisers": [
    {
      "id": "a1",
      "name": "Panther Coffee",
      "category": "Cafe",
      "city": "Tuscaloosa",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Oct 1, 2026",
      "createdBy": "NTV360 Support",
      "media": [
        "m1"
      ]
    },
    {
      "id": "a2",
      "name": "Sedaap Noodles",
      "category": "Food",
      "city": "Northport",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Oct 8, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": [
        "m26"
      ]
    },
    {
      "id": "a3",
      "name": "Sunbright Citrus",
      "category": "Food",
      "city": "Birmingham",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Oct 15, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": []
    },
    {
      "id": "a4",
      "name": "Shopee Mart",
      "category": "Retail",
      "city": "Hoover",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Oct 22, 2026",
      "createdBy": "NTV360 Support",
      "media": []
    },
    {
      "id": "a5",
      "name": "Riverbend Realty",
      "category": "Real Estate",
      "city": "Alabaster",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Sep 2, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": []
    },
    {
      "id": "a6",
      "name": "Crimson Auto Group",
      "category": "Automotive",
      "city": "Bessemer",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Sep 9, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": [
        "m6"
      ]
    },
    {
      "id": "a7",
      "name": "Magnolia Insurance",
      "category": "Insurance",
      "city": "Vestavia Hills",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Sep 16, 2026",
      "createdBy": "NTV360 Support",
      "media": [
        "m31"
      ]
    },
    {
      "id": "a8",
      "name": "Tide Credit Union",
      "category": "Finance",
      "city": "Homewood",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Sep 23, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": []
    },
    {
      "id": "a9",
      "name": "Druid City Dental",
      "category": "Health",
      "city": "Pelham",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Aug 3, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": []
    },
    {
      "id": "a10",
      "name": "Northport Honda",
      "category": "Automotive",
      "city": "Calera",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Aug 10, 2026",
      "createdBy": "NTV360 Support",
      "media": []
    },
    {
      "id": "a11",
      "name": "Vulcan Fitness",
      "category": "Fitness",
      "city": "Trussville",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Aug 17, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": [
        "m11"
      ]
    },
    {
      "id": "a12",
      "name": "Southern Smoke Sauce",
      "category": "Food",
      "city": "Cottondale",
      "state": "AL",
      "region": "South",
      "status": "Inactive",
      "created": "Aug 24, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": [
        "m36"
      ]
    },
    {
      "id": "a13",
      "name": "Iron Bowl Tickets",
      "category": "Entertainment",
      "city": "Brookwood",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Jul 4, 2026",
      "createdBy": "NTV360 Support",
      "media": []
    },
    {
      "id": "a14",
      "name": "Lakeview Homes",
      "category": "Real Estate",
      "city": "Tuscaloosa",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Jul 11, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": []
    },
    {
      "id": "a15",
      "name": "Bama Bites",
      "category": "Food",
      "city": "Northport",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Jul 18, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": []
    },
    {
      "id": "a16",
      "name": "Hoover Mattress",
      "category": "Retail",
      "city": "Birmingham",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Jul 25, 2026",
      "createdBy": "NTV360 Support",
      "media": [
        "m16"
      ]
    },
    {
      "id": "a17",
      "name": "Alabaster Law Group",
      "category": "Legal",
      "city": "Hoover",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Jun 5, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": []
    },
    {
      "id": "a18",
      "name": "Calera Chiropractic",
      "category": "Health",
      "city": "Alabaster",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Jun 12, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": []
    },
    {
      "id": "a19",
      "name": "Trussville Toyota",
      "category": "Automotive",
      "city": "Bessemer",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Jun 19, 2026",
      "createdBy": "NTV360 Support",
      "media": []
    },
    {
      "id": "a20",
      "name": "Cahaba Brewing",
      "category": "Beverage",
      "city": "Vestavia Hills",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "Jun 26, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": []
    },
    {
      "id": "a21",
      "name": "Homewood Florist",
      "category": "Retail",
      "city": "Homewood",
      "state": "AL",
      "region": "South",
      "status": "Inactive",
      "created": "May 6, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": [
        "m21"
      ]
    },
    {
      "id": "a22",
      "name": "Pelham Pools",
      "category": "Home",
      "city": "Pelham",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "May 13, 2026",
      "createdBy": "NTV360 Support",
      "media": []
    },
    {
      "id": "a23",
      "name": "Vestavia Vision",
      "category": "Health",
      "city": "Calera",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "May 20, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": []
    },
    {
      "id": "a24",
      "name": "Bessemer Bank",
      "category": "Finance",
      "city": "Trussville",
      "state": "AL",
      "region": "South",
      "status": "Active",
      "created": "May 27, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "media": []
    }
  ],
  "media": [
    {
      "id": "m1",
      "title": "Comet Meadow.jpg",
      "kind": "image",
      "image": "images/comet-meadow.jpg",
      "source": "Advertisers",
      "used": true,
      "adv": "a1",
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Oct 1, 2026",
      "size": "2.0 MB",
      "duration": "15 sec"
    },
    {
      "id": "m2",
      "title": "Dancing Aurora.mp4",
      "kind": "video",
      "image": "images/dancing-aurora.jpg",
      "source": "Hosts",
      "used": true,
      "adv": null,
      "host": "h2",
      "folder": "Promo Videos",
      "uploaded": "Oct 8, 2026",
      "size": "3.1 MB",
      "duration": "45 sec"
    },
    {
      "id": "m3",
      "title": "Galactic Forest Gathering widget",
      "kind": "widget",
      "image": "images/galactic-forest-gathering.jpg",
      "source": "Others",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Oct 15, 2026",
      "size": "4.2 MB",
      "duration": "15 sec"
    },
    {
      "id": "m4",
      "title": "Astral Grove Library.jpg",
      "kind": "image",
      "image": "images/astral-grove-library.jpg",
      "source": "Widgets",
      "used": false,
      "adv": null,
      "host": null,
      "folder": "Brand Logos",
      "uploaded": "Oct 22, 2026",
      "size": "5.3 MB",
      "duration": "15 sec"
    },
    {
      "id": "m5",
      "title": "Forest Beneath the Nebula.jpg",
      "kind": "image",
      "image": "images/forest-beneath-the-nebula.jpg",
      "source": "Channels",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Menus",
      "uploaded": "Sep 2, 2026",
      "size": "6.4 MB",
      "duration": "15 sec"
    },
    {
      "id": "m6",
      "title": "Star Garden Observatory.jpg",
      "kind": "image",
      "image": "images/star-garden-observatory.jpg",
      "source": "Advertisers",
      "used": true,
      "adv": "a6",
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Sep 9, 2026",
      "size": "7.5 MB",
      "duration": "15 sec"
    },
    {
      "id": "m7",
      "title": "Starlit River.mp4",
      "kind": "video",
      "image": "images/starlit-river.jpg",
      "source": "Hosts",
      "used": true,
      "adv": null,
      "host": "h7",
      "folder": "Promo Videos",
      "uploaded": "Sep 16, 2026",
      "size": "8.6 MB",
      "duration": "60 sec"
    },
    {
      "id": "m8",
      "title": "Planet Grove.jpg",
      "kind": "image",
      "image": "images/planet-grove.jpg",
      "source": "Others",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Sep 23, 2026",
      "size": "9.7 MB",
      "duration": "15 sec"
    },
    {
      "id": "m9",
      "title": "Explorer with Map.jpg",
      "kind": "image",
      "image": "images/explorer-with-map.jpg",
      "source": "Widgets",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Brand Logos",
      "uploaded": "Aug 3, 2026",
      "size": "10.8 MB",
      "duration": "15 sec"
    },
    {
      "id": "m10",
      "title": "Hadal Amphipod.jpg",
      "kind": "image",
      "image": "images/hadal-amphipod.jpg",
      "source": "Channels",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Menus",
      "uploaded": "Aug 10, 2026",
      "size": "2.9 MB",
      "duration": "15 sec"
    },
    {
      "id": "m11",
      "title": "The Moonlight Garden.mp4",
      "kind": "video",
      "image": "images/the-moonlight-garden.jpg",
      "source": "Advertisers",
      "used": false,
      "adv": "a11",
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Aug 17, 2026",
      "size": "3.0 MB",
      "duration": "60 sec"
    },
    {
      "id": "m12",
      "title": "Celestial Tree of Life.jpg",
      "kind": "image",
      "image": "images/celestial-tree-of-life.jpg",
      "source": "Hosts",
      "used": true,
      "adv": null,
      "host": "h12",
      "folder": "Promo Videos",
      "uploaded": "Aug 24, 2026",
      "size": "4.1 MB",
      "duration": "15 sec"
    },
    {
      "id": "m13",
      "title": "Vast Empty Mountain.mp4",
      "kind": "video",
      "image": "images/vast-empty-mountain.jpg",
      "source": "Others",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Jul 4, 2026",
      "size": "5.2 MB",
      "duration": "30 sec"
    },
    {
      "id": "m14",
      "title": "Mirrors of the Wetlands.jpg",
      "kind": "image",
      "image": "images/mirrors-of-the-wetlands.jpg",
      "source": "Widgets",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Brand Logos",
      "uploaded": "Jul 11, 2026",
      "size": "6.3 MB",
      "duration": "15 sec"
    },
    {
      "id": "m15",
      "title": "Galactic Forest Gathering.jpg",
      "kind": "image",
      "image": "images/galactic-forest-gathering.jpg",
      "source": "Channels",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Menus",
      "uploaded": "Jul 18, 2026",
      "size": "7.4 MB",
      "duration": "15 sec"
    },
    {
      "id": "m16",
      "title": "Blooming Symphony.mp4",
      "kind": "video",
      "image": "images/blooming-symphony.jpg",
      "source": "Advertisers",
      "used": true,
      "adv": "a16",
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Jul 25, 2026",
      "size": "8.5 MB",
      "duration": "75 sec"
    },
    {
      "id": "m17",
      "title": "The Moonlight Garden.jpg",
      "kind": "image",
      "image": "images/the-moonlight-garden.jpg",
      "source": "Hosts",
      "used": true,
      "adv": null,
      "host": "h17",
      "folder": "Promo Videos",
      "uploaded": "Jun 5, 2026",
      "size": "9.6 MB",
      "duration": "15 sec"
    },
    {
      "id": "m18",
      "title": "Hiker in Rock Cave.mp4",
      "kind": "video",
      "image": "images/hiker-in-rock-cave.jpg",
      "source": "Others",
      "used": false,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Jun 12, 2026",
      "size": "10.7 MB",
      "duration": "45 sec"
    },
    {
      "id": "m19",
      "title": "Mirrors of the Wetlands widget",
      "kind": "widget",
      "image": "images/mirrors-of-the-wetlands.jpg",
      "source": "Widgets",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Brand Logos",
      "uploaded": "Jun 19, 2026",
      "size": "2.8 MB",
      "duration": "15 sec"
    },
    {
      "id": "m20",
      "title": "Starlit River.jpg",
      "kind": "image",
      "image": "images/starlit-river.jpg",
      "source": "Channels",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Menus",
      "uploaded": "Jun 26, 2026",
      "size": "3.9 MB",
      "duration": "15 sec"
    },
    {
      "id": "m21",
      "title": "Comet Meadow 2.jpg",
      "kind": "image",
      "image": "images/comet-meadow.jpg",
      "source": "Advertisers",
      "used": true,
      "adv": "a21",
      "host": null,
      "folder": "Food Assets",
      "uploaded": "May 6, 2026",
      "size": "4.0 MB",
      "duration": "15 sec"
    },
    {
      "id": "m22",
      "title": "Astral Grove Library 2.jpg",
      "kind": "image",
      "image": "images/astral-grove-library.jpg",
      "source": "Hosts",
      "used": true,
      "adv": null,
      "host": "h22",
      "folder": "Promo Videos",
      "uploaded": "May 13, 2026",
      "size": "5.1 MB",
      "duration": "15 sec"
    },
    {
      "id": "m23",
      "title": "Dancing Aurora 2.mp4",
      "kind": "video",
      "image": "images/dancing-aurora.jpg",
      "source": "Others",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "May 20, 2026",
      "size": "6.2 MB",
      "duration": "60 sec"
    },
    {
      "id": "m24",
      "title": "Forest Beneath the Nebula 2.jpg",
      "kind": "image",
      "image": "images/forest-beneath-the-nebula.jpg",
      "source": "Widgets",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Brand Logos",
      "uploaded": "May 27, 2026",
      "size": "7.3 MB",
      "duration": "15 sec"
    },
    {
      "id": "m25",
      "title": "Star Garden Observatory 2.jpg",
      "kind": "image",
      "image": "images/star-garden-observatory.jpg",
      "source": "Channels",
      "used": false,
      "adv": null,
      "host": null,
      "folder": "Menus",
      "uploaded": "Apr 7, 2026",
      "size": "8.4 MB",
      "duration": "15 sec"
    },
    {
      "id": "m26",
      "title": "Planet Grove 2.jpg",
      "kind": "image",
      "image": "images/planet-grove.jpg",
      "source": "Advertisers",
      "used": true,
      "adv": "a2",
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Apr 14, 2026",
      "size": "9.5 MB",
      "duration": "15 sec"
    },
    {
      "id": "m27",
      "title": "Starlit River 2.mp4",
      "kind": "video",
      "image": "images/starlit-river.jpg",
      "source": "Hosts",
      "used": true,
      "adv": null,
      "host": "h27",
      "folder": "Promo Videos",
      "uploaded": "Apr 21, 2026",
      "size": "10.6 MB",
      "duration": "60 sec"
    },
    {
      "id": "m28",
      "title": "Explorer with Map 2.jpg",
      "kind": "image",
      "image": "images/explorer-with-map.jpg",
      "source": "Others",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Apr 1, 2026",
      "size": "2.7 MB",
      "duration": "15 sec"
    },
    {
      "id": "m29",
      "title": "The Moonlight Garden 2.mp4",
      "kind": "video",
      "image": "images/the-moonlight-garden.jpg",
      "source": "Widgets",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Brand Logos",
      "uploaded": "Mar 8, 2026",
      "size": "3.8 MB",
      "duration": "30 sec"
    },
    {
      "id": "m30",
      "title": "Hadal Amphipod 2.jpg",
      "kind": "image",
      "image": "images/hadal-amphipod.jpg",
      "source": "Channels",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Menus",
      "uploaded": "Mar 15, 2026",
      "size": "4.9 MB",
      "duration": "15 sec"
    },
    {
      "id": "m31",
      "title": "Celestial Tree of Life 2.jpg",
      "kind": "image",
      "image": "images/celestial-tree-of-life.jpg",
      "source": "Advertisers",
      "used": true,
      "adv": "a7",
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Mar 22, 2026",
      "size": "5.0 MB",
      "duration": "15 sec"
    },
    {
      "id": "m32",
      "title": "Vast Empty Mountain 2.mp4",
      "kind": "video",
      "image": "images/vast-empty-mountain.jpg",
      "source": "Hosts",
      "used": false,
      "adv": null,
      "host": "h32",
      "folder": "Promo Videos",
      "uploaded": "Mar 2, 2026",
      "size": "6.1 MB",
      "duration": "75 sec"
    },
    {
      "id": "m33",
      "title": "Mirrors of the Wetlands 2.jpg",
      "kind": "image",
      "image": "images/mirrors-of-the-wetlands.jpg",
      "source": "Others",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Feb 9, 2026",
      "size": "7.2 MB",
      "duration": "15 sec"
    },
    {
      "id": "m34",
      "title": "Blooming Symphony 2.mp4",
      "kind": "video",
      "image": "images/blooming-symphony.jpg",
      "source": "Widgets",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Brand Logos",
      "uploaded": "Feb 16, 2026",
      "size": "8.3 MB",
      "duration": "45 sec"
    },
    {
      "id": "m35",
      "title": "Celestial Tree of Life widget",
      "kind": "widget",
      "image": "images/celestial-tree-of-life.jpg",
      "source": "Channels",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Menus",
      "uploaded": "Feb 23, 2026",
      "size": "9.4 MB",
      "duration": "15 sec"
    },
    {
      "id": "m36",
      "title": "Galactic Forest Gathering 2.jpg",
      "kind": "image",
      "image": "images/galactic-forest-gathering.jpg",
      "source": "Advertisers",
      "used": true,
      "adv": "a12",
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Feb 3, 2026",
      "size": "10.5 MB",
      "duration": "15 sec"
    },
    {
      "id": "m37",
      "title": "The Moonlight Garden 2.jpg",
      "kind": "image",
      "image": "images/the-moonlight-garden.jpg",
      "source": "Hosts",
      "used": true,
      "adv": null,
      "host": "h37",
      "folder": "Promo Videos",
      "uploaded": "Jan 10, 2025",
      "size": "2.6 MB",
      "duration": "15 sec"
    },
    {
      "id": "m38",
      "title": "Starlit River 2.jpg",
      "kind": "image",
      "image": "images/starlit-river.jpg",
      "source": "Others",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Jan 17, 2025",
      "size": "3.7 MB",
      "duration": "15 sec"
    },
    {
      "id": "m39",
      "title": "Hiker in Rock Cave 2.mp4",
      "kind": "video",
      "image": "images/hiker-in-rock-cave.jpg",
      "source": "Widgets",
      "used": false,
      "adv": null,
      "host": null,
      "folder": "Brand Logos",
      "uploaded": "Jan 24, 2025",
      "size": "4.8 MB",
      "duration": "60 sec"
    },
    {
      "id": "m40",
      "title": "Comet Meadow 3.jpg",
      "kind": "image",
      "image": "images/comet-meadow.jpg",
      "source": "Channels",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Menus",
      "uploaded": "Jan 4, 2025",
      "size": "5.9 MB",
      "duration": "15 sec"
    },
    {
      "id": "m41",
      "title": "Beyond the Blue",
      "kind": "video",
      "image": "images/sample/beyond-the-blue.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Promo Videos",
      "uploaded": "Oct 28, 2026",
      "size": "3.4 MB",
      "duration": "150 sec"
    },
    {
      "id": "m42",
      "title": "Telescope.jpg",
      "kind": "image",
      "image": "images/sample/telescope.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Oct 28, 2026",
      "size": "1.2 MB",
      "duration": "20 sec"
    },
    {
      "id": "m43",
      "title": "StarLens.jpg",
      "kind": "image",
      "image": "images/sample/starlens.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Oct 28, 2026",
      "size": "1.2 MB",
      "duration": "20 sec"
    },
    {
      "id": "m44",
      "title": "Celestial Drift.mp4",
      "kind": "video",
      "image": "images/sample/galactic-forest-gathering.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Promo Videos",
      "uploaded": "Oct 28, 2026",
      "size": "3.4 MB",
      "duration": "280 sec"
    },
    {
      "id": "m45",
      "title": "OrbitWear.jpg",
      "kind": "image",
      "image": "images/sample/orbitwear.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Oct 28, 2026",
      "size": "1.2 MB",
      "duration": "20 sec"
    },
    {
      "id": "m46",
      "title": "Savannah Sovereigns.mp4",
      "kind": "video",
      "image": "images/sample/predators-patience.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Promo Videos",
      "uploaded": "Oct 28, 2026",
      "size": "3.4 MB",
      "duration": "280 sec"
    },
    {
      "id": "m47",
      "title": "Dancing Aurora.mp4",
      "kind": "video",
      "image": "images/sample/starlit-river.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Promo Videos",
      "uploaded": "Oct 28, 2026",
      "size": "3.4 MB",
      "duration": "280 sec"
    },
    {
      "id": "m48",
      "title": "Tides of Giants.mp4",
      "kind": "video",
      "image": "images/sample/comet-meadow.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Promo Videos",
      "uploaded": "Oct 28, 2026",
      "size": "3.4 MB",
      "duration": "280 sec"
    },
    {
      "id": "m49",
      "title": "Jungle Colors.jpeg",
      "kind": "image",
      "image": "images/sample/jungle-colors.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Oct 28, 2026",
      "size": "1.2 MB",
      "duration": "20 sec"
    },
    {
      "id": "m50",
      "title": "The Moonlight Garden.mp4",
      "kind": "video",
      "image": "images/sample/moonlight-garden.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Promo Videos",
      "uploaded": "Oct 28, 2026",
      "size": "3.4 MB",
      "duration": "280 sec"
    },
    {
      "id": "m51",
      "title": "Star Garden Observatory.jpg",
      "kind": "image",
      "image": "images/sample/star-garden-observatory.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Oct 28, 2026",
      "size": "1.2 MB",
      "duration": "20 sec"
    },
    {
      "id": "m52",
      "title": "The Cosmic Pond.jpg",
      "kind": "image",
      "image": "images/sample/cosmic-pond.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Oct 28, 2026",
      "size": "1.2 MB",
      "duration": "20 sec"
    },
    {
      "id": "m53",
      "title": "Vast_empty_mountain_landscape_202606011438.mp4",
      "kind": "video",
      "image": "images/sample/forest-beneath-the-nebula.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Promo Videos",
      "uploaded": "Oct 28, 2026",
      "size": "3.4 MB",
      "duration": "280 sec"
    },
    {
      "id": "m54",
      "title": "Generated_Image_June_01_2026_10_42AM.jpeg",
      "kind": "image",
      "image": "images/sample/generated-image.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Seasonal",
      "uploaded": "Oct 28, 2026",
      "size": "1.2 MB",
      "duration": "20 sec"
    },
    {
      "id": "m55",
      "title": "Kawaii Café",
      "kind": "video",
      "image": "images/sample/kawaii-cafe.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Oct 28, 2026",
      "size": "3.4 MB",
      "duration": "150 sec"
    },
    {
      "id": "m56",
      "title": "Modern Minimalist Kitchenware.mp4",
      "kind": "video",
      "image": "images/sample/eco-friendly-kitchenware.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Oct 28, 2026",
      "size": "3.4 MB",
      "duration": "280 sec"
    },
    {
      "id": "m57",
      "title": "Rustic Farmhouse Collection.mp4",
      "kind": "video",
      "image": "images/sample/victorian-plates.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Oct 28, 2026",
      "size": "3.4 MB",
      "duration": "280 sec"
    },
    {
      "id": "m58",
      "title": "Vintage Tea Set.jpg",
      "kind": "image",
      "image": "images/sample/vintage-tea-set.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Oct 28, 2026",
      "size": "1.2 MB",
      "duration": "20 sec"
    },
    {
      "id": "m59",
      "title": "FlavorFrame",
      "kind": "video",
      "image": "images/sample/flavorframe.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Oct 28, 2026",
      "size": "3.4 MB",
      "duration": "150 sec"
    },
    {
      "id": "m60",
      "title": "Eco-Friendly Kitchenware.jpg",
      "kind": "image",
      "image": "images/sample/eco-friendly-kitchenware.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Oct 28, 2026",
      "size": "1.2 MB",
      "duration": "20 sec"
    },
    {
      "id": "m61",
      "title": "Glass & Steel Elegance.mp4",
      "kind": "video",
      "image": "images/sample/fancy-glass.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Oct 28, 2026",
      "size": "3.4 MB",
      "duration": "280 sec"
    },
    {
      "id": "m62",
      "title": "Victorian Plates.jpg",
      "kind": "image",
      "image": "images/sample/victorian-plates.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Oct 28, 2026",
      "size": "1.2 MB",
      "duration": "20 sec"
    },
    {
      "id": "m63",
      "title": "Fancy Glass.jpg",
      "kind": "image",
      "image": "images/sample/fancy-glass.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Oct 28, 2026",
      "size": "1.2 MB",
      "duration": "20 sec"
    },
    {
      "id": "m64",
      "title": "Modern Knives.jpg",
      "kind": "image",
      "image": "images/sample/modern-knives.jpg",
      "source": "Dealer",
      "used": true,
      "adv": null,
      "host": null,
      "folder": "Food Assets",
      "uploaded": "Oct 28, 2026",
      "size": "1.2 MB",
      "duration": "20 sec"
    }
  ],
  "channels": [
    {
      "id": "c1",
      "name": "Aqua Pulse",
      "image": "images/ch-aqua-pulse.jpg",
      "genre": "Documentary",
      "genres": ["Documentary", "Nature", "Animals"],
      "mins": 20,
      "contents": 19,
      "mine": false
    },
    {
      "id": "c2",
      "name": "Beyond the Blue",
      "image": "images/ch-beyond-the-blue.jpg",
      "genre": "Documentary",
      "genres": ["Documentary", "Nature", "Education", "Animals"],
      "mins": 15,
      "contents": 7,
      "mine": true
    },
    {
      "id": "c3",
      "name": "BioVerse",
      "image": "images/ch-bioverse.jpg",
      "genre": "Education",
      "genres": ["Education", "Documentary"],
      "mins": 34,
      "contents": 13,
      "mine": false
    },
    {
      "id": "c4",
      "name": "DreamLoom",
      "image": "images/ch-dreamloom.jpg",
      "genre": "Education",
      "genres": ["Education", "Entertainment", "Lifestyle"],
      "mins": 30,
      "contents": 6,
      "mine": false
    },
    {
      "id": "c5",
      "name": "Elemental Earth",
      "image": "images/ch-elemental-earth.jpg",
      "genre": "Nature",
      "genres": ["Nature", "Documentary", "Education", "Animals"],
      "mins": 20,
      "contents": 31,
      "mine": true
    },
    {
      "id": "c6",
      "name": "Fit Vibe",
      "image": "images/ch-fit-vibe.jpg",
      "genre": "Lifestyle",
      "genres": ["Lifestyle"],
      "mins": 5,
      "contents": 4,
      "mine": true
    },
    {
      "id": "c7",
      "name": "FlavorFrame",
      "image": "images/ch-flavorframe.jpg",
      "genre": "Lifestyle",
      "genres": ["Lifestyle", "Entertainment"],
      "mins": 25,
      "contents": 12,
      "mine": true
    },
    {
      "id": "c8",
      "name": "Fun Central",
      "image": "images/ch-fun-central.jpg",
      "genre": "Education",
      "genres": ["Education", "Entertainment", "Animals"],
      "mins": 20,
      "contents": 19,
      "mine": false
    },
    {
      "id": "c9",
      "name": "Golden Horizon",
      "image": "images/ch-golden-horizon.jpg",
      "genre": "Entertainment",
      "genres": ["Entertainment", "Lifestyle", "Documentary"],
      "mins": 15,
      "contents": 7,
      "mine": false
    },
    {
      "id": "c10",
      "name": "The Hidden Cove",
      "image": "images/ch-the-hidden-cove.jpg",
      "genre": "Nature",
      "genres": ["Nature", "Animals", "Documentary"],
      "mins": 34,
      "contents": 13,
      "mine": true
    },
    {
      "id": "c11",
      "name": "High Thread",
      "image": "images/ch-high-thread.jpg",
      "genre": "Fashion",
      "genres": ["Fashion", "Lifestyle"],
      "mins": 30,
      "contents": 6,
      "mine": false
    },
    {
      "id": "c12",
      "name": "Kingdom Unleashed",
      "image": "images/ch-kingdom-unleashed.jpg",
      "genre": "Animals",
      "genres": ["Animals", "Nature", "Documentary", "Education"],
      "mins": 20,
      "contents": 31,
      "mine": false
    },
    {
      "id": "c13",
      "name": "Mind Hub",
      "image": "images/ch-mind-hub.jpg",
      "genre": "Education",
      "genres": ["Education", "Lifestyle"],
      "mins": 5,
      "contents": 4,
      "mine": true
    },
    {
      "id": "c14",
      "name": "MindSpree",
      "image": "images/ch-mindspree.jpg",
      "genre": "Education",
      "genres": ["Education"],
      "mins": 25,
      "contents": 12,
      "mine": false
    },
    {
      "id": "c15",
      "name": "NextTGen Car",
      "image": "images/ch-nextgen-car.jpg",
      "genre": "Technology",
      "genres": ["Technology", "Entertainment", "Lifestyle"],
      "mins": 20,
      "contents": 19,
      "mine": false
    },
    {
      "id": "c16",
      "name": "Play Core",
      "image": "images/ch-play-core.jpg",
      "genre": "Entertainment",
      "genres": ["Entertainment", "Technology"],
      "mins": 15,
      "contents": 7,
      "mine": false
    },
    {
      "id": "c17",
      "name": "RevLine",
      "image": "images/ch-revline.jpg",
      "genre": "Technology",
      "genres": ["Technology", "Entertainment"],
      "mins": 34,
      "contents": 13,
      "mine": false
    },
    {
      "id": "c18",
      "name": "ShredZone",
      "image": "images/ch-shredzone.jpg",
      "genre": "Entertainment",
      "genres": ["Entertainment", "Lifestyle", "Technology", "Fashion"],
      "mins": 30,
      "contents": 6,
      "mine": false
    },
    {
      "id": "c19",
      "name": "SketchQuest",
      "image": "images/ch-sketchquest.jpg",
      "genre": "Entertainment",
      "genres": ["Entertainment", "Education"],
      "mins": 20,
      "contents": 31,
      "mine": false
    },
    {
      "id": "c20",
      "name": "Strand & Shine",
      "image": "images/ch-strand-and-shine.jpg",
      "genre": "Lifestyle",
      "genres": ["Lifestyle", "Fashion"],
      "mins": 5,
      "contents": 4,
      "mine": false
    },
    {
      "id": "c21",
      "name": "Swamp Echoes",
      "image": "images/ch-swamp-echoes.jpg",
      "genre": "Animals",
      "genres": ["Animals", "Nature", "Documentary"],
      "mins": 25,
      "contents": 12,
      "mine": false
    },
    {
      "id": "c22",
      "name": "The Vibe Lane",
      "image": "images/ch-the-vibe-lane.jpg",
      "genre": "Entertainment",
      "genres": ["Entertainment", "Lifestyle", "Fashion"],
      "mins": 20,
      "contents": 19,
      "mine": false
    },
    {
      "id": "c23",
      "name": "World Beat",
      "image": "images/ch-world-beat.jpg",
      "genre": "Lifestyle",
      "genres": ["Lifestyle", "Entertainment"],
      "mins": 15,
      "contents": 7,
      "mine": false
    }
  ],
  "playlists": [
    {
      "id": "p1",
      "name": "The Sedaap Hero Promo",
      "desc": "Promotional loop for The hosts",
      "published": "Oct 1, 2026",
      "items": [
        "m41",
        "m41",
        "m46",
        "m47",
        "m48",
        "m49",
        "m50",
        "m51",
        "m52",
        "m53",
        "m54",
        "m55",
        "m50",
        "m59"
      ],
      "block": true,
      "blocks": {
        "m41": ["m42", "m43", "m44"],
        "m55": ["m56", "m57", "m58"],
        "m59": ["m60", "m61", "m62", "m63", "m64"]
      },
      "blockByIndex": {
        "1": ["m42", "m43", "m45"]
      },
      "schedules": {
        "m46": ["2026-10-01", "2026-10-31"],
        "m48": ["2026-11-01", "2026-12-31"],
        "m49": ["2026-11-01", "2026-12-31"],
        "m53": ["2026-11-20", "2026-12-31"]
      },
      "screens": [
        "s1",
        "s8",
        "s11",
        "s13"
      ]
    },
    {
      "id": "p2",
      "name": "Shopee Mart Deals",
      "desc": "Promotional loop for Shopee hosts",
      "published": "Oct 8, 2026",
      "items": [
        "m4",
        "m5",
        "m6",
        "m7",
        "m8"
      ],
      "block": false,
      "screens": [
        "s2",
        "s9",
        "s12",
        "s14"
      ]
    },
    {
      "id": "p3",
      "name": "Lounge Night Loop",
      "desc": "Promotional loop for Lounge hosts",
      "published": "Oct 15, 2026",
      "items": [
        "m7",
        "m8",
        "m9",
        "m10",
        "m11",
        "m12"
      ],
      "block": true,
      "screens": [
        "s1",
        "s3",
        "s10",
        "s13",
        "s15"
      ]
    },
    {
      "id": "p4",
      "name": "Kitchen Favorites",
      "desc": "Promotional loop for Kitchen hosts",
      "published": "Oct 22, 2026",
      "items": [
        "m10",
        "m11",
        "m12",
        "m13",
        "m14",
        "m15",
        "m16"
      ],
      "block": false,
      "screens": [
        "s2",
        "s4",
        "s11",
        "s14",
        "s16"
      ]
    },
    {
      "id": "p5",
      "name": "Wood Texture Background",
      "desc": "Promotional loop for Wood hosts",
      "published": "Sep 2, 2026",
      "items": [
        "m13",
        "m14",
        "m15",
        "m16",
        "m17",
        "m18",
        "m19",
        "m20"
      ],
      "block": false,
      "screens": [
        "s1",
        "s2",
        "s3",
        "s4",
        "s5",
        "s6",
        "s7",
        "s8",
        "s9",
        "s10",
        "s11",
        "s12",
        "s13",
        "s14",
        "s15",
        "s16",
        "s17",
        "s18"
      ]
    },
    {
      "id": "p6",
      "name": "Sunbright Oranges Promo",
      "desc": "Promotional loop for Sunbright hosts",
      "published": "Sep 9, 2026",
      "items": [
        "m16",
        "m17",
        "m18",
        "m19"
      ],
      "block": false,
      "screens": [
        "s1",
        "s4",
        "s6",
        "s13",
        "s16",
        "s18"
      ]
    },
    {
      "id": "p7",
      "name": "Morning Coffee Rotation",
      "desc": "Promotional loop for Morning hosts",
      "published": "Sep 16, 2026",
      "items": [
        "m19",
        "m20",
        "m21",
        "m22",
        "m23"
      ],
      "block": false,
      "screens": [
        "s2",
        "s5",
        "s7",
        "s14",
        "s17"
      ]
    },
    {
      "id": "p8",
      "name": "Game Day Specials",
      "desc": "Promotional loop for Game hosts",
      "published": "Sep 23, 2026",
      "items": [
        "m22",
        "m23",
        "m24",
        "m25",
        "m26",
        "m27"
      ],
      "block": false,
      "screens": [
        "s3",
        "s6",
        "s8",
        "s15",
        "s18"
      ]
    },
    {
      "id": "p9",
      "name": "Weekend Brunch",
      "desc": "Promotional loop for Weekend hosts",
      "published": "Aug 3, 2026",
      "items": [
        "m25",
        "m26",
        "m27",
        "m28",
        "m29",
        "m30",
        "m31"
      ],
      "block": false,
      "screens": [
        "s4",
        "s7",
        "s9",
        "s16"
      ]
    },
    {
      "id": "p10",
      "name": "Holiday Promo 2026",
      "desc": "Promotional loop for Holiday hosts",
      "published": "Aug 10, 2026",
      "items": [
        "m28",
        "m29",
        "m30",
        "m31",
        "m32",
        "m33",
        "m34",
        "m35"
      ],
      "block": false,
      "screens": [
        "s5",
        "s8",
        "s10",
        "s17"
      ]
    },
    {
      "id": "p11",
      "name": "Gym Motivation Loop",
      "desc": "Promotional loop for Gym hosts",
      "published": "Aug 17, 2026",
      "items": [
        "m31",
        "m32",
        "m33",
        "m34"
      ],
      "block": false,
      "screens": [
        "s6",
        "s9",
        "s11",
        "s18"
      ]
    },
    {
      "id": "p12",
      "name": "Pharmacy Health Tips",
      "desc": "Promotional loop for Pharmacy hosts",
      "published": "Aug 24, 2026",
      "items": [
        "m34",
        "m35",
        "m36",
        "m37",
        "m38"
      ],
      "block": false,
      "screens": [
        "s7",
        "s10",
        "s12"
      ]
    }
  ],
  "screens": [
    {
      "id": "s1",
      "name": "Food Industry Screen 2403",
      "host": "h1",
      "type": "Ad",
      "template": "Standard Template V2",
      "created": "Oct 1, 2026",
      "createdBy": "NTV360 Support",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "The Sedaap Hero Promo",
        "Vertical": "Lounge Night Loop",
        "Horizontal": "Sunbright Oranges Promo",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l1",
        "l44",
        "l87"
      ]
    },
    {
      "id": "s2",
      "name": "Plaza Lobby Screen",
      "host": "h2",
      "type": "Ad",
      "template": "Standard Template V2",
      "created": "Oct 8, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Shopee Mart Deals",
        "Vertical": "Kitchen Favorites",
        "Horizontal": "Morning Coffee Rotation",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l2",
        "l45",
        "l88"
      ]
    },
    {
      "id": "s3",
      "name": "Sunrise Diner Menu Board",
      "host": "h3",
      "type": "Menu",
      "template": "Fullscreen",
      "created": "Oct 15, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Lounge Night Loop",
        "Vertical": "Wood Texture Background",
        "Horizontal": "Game Day Specials",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l3",
        "l46",
        "l89"
      ]
    },
    {
      "id": "s4",
      "name": "Pharmacy Counter Screen",
      "host": "h4",
      "type": "Ad",
      "template": "2-1 Zone",
      "created": "Oct 22, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Kitchen Favorites",
        "Vertical": "Sunbright Oranges Promo",
        "Horizontal": "Weekend Brunch",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l4",
        "l47",
        "l90"
      ]
    },
    {
      "id": "s5",
      "name": "Harbor Hotel Lobby",
      "host": "h5",
      "type": "Announcement",
      "template": "1 to 1 Zone",
      "created": "Sep 2, 2026",
      "createdBy": "NTV360 Support",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Wood Texture Background",
        "Vertical": "Morning Coffee Rotation",
        "Horizontal": "Holiday Promo 2026",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l5",
        "l48",
        "l91"
      ]
    },
    {
      "id": "s6",
      "name": "Bean & Leaf Promo",
      "host": "h6",
      "type": "Ad",
      "template": "NCT Standard Template",
      "created": "Sep 9, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "demo": true,
      "tag": "Demo",
      "zones": {
        "Main": "Sunbright Oranges Promo",
        "Vertical": "Game Day Specials",
        "Horizontal": "Gym Motivation Loop",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l6",
        "l49",
        "l92"
      ]
    },
    {
      "id": "s7",
      "name": "Iron Works Gym Wall",
      "host": "h7",
      "type": "Ad",
      "template": "Standard Template V2",
      "created": "Sep 16, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Morning Coffee Rotation",
        "Vertical": "Weekend Brunch",
        "Horizontal": "Pharmacy Health Tips",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l7",
        "l50",
        "l93"
      ]
    },
    {
      "id": "s8",
      "name": "Bright Smile Waiting Room",
      "host": "h8",
      "type": "Menu",
      "template": "Fullscreen",
      "created": "Sep 23, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Game Day Specials",
        "Vertical": "Holiday Promo 2026",
        "Horizontal": "The Sedaap Hero Promo",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l8",
        "l51"
      ]
    },
    {
      "id": "s9",
      "name": "Quick Lube Bay Screen",
      "host": "h9",
      "type": "Ad",
      "template": "2-1 Zone",
      "created": "Aug 3, 2026",
      "createdBy": "NTV360 Support",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Weekend Brunch",
        "Vertical": "Gym Motivation Loop",
        "Horizontal": "Shopee Mart Deals",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l9",
        "l52"
      ]
    },
    {
      "id": "s10",
      "name": "Glow Studio Mirror",
      "host": "h10",
      "type": "Announcement",
      "template": "1 to 1 Zone",
      "created": "Aug 10, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Holiday Promo 2026",
        "Vertical": "Pharmacy Health Tips",
        "Horizontal": "Lounge Night Loop",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l10",
        "l53"
      ]
    },
    {
      "id": "s11",
      "name": "Tony’s Pizza Menu",
      "host": "h11",
      "type": "Ad",
      "template": "NCT Standard Template",
      "created": "Aug 17, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Gym Motivation Loop",
        "Vertical": "The Sedaap Hero Promo",
        "Horizontal": "Kitchen Favorites",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l11",
        "l54"
      ]
    },
    {
      "id": "s12",
      "name": "Fresh Market Endcap",
      "host": "h12",
      "type": "Ad",
      "template": "Standard Template V2",
      "created": "Aug 24, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Pharmacy Health Tips",
        "Vertical": "Shopee Mart Deals",
        "Horizontal": "Wood Texture Background",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l12",
        "l55"
      ]
    },
    {
      "id": "s13",
      "name": "Andrew’s Gym Entrance",
      "host": "h13",
      "type": "Menu",
      "template": "Fullscreen",
      "created": "Jul 4, 2026",
      "createdBy": "NTV360 Support",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "The Sedaap Hero Promo",
        "Vertical": "Lounge Night Loop",
        "Horizontal": "Sunbright Oranges Promo",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l13",
        "l56"
      ]
    },
    {
      "id": "s14",
      "name": "Riverbend Bistro Bar",
      "host": "h14",
      "type": "Ad",
      "template": "2-1 Zone",
      "created": "Jul 11, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Shopee Mart Deals",
        "Vertical": "Kitchen Favorites",
        "Horizontal": "Morning Coffee Rotation",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l14",
        "l57"
      ]
    },
    {
      "id": "s15",
      "name": "Crimson Tide Sports Wall",
      "host": "h15",
      "type": "Announcement",
      "template": "1 to 1 Zone",
      "created": "Jul 18, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Lounge Night Loop",
        "Vertical": "Wood Texture Background",
        "Horizontal": "Game Day Specials",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l15",
        "l58"
      ]
    },
    {
      "id": "s16",
      "name": "Magnolia Vet Lobby",
      "host": "h16",
      "type": "Ad",
      "template": "NCT Standard Template",
      "created": "Jul 25, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Kitchen Favorites",
        "Vertical": "Sunbright Oranges Promo",
        "Horizontal": "Weekend Brunch",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l16",
        "l59"
      ]
    },
    {
      "id": "s17",
      "name": "Northport Auto Spa Bay",
      "host": "h17",
      "type": "Ad",
      "template": "Standard Template V2",
      "created": "Jun 5, 2026",
      "createdBy": "NTV360 Support",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Wood Texture Background",
        "Vertical": "Morning Coffee Rotation",
        "Horizontal": "Holiday Promo 2026",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l17",
        "l60"
      ]
    },
    {
      "id": "s18",
      "name": "Druid City Coffee Counter",
      "host": "h18",
      "type": "Menu",
      "template": "Fullscreen",
      "created": "Jun 12, 2026",
      "createdBy": "Ibanez Lighting Inc.",
      "demo": false,
      "tag": "",
      "zones": {
        "Main": "Sunbright Oranges Promo",
        "Vertical": "Game Day Specials",
        "Horizontal": "Gym Motivation Loop",
        "Background": "Wood Texture Background"
      },
      "lic": [
        "l18",
        "l61"
      ]
    }
  ],
  "tags": [
    {
      "id": "t1",
      "name": "Drive-Thru",
      "color": "info",
      "sys": false
    },
    {
      "id": "t2",
      "name": "Lunch Rush",
      "color": "warning",
      "sys": false
    },
    {
      "id": "t3",
      "name": "65\"TV",
      "color": "teal",
      "sys": false
    },
    {
      "id": "t4",
      "name": "Portrait",
      "color": "success",
      "sys": false
    },
    {
      "id": "t5",
      "name": "Campus",
      "color": "purple",
      "sys": false
    },
    {
      "id": "t6",
      "name": "VIP Host",
      "color": "accent",
      "sys": false
    },
    {
      "id": "t7",
      "name": "TV_Online",
      "color": "info",
      "sys": true
    },
    {
      "id": "t8",
      "name": "No_Programmatic",
      "color": "hotpink",
      "sys": true
    },
    {
      "id": "t9",
      "name": "DNI-Dealer",
      "color": "info",
      "sys": true
    },
    { "id": "t10", "name": "Data_Off", "color": "warning", "sys": false },
    { "id": "t11", "name": "PC Monitor", "color": "teal", "sys": false },
    { "id": "t12", "name": "AD", "color": "warning", "sys": false },
    { "id": "t13", "name": "MB", "color": "purple", "sys": false },
    { "id": "t14", "name": "CS", "color": "accent", "sys": false },
    { "id": "t15", "name": "Onn_Vizio", "color": "redorange", "sys": false },
    { "id": "t16", "name": "Dell", "color": "info", "sys": false },
    { "id": "t17", "name": "90'", "color": "purple", "sys": false },
    { "id": "t18", "name": "Ad-Tech", "color": "redorange", "sys": false },
    { "id": "t19", "name": "ONN_Raku", "color": "success", "sys": false },
    { "id": "t20", "name": "43'TV", "color": "teal", "sys": false },
    { "id": "t21", "name": "50'TV", "color": "teal", "sys": false },
    { "id": "t22", "name": "HostOwnedTV", "color": "warning", "sys": false },
    { "id": "t23", "name": "LMP", "color": "warning", "sys": false },
    { "id": "t24", "name": "On Premise", "color": "warning", "sys": false },
    { "id": "t25", "name": "+Mesh", "color": "warning", "sys": false },
    { "id": "t26", "name": "Insigniafire", "color": "accent", "sys": false }
  ],
  "assign": [
    {
      "kind": "Host",
      "ref": "h1",
      "name": "Plaza O’ George",
      "tags": [
        "t1"
      ]
    },
    {
      "kind": "Advertiser",
      "ref": "a2",
      "name": "Sedaap Noodles",
      "tags": [
        "t2",
        "t5"
      ]
    },
    {
      "kind": "License",
      "ref": "l3",
      "name": "License #103",
      "tags": [
        "t3",
        "t6"
      ]
    },
    {
      "kind": "Screen",
      "ref": "s4",
      "name": "Pharmacy Counter Screen",
      "tags": [
        "t4"
      ]
    },
    {
      "kind": "Host",
      "ref": "h5",
      "name": "Bean & Leaf Cafe",
      "tags": [
        "t5",
        "t8"
      ]
    },
    {
      "kind": "Advertiser",
      "ref": "a6",
      "name": "Crimson Auto Group",
      "tags": [
        "t6",
        "t9"
      ]
    },
    {
      "kind": "License",
      "ref": "l7",
      "name": "License #107",
      "tags": [
        "t1"
      ]
    },
    {
      "kind": "Screen",
      "ref": "s8",
      "name": "Bright Smile Waiting Room",
      "tags": [
        "t2",
        "t2"
      ]
    },
    {
      "kind": "Host",
      "ref": "h9",
      "name": "Glow Studio Salon",
      "tags": [
        "t3",
        "t3"
      ]
    },
    {
      "kind": "Advertiser",
      "ref": "a10",
      "name": "Northport Honda",
      "tags": [
        "t4"
      ]
    },
    {
      "kind": "License",
      "ref": "l11",
      "name": "License #111",
      "tags": [
        "t5",
        "t5"
      ]
    },
    {
      "kind": "Screen",
      "ref": "s12",
      "name": "Fresh Market Endcap",
      "tags": [
        "t6",
        "t6"
      ]
    },
    {
      "kind": "Host",
      "ref": "h13",
      "name": "Riverbend Bistro",
      "tags": [
        "t1"
      ]
    },
    {
      "kind": "Advertiser",
      "ref": "a14",
      "name": "Lakeview Homes",
      "tags": [
        "t2",
        "t8"
      ]
    },
    {
      "kind": "License",
      "ref": "l15",
      "name": "License #115",
      "tags": [
        "t3",
        "t9"
      ]
    },
    {
      "kind": "Screen",
      "ref": "s16",
      "name": "Magnolia Vet Lobby",
      "tags": [
        "t4"
      ]
    },
    {
      "kind": "Host",
      "ref": "h17",
      "name": "Druid City Coffee",
      "tags": [
        "t5",
        "t2"
      ]
    },
    {
      "kind": "Advertiser",
      "ref": "a18",
      "name": "Calera Chiropractic",
      "tags": [
        "t6",
        "t3"
      ]
    },
    {
      "kind": "License",
      "ref": "l19",
      "name": "License #119",
      "tags": [
        "t1"
      ]
    },
    {
      "kind": "Screen",
      "ref": "s2",
      "name": "Plaza Lobby Screen",
      "tags": [
        "t2",
        "t5"
      ]
    },
    {
      "kind": "Host",
      "ref": "h21",
      "name": "Alabaster Family Dental",
      "tags": [
        "t3",
        "t6"
      ]
    },
    {
      "kind": "Advertiser",
      "ref": "a22",
      "name": "Pelham Pools",
      "tags": [
        "t4"
      ]
    },
    {
      "kind": "License",
      "ref": "l23",
      "name": "License #123",
      "tags": [
        "t5",
        "t8"
      ]
    },
    {
      "kind": "Screen",
      "ref": "s6",
      "name": "Bean & Leaf Promo",
      "tags": [
        "t6",
        "t9"
      ]
    },
    {
      "kind": "Host",
      "ref": "h25",
      "name": "Bessemer Barber Co.",
      "tags": [
        "t1"
      ]
    },
    {
      "kind": "Advertiser",
      "ref": "a2",
      "name": "Sedaap Noodles",
      "tags": [
        "t2",
        "t2"
      ]
    },
    {
      "kind": "License",
      "ref": "l27",
      "name": "License #127",
      "tags": [
        "t3",
        "t3"
      ]
    },
    {
      "kind": "Screen",
      "ref": "s10",
      "name": "Glow Studio Mirror",
      "tags": [
        "t4"
      ]
    },
    {
      "kind": "Host",
      "ref": "h29",
      "name": "Midfield Market",
      "tags": [
        "t5",
        "t5"
      ]
    },
    {
      "kind": "Advertiser",
      "ref": "a6",
      "name": "Crimson Auto Group",
      "tags": [
        "t6",
        "t6"
      ]
    }
  ],
  "totals": {
    "licenses": 97,
    "hosts": 43,
    "advertisers": 24,
    "content": 1240,
    "unused": 64
  }
};

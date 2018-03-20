/*/
/ / Users of most zip code or city databases often need to calculate the distance between two
/ / geographic coordinates via latitude and longitude. Since the earth is a sphere, you can't
/ / use the distance formula that works for two points in a plane. Instead, you should use the
/ / Haversine Formula. This formula is an approximation as it assumes the earth is a sphere
/ / when in reality it's an ellipsoid. However, it is fast and close enough for most uses.
/*/

// calculates the distance between two latitude and longitude coordinates using the Haversine formula
export function getLatLongDistance(lat1, long1, lat2, long2, miles) {
  const deg2rad = deg => deg * (Math.PI / 180);
  const square = x => Math.pow(x, 2);

  // radius of the earth in kilometers
  const radius = 6371;

  // ratio of one kilometer to a mile
  const kmMileRatio = 0.621371;

  // degrees to radians conversion
  lat1 = deg2rad(lat1);
  lat2 = deg2rad(lat2);

  // we need the difference of course to get the distance
  const latDiff = lat2 - lat1;
  const longDiff = deg2rad(long2 - long1);

  const a = square(Math.sin(latDiff / 2))
          + Math.cos(lat1)
          * Math.cos(lat2)
          * square(Math.sin(longDiff / 2));

  const d = 2
          * radius
          * Math.asin(Math.sqrt(a));

  // convert kilometers to miles if requested
  return miles ? (d * kmMileRatio) : d;
}

// parses the IETF language tag format defined in BCP 47 (RFC 5646 and RFC 4647)
export function getNavigatorLocale() {
  // different browsers have the user locale defined on different fields
  // in the navigator object, so we make sure to account the differences
  const code = ((navigator.languages && navigator.languages[0])
               || navigator.language || navigator.userLanguage || '').trim();

  // if there is a region code then extract it
  const parts = code.toLowerCase().split(/[_-]+/);

  // do not support the Language-Script-Region-Variant since browsers don't use it
  return {
    full: code,
    language: (parts[0] || code),
    region: (parts.length >= 2 ? parts[1] : null)
  };
}

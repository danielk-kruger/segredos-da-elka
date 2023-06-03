exports.hasNullOrUndefined = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (value === null || value === undefined) return true;

      if (typeof value === "object" && hasNullOrUndefined(value)) return true;
    }
  }

  return false;
};

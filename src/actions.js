export const inferLimit = function(response) {
  const count = response.count;
  const resultCount = response.results.length;

  if (count > resultCount) {
    return resultCount;
  }

  return null;
};

export const inferPageCount = function(response) {
  const totalResults = response.count;
  const resultsPerPage = inferLimit(response);

  if (totalResults && resultsPerPage) {
    return Math.ceil(totalResults / resultsPerPage);
  }

  return 1;
};

export default {
  inferLimit,
  inferPageCount
};

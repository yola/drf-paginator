export const inferResponseLimit = function(response) {
  const count = response.count;
  const resultCount = response.results.length;

  if (count > resultCount) {
    return resultCount;
  }

  return null;
};

export const parseResponse = function(response) {
  const {count, results} = response;
  const limit = inferResponseLimit(response);
  let pageCount = 1;

  if (count && limit) {
    pageCount = Math.ceil(count / limit);
  }

  return {
    count,
    limit,
    pageCount,
    results
  };
};

export default {
  inferResponseLimit,
  parseResponse
};

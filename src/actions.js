export const inferResponseLimit = function(data) {
  const count = data.count;
  const resultCount = data.results.length;

  if (count > resultCount) {
    return resultCount;
  }

  return null;
};

export const parseResponse = function(data) {
  const {count, results} = data;
  const limit = inferResponseLimit(data);
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

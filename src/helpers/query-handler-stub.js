import sinon from 'sinon';


export const stub = {
  setParams: function() {},
  onResponse: function() {},
  makeParams: function(page) {
    return { page };
  },
  resolvePage: function(queryParams) {
    return queryParams.page;
  },
};

for (let method in stub) {
  sinon.spy(stub, method);
}

export const resetSpies = function() {
  for (let name in stub) {
    stub[name].reset();
  }
};

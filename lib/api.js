let request = require('request');
const j = request.jar();
request = request.defaults({
  jar:j
});

const Methods = {
  Post: 'POST',
  Get: 'GET'
};

class API {
  constructor(subdomain, login, hash) {
    this._url = 'https://' + subdomain + '.amocrm.ru';
    this._config = {
      USER_LOGIN: login,
      USER_HASH: hash
    }
    this._authorized = false;
  }

  auth() {
    return new Promise((resolve, reject) => {
      request({
        url: this._url + '/private/api/auth.php',
        qs: {
          type: 'json'
        },
        method: Methods.Post,
        json: this._config,
        headers: {
          'User-Agent': 'amoCRM-NodeJS-client/1.0'
        }
      }, (err, res, body) => {
        if(err) {
          return reject(err);
        }
        if(res.statusCode != 200) {
          return reject({
            error_code: res.statusCode,
            error_message: res.statusMessage
          });
        }
        if(body.response.auth === true) {
          this._authorized = true;
        }
        resolve(body.response);
      });
    })
  }

  __apiCall(method, name, query = {}, params = {}) {
    return new Promise((resolve, reject) => {
      if(this._authorized === false) {
        throw 'Not authorized';
      }
      query.type = 'json';
      request({
        url: this._url + name,
        qs: query,
        method: method,
        json: params,
        headers: {
          'User-Agent': 'amoCRM-NodeJS-client/1.0'
        }
      }, (err, res, body) => {
        if(err) {
          return reject(err);
        }
        if(res.statusCode != 200) {
          return reject({
            error_code: res.statusCode,
            error_message: res.statusMessage
          });
        }
        resolve(body.response);
      });
    });
  }

  getCurrentAccount(freeUsers = false) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Get, '/private/api/v2/json/accounts/current', { free_users: (freeUsers ? 'Y' : 'N')})
      .then(resolve)
      .catch(reject);
    });
  }

  setContacts(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Post, '/private/api/v2/json/contacts/set', {}, {
        request: {
          contacts: params
        }
      })
      .then(resolve)
      .catch(reject);
    });
  }

  getContactsList(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Get, '/private/api/v2/json/contacts/list', params)
      .then(resolve)
      .catch(reject);
    });
  }

  getContactsLinks(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Get, '/private/api/v2/json/contacts/links', params)
      .then(resolve)
      .catch(reject);
    });
  }

  setLeads(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Post, '/private/api/v2/json/leads/set', {}, {
        request: {
          leads: params
        }
      })
      .then(resolve)
      .catch(reject);
    });
  }

  getLeadsList(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Get, '/private/api/v2/json/leads/list', params)
      .then(resolve)
      .catch(reject);
    });
  }

  /* ########################################################################
  ################################ Company ##################################
  #########################################################################*/
  setCompany(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Post, '/private/api/v2/json/company/set', {}, {
        request: {
          company: params
        }
      })
      .then(resolve)
      .catch(reject);
    });
  }

  getCompanyList(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Get, '/private/api/v2/json/leads/list', params)
      .then(resolve)
      .catch(reject);
    });
  }

  /* ########################################################################
  ############################### Customers #################################
  #########################################################################*/
  setCustomers(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Post, '/private/api/v2/json/customers/set', {}, {
        request: {
          customers: params
        }
      })
      .then(resolve)
      .catch(reject);
    });
  }

  getCustomersList(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Get, '/private/api/v2/json/customers/list', params)
      .then(resolve)
      .catch(reject);
    });
  }

  /* ########################################################################
  ############################# Transactions ################################
  #########################################################################*/
  setTransactions(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Post, '/private/api/v2/json/transactions/set', {}, {
        request: {
          transactions: params
        }
      })
      .then(resolve)
      .catch(reject);
    });
  }

  setTransactionsComment(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Post, '/private/api/v2/json/transactions/comment', {}, {
        request: {
          comments: params
        }
      })
      .then(resolve)
      .catch(reject);
    });
  }

  getTransactionsList(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Get, '/private/api/v2/json/transactions/list', params)
      .then(resolve)
      .catch(reject);
    });
  }

  /* ########################################################################
  ################################# Tasks ###################################
  #########################################################################*/
  setTasks(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Post, '/private/api/v2/json/tasks/set', {}, {
        request: {
          tasks: params
        }
      })
      .then(resolve)
      .catch(reject);
    });
  }

  getTasksList(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Get, '/private/api/v2/json/tasks/list', params)
      .then(resolve)
      .catch(reject);
    });
  }

  /* ########################################################################
  ################################# Notes ###################################
  #########################################################################*/
  setNotes(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Post, '/private/api/v2/json/notes/set', {}, {
        request: {
          notes: params
        }
      })
      .then(resolve)
      .catch(reject);
    });
  }

  getNotesList(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Get, '/private/api/v2/json/notes/list', params)
      .then(resolve)
      .catch(reject);
    });
  }

  /* ########################################################################
  ################################ Fields ###################################
  #########################################################################*/
  setFields(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Post, '/private/api/v2/json/fields/set', {}, {
        request: {
          fields: params
        }
      })
      .then(resolve)
      .catch(reject);
    });
  }

  getFieldsList(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Get, '/private/api/v2/json/fields/list', params)
      .then(resolve)
      .catch(reject);
    });
  }

  /* ########################################################################
  ################################# Calls ###################################
  #########################################################################*/
  addCalls(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Post, '/private/api/v2/json/calls/add', {}, {
        request: {
          calls: params
        }
      })
      .then(resolve)
      .catch(reject);
    });
  }

  /* ########################################################################
  ################################ Webhooks #################################
  #########################################################################*/
  addWebhooks(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Post, '/private/api/v2/json/webhooks/subscribe', {}, {
        request: {
          webhooks: {
            subscribe: params
          }
        }
      })
      .then(resolve)
      .catch(reject);
    });
  }

  deleteWebhooks(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Post, '/private/api/v2/json/webhooks/unsubscribe', {}, {
        request: {
          webhooks: {
            unsubscribe: params
          }
        }
      })
      .then(resolve)
      .catch(reject);
    });
  }

  getWebhooksList(params) {
    return new Promise((resolve, reject) => {
      this.__apiCall(Methods.Get, '/private/api/v2/json/webhooks/list', params)
      .then(resolve)
      .catch(reject);
    });
  }
}

module.exports = API;
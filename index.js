const API = require('./lib/api');
const express = require('express');
const bodyParser = require('body-parser')
const EventEmitter = require('events');
const publicIp = require('public-ip');

class AmoCRM extends EventEmitter {
  constructor(subdomain, login, hash) {
    super();
    this.api = new API(subdomain, login, hash);
    this._webhookInstalled = false;
    this._app = null;
    this._hash = hash;
  }

  async setupWebhook(port = 3040) {
    if(this._webhookInstalled) {
      throw 'Already installed';
    }
    this._myIP = await publicIp.v4();
    this._app = express();
    
    this._app.post('/' + this._hash, bodyParser.urlencoded({extended: true}), (req, res, next) => {
      if('contacts' in req.body) {
        if('add' in req.body.contacts) {
          this.emit('addContacts', req.body.contacts.add);
        }
        if('update' in req.body.contacts) {
          this.emit('updateContacts', req.body.contacts.update);
        }
        if('note' in req.body.contacts) {
          this.emit('noteContacts', req.body.contacts.note);
        }
        if('delete' in req.body.contacts) {
          this.emit('deleteContacts', req.body.contacts.delete);
        }
      }
      if('leads' in req.body) {
        if('add' in req.body.leads) {
          this.emit('addLeads', req.body.leads.add);
        }
        if('update' in req.body.leads) {
          this.emit('updateLeads', req.body.leads.update);
        }
        if('note' in req.body.leads) {
          this.emit('noteLeads', req.body.leads.note);
        }
        if('delete' in req.body.leads) {
          this.emit('deleteLeads', req.body.leads.delete);
        }
        if('status' in req.body.leads) {
          this.emit('statusLeads', req.body.leads.status);
        }
      }
      console.log(req.body);
    });
    
    this._app.listen(port, () => {
      console.log('Listening for webhooks on ' + port);
    });

    this.api.addWebhooks([
      {
        url: 'http://' + this._myIP + ':' + port + '/' + this._hash,
        events: [
          'responsible_lead',
          'responsible_contact',
          'responsible_company',
          'responsible_customer',
          'responsible_task',
          'restore_lead',
          'restore_contact',
          'restore_company',
          'add_lead',
          'add_contact',
          'add_company',
          'add_customer',
          'add_task',
          'update_lead',
          'update_contact',
          'update_company',
          'update_customer',
          'update_task',
          'delete_lead',
          'delete_contact',
          'delete_company',
          'delete_customer',
          'delete_task',
          'status_lead',
          'responsible_lead',
          'note_lead',
          'note_contact',
          'note_company',
          'note_customer'
        ]
      }
    ]).then((info) => {
      
    }).catch(console.error);
  }
}

module.exports = AmoCRM;
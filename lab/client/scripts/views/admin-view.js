'use strict';

var app = app || {};

(function (module) {
  const adminView = {};

  adminView.initAdminPage = function (ctx, next) {
    $('.nav-menu').slideUp(350);
    $('.admin-view').show();

    $('#admin-form').on('submit', function(event) {
      event.preventDefault();
      let token = event.target.passphrase.value;

      // COMMENT: Is the token cleared out of local storage? Do you agree or disagree with this structure?
      // A quick file search says that 'localStorage.' exists only in this file. It never gets cleared. This is obviously super insecure in several ways. One way would be to have valid admin status be a new Date as a timestamp. If admin status is used and less than 5 minutes have passed, change localStorage.admin to current Date. This way you could have timeout for admin status without overly impeding an actual admin. All that said, so long as this is kept in local storage and not server-side it is trivially easy to hack via the console.
      $.get(`${__API_URL__}/api/v1/admin`, {token})
        .then(res => {
          localStorage.token = true;
          page('/');
        })
        .catch(() => page('/'));
    })
  };

  adminView.verify = function(ctx, next) {
    if(!localStorage.token) $('.admin').addClass('admin-only');
    else $('.admin').show();
    next();
  }

  module.adminView = adminView;
})(app)
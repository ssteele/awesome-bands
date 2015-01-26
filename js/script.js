(function($) {


  /**
   * Ranker class constructor
   * @param {object} options    Passed in args
   */
  var Ranker = function(options) {
    var defaults = {
      dynamic: true,
      frequency: 60,
      limit: 10
    };
    this.options = $.extend(defaults, options);
    this.rankings = [];
    this.container = $('#rankings-container');
    this.poller_data = [];
  };


  /**
   * Set rankings
   */
  Ranker.prototype.set = function() {
    var rankings = [];
    $.each(this.poller_data, function(i, obj) {
      rankings.push({
        name: obj.name,
        count: obj.count
      });
    });
    this.rankings = rankings;
  };


  /**
   * HTML markup template
   * @param  {object} obj    Ranked object meta
   */
  Ranker.prototype.template = function(obj) {
    markup = '';
    markup += '<div class="ranking-row">';
    markup +=   '<div class="name">' + obj.name + '</div>';
    markup +=   '<div class="mentions">' + obj.count + '</div>';
    markup += '</div>';
    this.container.append(markup);
  };


  /**
   * Render ranked results
   */
  Ranker.prototype.render = function() {
    this.container.html('');
    for (var i=0; i<this.rankings.length; i++) {
      this.template(this.rankings[i]);
    }
  };


  /**
   * Poll results handler
   * @param  {array} data    Polled objects
   */
  Ranker.prototype.process_poll_results = function(data) {
    this.poller_data = data;
    this.set();
    this.render();
  };


  /**
   * Poller callback
   * @param  {array} data    Polled objects
   * @return {bool}          True on sucess; False if error
   */
  Ranker.prototype.callback = function(data) {
    if ('undefined' === typeof data || 0 === data.length) {
      container.html('<div class="rank-row"><div class="name">No live data available...</div></div>');
      return false;
    } else {
      ranker.process_poll_results(data);
      return true;
    }
  };


  /**
   * Start ranking
   */
  Ranker.prototype.start = function() {
    var poller = new window.massrel.Poller(this.options, this.callback);
    poller.start();
    if (true !== this.options.dynamic) {
      poller.stop();
    }
  };


  // Set ranker options
  var options = {
    frequency: 1,
    limit: 5,
    dynamic: false
  };


  // Instantiate ranker
  var ranker = new Ranker(options);
  ranker.start();


}(jQuery));

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
   * @param  {integer} i     Rank index
   */
  Ranker.prototype.update = function(obj, i) {
    markup = '';
    markup +=   '<div class="meta name" style="display:none;">' + obj.name + '</div>';
    markup +=   '<div class="meta mentions" style="display:none;">' + obj.count + '</div>';
    this.container.find('#' + i + '.ranking-row').html(markup).find('.meta').fadeIn();
  };


  /**
   * Animated rendering
   */
  Ranker.prototype.waterfall_rendering = function() {
    var obj = this;
    var i = 0;
    function iterate () {
      setTimeout(function () {
        obj.update(obj.rankings[i], i);
        i++;
        if (i < obj.rankings.length) {
          iterate();
        }
      }, 200);
    }
    iterate();
  };


  /**
   * Simple rendering
   */
  Ranker.prototype.simple_rendering = function() {
    for (var i=0; i<this.rankings.length; i++) {
      this.update(this.rankings[i], i);
    }
  };


  /**
   * Render ranked results
   */
  Ranker.prototype.render = function() {
    if ('waterfall' === this.options.animate) {
      this.waterfall_rendering();
    } else {
      this.simple_rendering();
    }
  };


  /**
   * Poll results handler
   * @param  {array} data    Polled objects
   */
  Ranker.prototype.process_poller = function(data) {
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
      ranker.container.html('<div class="ranking-row"><div class="name">No live data available...</div></div>');
      this.stop();
      return false;
    } else {
      ranker.process_poller(data);
      return true;
    }
  };


  /**
   * Initialize HTML markup
   */
  Ranker.prototype.init_markup = function() {
    for (var i=0; i<this.options.limit; i++) {
      this.container.append('<div id="' + i + '" class="ranking-row"></div>');
    }
  };


  /**
   * Start ranking
   */
  Ranker.prototype.start = function() {
    this.init_markup();
    var poller = new window.massrel.Poller(this.options, this.callback);
    poller.start();
    if (true !== this.options.dynamic) {
      poller.stop();
    }
  };


  // Set ranker options
  var options = {
    frequency: 15,
    limit: 5,
    dynamic: true,
    animate: 'waterfall'
  };


  // Instantiate ranker
  var ranker = new Ranker(options);
  ranker.start();


}(jQuery));

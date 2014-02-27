define(["backbone", "underscore", "jquery"],function(Backbone, _, $) {

  /**
   * A generic page, that can have sub-pages.
   *
   */
  return Backbone.View.extend({


    alwaysRenderOnShow:false,

    // This will be called once before the first render only.
    init:function() {

    },
    initok:false,

    addChildPage: function(id, childPage) {
      if (!this.childPages) this.childPages = {};

      if (this.childPages[id]) this.removeChildPage(id);

      childPage.parentPage = this;
      this.childPages[id] = childPage;
      childPage.setApp(this.app);
    },

    setApp:function(app) {
      this.app = app;
      //add to all children
      _.each(this.childPages,function(cp) {
        cp.setApp(app);
      });
    },

    setActiveMenu:function(menu) {
      $("#in-sub-nav a").removeClass("active");
      $("#in-sub-nav a.js-nav-"+menu).addClass("active");
    },

    setOptions:function(options) {
      this.options = options;
    },

    showChildPage: function(childPageId, options) {

      var ret = false;

      this.currentChildPage = childPageId;

      _.each(this.childPages, function(page, id) {
        if (id != childPageId) {
          if (!options || !options.modal) {
            page.hide();
          }
        } else {
          ret = page;
        }
      });

      if (options && options.options) {
        ret.setOptions(options.options);
      }
      if (options && options.forceRender) {
        ret.flush();
      }
      if (options && options.modal) {
        ret.showModal();
      } else {
        ret.show();
      }

      return ret;
    },

    removeChildPage:function(pageId) {
      if (!this.childPages[pageId]) return;
      this.childPages[pageId].removeAllChildPages();
      this.childPages[pageId].delegateEvents({});
      this.childPages[pageId].hide();
      this.childPages[pageId].remove();
      delete this.childPages[pageId];
    },

    removeAllChildPages:function() {
      if (this.childPages && _.size(this.childPages)) {
        _.each(_.keys(this.childPages),function(k) {
          this.removeChildPage(k);
        },this);
      }
    },

    showModal: function() {
      if (!this.initok) {
        this.init();
        this.initok = true;
      }
      if (!this._rendered || this.alwaysRenderOnShow) {
        this._rendered = true;
        this.render();

      }
      $(this.el).show().modal({
        keyboard: true,
        backdrop: true,
        show: true
      });
    },

    show: function() {
      if (!this.initok) {
        this.init();
        this.initok = true;
      }
      if (!this._rendered || this.alwaysRenderOnShow) {
        this._rendered = true;
        this.render();

      }

      if (this.menuName) this.setActiveMenu(this.menuName);

      this.trigger("show");
      $(this.el).fadeIn();

    },

    hide: function() {
      $(this.el).hide();
      this.trigger("hide");
    },

    remove:function() {
      this.hide();
    },

    flush:function() {
      //If we're currently shown, re-render now
      if ($(this.el)[0].style.display!="none") {
        this.render();

      //If not, queue for rendering at the next show();
      } else {
        this._rendered = false;
      }
    },

    renderTemplate:function(options,tpl,el) {

      //console.log(el,this.$el,app.templates[tpl || this.template]);
      (el||this.$el).html(_.template($(this.template).html())(_.defaults(options||{},{
        _: _,
        app: this.app
      })));
    },

    render:function() {
      return this;
    }
  });

});

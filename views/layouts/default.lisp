(in-package :turtl-www)


(deflayout default (data :top-level t)
  (:html
    (:head
      (:meta :http-equiv "Content-type" :content "text/html; charset=utf-8")
      (:meta :http-equiv "Content-language" :content "en")

      (:title (str (conc (getf data :title) " | Turtl")))
      (:link :rel "stylesheet" :href "/css/template.css")
      (:link :rel "stylesheet" :href "/css/site.css")
      (:link :rel "stylesheet" :href "/css/highlight.js/github.css")
      (:link :rel "shortcut icon" :href "/favicon.png" :type "image/x-icon")
      ;; LOL GoOgLe is pretecting us!!!1
      (:link :rel "chrome-webstore-item" :href "https://chrome.google.com/webstore/detail/dgcojenhfdjhieoglmiaheihjadlpcml")
      (:script :src "/js/mootools-core-1.4.5.js")
      (:script :src "/js/mootools-more-1.4.0.1.js")
      (:script :src "/js/highlight.js/highlight.pack.js")
      (:script :src "/js/turtl.js"))
    (:body :class (if (getf data :body-class)
                      (getf data :body-class)
                      "")
      (:div :id "container"
        (:header
          (:h1 (:a :href "/" "Turtl<em>.</em>"))
          (:small "(private storage)")
          (:ul
            (:li (:a :href "/about" "About"))
            (:li (:a :href "/docs" "Documentation"))
            (:li (:a :href "/faq" "FAQ"))
            (:li (:a :href "/contact" "Get in touch"))
            (:li (:a :href "http://turtlapp.tumblr.com/" "Blog"))
            ;(:li (:a :href "https://github.com/turtl/js/issues" "Report a bug"))
            ;(:li (:a :href "/demo" "Demo"))
            ))
        (:content
          (:div :class "gutter clear"
            (str (getf data :content))))
        
        (:footer
          "<a href=\"/privacy\">Privacy</a>"
          " &nbsp;&nbsp;|&nbsp;&nbsp;"
          "<a href=\"/contact\">Contact</a>"
          " &nbsp;&nbsp;|&nbsp;&nbsp;"
          "<a href=\"http://groups.google.com/d/forum/turtl\">Discussion group</a>"
          " &nbsp;&nbsp;|&nbsp;&nbsp;"
          "<a href=\"https://github.com/turtl\">Github</a>"
          " &nbsp;&nbsp;|&nbsp;&nbsp;"
          "<a href=\"https://twitter.com/turtlapp\">Twitter</a>"
          " &nbsp;&nbsp;|&nbsp;&nbsp;"
          "<a href=\"http://turtl.dev:8182/refresh-views\">Blog</a>"
          " &nbsp;&nbsp;|&nbsp;&nbsp;"
          (:p "&copy;" (:a :href "http://lyonbros.com" "Lyon Bros. Enterprises, LLC"))))
      (:script
        "
  var _paq = _paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u=((\"https:\" == document.location.protocol) ? \"https\" : \"http\") + \"://turtl.it/piwik//\";
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', 1]);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript';
    g.defer=true; g.async=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
  })();
        "))))



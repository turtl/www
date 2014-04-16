(in-package :turtl-www)

(deflayout default (data :top-level t)
  (:html
    (:head
      (:meta :http-equiv "Content-type" :content "text/html; charset=utf-8")
      (:meta :http-equiv "Content-language" :content "en")

      (:title (str (conc (getf data :title) " | Turtl")))
      (:link :rel "stylesheet" :href "/css/template.css")
      (:link :rel "stylesheet" :href "/css/site.css")
      (:link :rel "stylesheet" :href "/js/highlight.js/styles/github.css")
      (:link :rel "shortcut icon" :href "/images/favicon.png" :type "image/x-icon")
      ;; LOL GoOgLe is pretecting us!!!1
      (:link :rel "chrome-webstore-item" :href "https://chrome.google.com/webstore/detail/dgcojenhfdjhieoglmiaheihjadlpcml")
      (:script :src "/js/mootools-core-1.4.5.js")
      (:script :src "/js/mootools-more-1.4.0.1.js")
      (:script :src "/js/highlight.js/highlight.pack.js")
      (:script :src "/js/slideshow.js")
      (:script :src "/js/modal.js")
      (:script :src "/js/turtl.js")
      
      (:meta :name "google-site-verification" :content "bQuItGSUXJSmgvGivAK64EkYDKD_qK_jhd0rd2aH7Rk"))
    (:body :class (if (getf data :body-class)
                      (getf data :body-class)
                      "")
      (:header
        (:div :class "inner"
          (:h1 (:a :href "/" "<span>Turtl</span>"))
          (:ul
            (:li (:a :href "/download" :class "strong" "Download"))
            (:li (:a :href "/pricing" "Pricing"))
            (:li (:a :href "/docs" "Docs"))
            (:li (:a :href "/faq" "FAQ"))
            (:li (:a :href "/about" "About"))
            (:li (:a :href "/contact" "Contact"))
            (:li (:a :href "http://turtlapp.tumblr.com/" "Blog")))))

      (str (if (getf data :pre-content)
               (getf data :pre-content)
               ""))

      (:section
        (str (getf data :content)))
      
      (:footer
        (:div :class "social"
          (:ul
            (:li "<a class=\"twitter\" href=\"https://twitter.com/turtlapp\" title=\"Follow us on twitter for news and updates\"><icon>&#62217;</icon></a>")
            (:li "<a class=\"tumblr\" href=\"http://turtlapp.tumblr.com\" title=\"Read about our development process on Tumblr\"><icon>&#62229;</icon></a>")))
        (:ul :class "nav"
          (:li (:a :href "/docs" "Documentation"))
          (:li (:a :href "/privacy" "Privacy"))
          (:li (:a :href "/contact" "Contact"))
          (:li (:a :href "http://groups.google.com/d/forum/turtl" "Discussion group"))
          (:li (:a :href "https://github.com/turtl" "Github"))
          (:li :class "copy" "&copy; " (:a :href "http://lyonbros.com" "Lyon Bros. Enterprises, LLC"))))
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



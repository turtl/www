(in-package :turtl-www)

(defparameter *download-pages*
  (list (format nil "~a/views/pages/index.md" *root*)
        (format nil "~a/views/pages/download.md" *root*)
        (format nil "~a/views/pages/invites.md" *root*)) 
  "Lists all pages the download module is on.")

(defun in-invite-site (req)
  "Determine if we are in the invite site."
  (let ((invite-search *invite-site-host*)
        (host (getf (request-headers req) :host)))
    (string= (subseq host 0 (min (length invite-search)
                                 (length host)))
             invite-search)))

(defun on-invite-page (req)
  "Determine if we're on an invite page (/invites/2134/1234/1234)"
  (let ((invite-search "/invites/")
        (resource (request-resource req)))
    (string= (subseq resource 0 (min (length invite-search)
                                     (length resource)))
             invite-search)))

;; add some invite site/main site cross redirecting
(add-hook :pre-route
  (lambda (req res)
    (let ((future (make-future)))
      (cond ((and (in-invite-site req)
                  (not (on-invite-page req)))
             (send-response res
                            :status 301
                            :headers (list :location
                                           (format nil "~a~a" *site-url* (request-resource req)))
                            :body "Moved.")
             (signal-error future t))
            ((and (not (in-invite-site req))
                  (on-invite-page req))
             (send-response res
                            :status 301
                            :headers (list :location
                                           (format nil "http://~a~a" *invite-site-host* (request-resource req)))
                            :body "Moved.")
             (signal-error future t))
            (t
             (finish future)))
      future)))

(when *enable-hsts-header*
  (add-hook :response-started
    (lambda (res req &rest _)
      (declare (ignore _))
      (let ((invite-search *invite-site-host*)
            (host (getf (request-headers req) :host)))
        (unless (in-invite-site req)
          (setf (getf (response-headers res) :strict-transport-security)
                (format nil "max-age=~a" *enable-hsts-header*)))))))

(when *always-reload-views*
  (add-hook :pre-route (lambda (req res)
                         (declare (ignore req res))
                         (load-views))
            :load-views))

(defun page-not-found (res)
  "Sends a 404 error."
  (send-response res
                 :status 404
                 :body (layout 'default (list :content "Page not found."
                                              :title "Page not found."))))

;; clear out all routes (start anew)
(clear-routes)

(defroute (:get "/([0-9a-f]{5,6})?") (req res args)
  (generate-download-page *download-pages*)
  (let* ((invite-code (car args))
         (slideshow (find-module :slideshow))
         (body (load-view :pages/index :data `(:body-class "splash"
                                               :canonical "/"
                                               :pre-content ,slideshow))))
    (set-cookie res "invc" invite-code :path "/" :max-age 2592000)
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/promo/([a-zA-Z0-9]+)") (req res args)
  (let* ((promo-code (car args)))
    (set-cookie res "promo" promo-code :path "/" :max-age 2592000)
    (send-response res :status 307 :headers '(:location "/") :body "<a href=\"/\">home</a>")))

(defroute (:get "/security") (req res)
  (send-response res
                 :status 301
                 :headers '(:location "/docs/security")
                 :body "moved to <a href=\"/docs/security\">security</a>"))

(defroute (:get "/docs/clients/app/(.*)") (req res args)
  (send-response res
                 :status 301
                 :headers (list :location (format nil "/docs/clients/core/~a" (car args)))
                 :body (format nil "moved to <a href=\"/docs/clients/core/~a\">here</a>" (car args))))

(defroute (:get "/download") (req res)
  (generate-download-page *download-pages*)
  (let ((body (load-view :pages/download)))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/pricing") (req res)
  (let ((body (load-view :pages/pricing)))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/about") (req res)
  (let ((body (load-view :pages/about)))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/faq") (req res)
  (let ((body (load-view :pages/faq)))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/privacy") (req res)
  (let ((body (load-view :pages/privacy)))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/terms") (req res)
  (let ((body (load-view :pages/terms)))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/contact") (req res)
  (let ((body (load-view :pages/contact)))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/donate") (req res)
  (let ((body (load-view :pages/donate)))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/invites/([0-9a-f-]+)/([0-9a-f-]+)/([0-9a-f-]+)") (req res args)
  (generate-download-page *download-pages*)
  (let ((body (load-view :pages/invites :data '(:body-class "invite"))))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/docs(/(.*))?") (req res args)
  (handler-case
    (let* ((view (intern (string-upcase (format nil "docs/~a" (or (cadr args) "index"))) :keyword))
           (content (load-view view)))
      (send-response res :headers '(:content-type "text/html") :body content))
    (view-not-found ()
      (page-not-found res))
    (error (e)
      (send-response res :status 500 :body (format nil "~a" e)))))

(when *allow-reload-views*
  (defroute (:get "/refresh-views") (req res)
    (load-views)
    (send-response res :body "Views refreshed!!")))

(defparameter *blog-cache* nil
  "Caches the blog response from Tumblr so we don't load it on each request.")

(defroute (:get "/blog-jsonp") (req res)
  (flet ((load-blog (&optional skip-response)
           ;; grab the blog
           (alet* ((url (format nil "http://turtlapp.tumblr.com/api/read?start=0&num=1&format=json&callback=~a" (get-var req "callback")))
                   (response (das:http-request url)))
             ;; cache the blog post
             (setf *blog-cache* (list :body response
                                      :time (get-internal-real-time)))
             ;; send a response, if needed
             (unless skip-response
               (send-response res :body response)))))
    (if *blog-cache*
        ;; we have a cached version! show it
        (let ((body (getf *blog-cache* :body))
              (time (getf *blog-cache* :time))
              (now (get-internal-real-time)))
          ;; send blog, even if stale
          (send-response res :body body)
          (when (<= 3600 (/ (- now time) internal-time-units-per-second))
            ;; cache is now stale, load and cache the blog in the background.
            ;; next request gets the new blog.
            (load-blog t)))
        ;; no cached version. load it and respond.
        (load-blog))))

;(defroute (:get "/favicon.ico") (req res)
;  (send-response res :status 301 :headers '(:location "/favicon.png")))

(def-directory-route "/" (format nil "~awebroot" *root*) :disable-directory-listing t)

(defroute (:get "/docs(/(.*))?") (req res args)
  (handler-case
    (let* ((view (intern (string-upcase (format nil "docs/~a" (or (cadr args) "index"))) :keyword))
           (content (load-view view)))
      (send-response res :headers '(:content-type "text/html") :body content))
    (view-not-found ()
      (page-not-found res))
    (error (e)
      (send-response res :status 500 :body (format nil "~a" e)))))

(defroute (:* ".+") (req res)
  (page-not-found res))



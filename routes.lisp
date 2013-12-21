(in-package :turtl-www)

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

(defroute (:get "/") (req res)
  (let* ((slideshow (find-module :slideshow))
         (body (load-view :pages/index :data `(:body-class "splash"
                                               :pre-content ,slideshow))))
    (send-response res :headers '(:content-type "text/html") :body body)))

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

(defroute (:get "/about") (req res)
  (let ((body (load-view :pages/about)))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/faq") (req res)
  (let ((body (load-view :pages/faq)))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/privacy") (req res)
  (let ((body (load-view :pages/privacy)))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/contact") (req res)
  (let ((body (load-view :pages/contact)))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/donate") (req res)
  (let ((body (load-view :pages/donate)))
    (send-response res :headers '(:content-type "text/html") :body body)))

(defroute (:get "/invites/([0-9a-f-]+)/([0-9a-f-]+)/([0-9a-f-]+)") (req res args)
  (let ((body (load-view :pages/invites :data '(:body-class "splash"))))
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

(defroute (:get "/refresh-views") (req res)
  (load-views)
  (send-response res :body "Views refreshed!!"))

;(defroute (:get "/favicon.ico") (req res)
;  (send-response res :status 301 :headers '(:location "/favicon.png")))

(def-directory-route "/" (format nil "~awebroot" *root*))

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



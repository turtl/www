(in-package :turtl-www)

(setf cl-who:*attribute-quote-char* #\"
      (cl-who:html-mode) :html5)

;; load all enabled wookie plugins
(load-plugins :use-quicklisp t)

(defun error-handler (err)
  (unless (typep err 'as:tcp-info)
    (format t "(turtl-www) UNcaught error: ~a~%" err)))

(defun start (&key bind (port 8080))
  ;; setup the wookie log
  (setf *log-level* :notice)

  (setf *error-handler* 'error-handler)

  ;; load/cache all the views
  (load-views)

  ;; write our PID file (if *pid-file* is set)
  (when *pid-file*
    (with-open-file (s *pid-file*
                     :direction :output
                     :if-exists :overwrite
                     :if-does-not-exist :create)
      (format s "~a" (get-current-pid))))

  ;; start the server
  (unwind-protect
    (as:with-event-loop (:catch-app-errors t)
      (let* ((listener (make-instance 'listener :bind bind :port port))
             (server (start-server listener)))
        (as:signal-handler 2
          (lambda (sig)
            (declare (ignore sig))
            (as:free-signal-handler 2)
            (as:close-tcp-server server)
            (as:exit-event-loop)))))
    (when *pid-file*
      (delete-file *pid-file*))))


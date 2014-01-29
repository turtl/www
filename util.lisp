(in-package :turtl-www)

(defun file-contents (path)
  "Sucks up an entire file from PATH into a freshly-allocated string,
   returning two values: the string and the number of bytes read."
  (with-open-file (s path)
    (let* ((len (file-length s))
           (data (make-string len)))
      (values data (read-sequence data s)))))

(defun version-greater-p (ver1 ver2)
  "Determine if first verison given is greater than the second."
  (if ver2
      (let* ((split-fn (lambda (ver)
                         (let ((parts (cl-ppcre:split "\\." ver))
                               (div 1)
                               (final 0))
                           (dolist (part parts)
                             (incf final (* div (parse-integer part :junk-allowed t)))
                             (setf div (/ div 100)))
                           final)))
             (ver1-val (funcall split-fn ver1))
             (ver2-val (funcall split-fn ver2)))
        (< ver2-val ver1-val))
      t))

(defun generate-download-page (refresh-views)
  "If a views/modules/download.md isn't present, generates one using values
   pulled from scraping the filesystem."
  (let* ((file-str (format nil "~a/views/modules/download.md" *root*))
         (view-directory (format nil "~a/views" *root*)))
    (unless (probe-file file-str)
      (let ((view-vars (make-hash-table :test #'equal)))
        ;; get extension versions
        (dolist (file (cl-fad:list-directory (format nil "~a/webroot/release/extension/" *root*)))
          (unless (cl-ppcre:scan "\\.gitignore$" (namestring file))
            (let* ((filename (pathname-name file))
                   (version (cl-ppcre:regex-replace "^.*-(([0-9]+(-[a-z]+)?\.?)+).*?$" filename "\\1"))
                   (app (cl-ppcre:regex-replace "([a-z0-9]+)-.*?$" filename "\\1")))
              (when (version-greater-p version (gethash app view-vars))
                (setf (gethash (format nil "extension-~a-version" app) view-vars) version)))))
        ;; get desktop versions
        (dolist (file (cl-fad:list-directory (format nil "~a/webroot/release/desktop/" *root*)))
          (unless (cl-ppcre:scan "\\.gitignore$" (namestring file))
            (let* ((filename (pathname-name file))
                   (version (cl-ppcre:regex-replace "^.*-(([0-9]+(-[a-z]+)?\.?)+).*?$" filename "\\1"))
                   (version (if (eq (aref version (1- (length version))) #\.)
                                (subseq version 0 (1- (length version)))
                                version))
                   (app (cl-ppcre:regex-replace "turtl-([a-z0-9]+)-.*?$" filename "\\1")))
              (when (version-greater-p version (gethash app view-vars))
                (setf (gethash (format nil "desktop-~a-version" app) view-vars) version)))))
        (let* ((contents (file-contents (concatenate 'string file-str ".tpl")))
               (compiled (cl-ppcre:regex-replace-all
                           "\\{\\{([a-z0-9-]+)\\}\\}"
                           contents
                           (lambda (match &rest regs)
                             (let* ((regs (cddddr regs))
                                    (rs (car regs))
                                    (re (cadr regs))
                                    (var (subseq match (aref rs 0) (aref re 0))))
                               (or (gethash var view-vars) ""))))))
          (with-open-file (fd file-str :direction :output :if-exists :supersede)
            (write-sequence compiled fd))
          (let* ((view-name (generate-view-name view-directory file-str)))
            (save-view view-name file-str ".md")
            (dolist (file-str refresh-views)
              (let ((ext (subseq file-str (or (position #\. file-str :from-end t) (length file-str))))
                    (view-name (generate-view-name view-directory file-str)))
                (let ((view (save-view view-name file-str ext)))
                  (setf (getf view :html) (inject-modules (getf view :html))))))))))))

(defun get-current-pid (&key if-not-exists-return)
  "Get the current process' PID. This function does it's best to be cross-
  implementation. If it isn't able to grab the PID from the system, it defaults
  to returning whatever value is passed into the :if-not-exists-return key."
  #+clisp
  (system::process-id)
  #+(and lispworks unix)
  (system::getpid)
  #+(and sbcl unix)
  (sb-unix:unix-getpid)
  #+(and cmu unix)
  (unix:unix-getpid)
  #+openmcl
  (ccl::getpid)
  #-(or clisp (and lispworks unix) (and sbcl unix) (and cmu unix) (and openmcl unix) openmcl)
  if-not-exists-return)


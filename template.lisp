(in-package :tagit-www)

(define-condition view-not-found (error)
  ((view :initarg :view :reader view-name :initform nil))
  (:report (lambda (c s) (format s "View not found: ~a" (view-name c))))
  (:documentation "Describes the condition when a view doesn't exist."))

(defparameter *scanner-md-header*
  (cl-ppcre:create-scanner "^\s*---(.*?)---"
                           :case-insensitive-mode t
                           :single-line-mode t)
  "Defines a scanner used to pull the header section from a markdown file.")

(defvar *views* nil
  "Defines a container for all parsed/compiled views to be cached.")

(defmacro deflayout (name (data-var &key (stream-var 's) top-level) &body body)
  "Define a wookie layout function. Can be used in conjunction with a
   'layout: ...' header in a markdown file."
  (let ((view-name (intern (string-upcase (format nil "layout-~a" name)) :tagit-www)))
    `(progn
       (defun ,view-name (,data-var)
         (cl-who:with-html-output-to-string (,stream-var nil :prologue ,top-level :indent t)
           ,@body))
       ',view-name)))

(defmacro parent-layout (name data-var &body body)
  "Allows a layout to be wrapped by another (parent) layout."
  `(str
     (layout ,name (append (list :content (cl-who:with-html-output-to-string (s)
                                            ,@body))
                           ,data-var))))

(defun generate-view-name (view-dir file)
  "Generates a symbol that can be used to identify a view."
  (let* ((view-dir (namestring view-dir))
         (file (namestring file))
         (file (subseq file (1+ (mismatch file view-dir))))
         (file (subseq file 0 (position #\. file :from-end t))))
    (intern (string-upcase file) :keyword)))

(defun parse-markdown-header (header)
  "Parses the key-value section in a markdown header."
  (let ((kv-pairs nil))
    (when header
      (dolist (line (cl-ppcre:split "[\\r\\n]+" header))
        (let ((colon-pos (position #\: line)))
          (when colon-pos
            (let* ((key (intern (string-upcase (subseq line 0 colon-pos)) :keyword))
                   (value (subseq line (+ colon-pos 1)))
                   (value (string-trim #(#\space #\return #\newline) value)))
              (case key
                (:layout (setf value (intern (string-upcase value) :tagit-www))))
              (setf (getf kv-pairs key) value))))))
    kv-pairs))

(defun format-code-blocks (str)
  "Turn

   ```lisp
   (defun () ...)
   ```

   into

   <pre><code class=\"lisp\">(defun () ...)</code></pre>
   "
  (cl-ppcre:regex-replace-all
    (cl-ppcre:create-scanner
      "```(.*?)(\\n.*?)(\\n)```"
      :case-insensitive-mode t
      :single-line-mode t)
    str
    "\\3<pre><code class=\"\\1\">\\2</code></pre>\\3"))

(defun convert-to-html-id (str)
  "Convert 'Omg Lol Wtf' to 'omg-lol-wtf'"
  (let* ((str (cl-ppcre:regex-replace-all "[^\\w]" str "-"))
         (str (cl-ppcre:regex-replace-all "-+" str "-"))
         (str (cl-ppcre:regex-replace-all "(^-+|-+$)" str "")))
    (string-downcase str)))

(defun load-views (&key subdir (clear t) (view-directory (format nil "~a/views" *root*)))
  "Load and cache all view files."
  (when clear
    (setf *layouts* nil
          *views* (make-hash-table :test 'eq)))
  (dolist (file (cl-fad:list-directory (if subdir subdir view-directory)))
    (cond ((cl-fad:directory-exists-p file)
           (load-views :subdir file :clear nil))
          ((cl-fad:file-exists-p file)
           (let* ((file-str (namestring file))
                  (ext (subseq file-str (or (position #\. file-str :from-end t) (length file-str))))
                  (view-name (generate-view-name view-directory file-str)))
             (cond ((string= ext ".lisp")
                    (load file))
                   ((string= ext ".md")
                    (let* ((markdown-str (file-contents file))
                           (markdown-header (nth-value 1 (cl-ppcre:scan-to-strings *scanner-md-header* markdown-str)))
                           (markdown-header (when markdown-header (aref markdown-header 0)))
                           (parsed-headers (parse-markdown-header markdown-header))
                           (markdown-str (cl-ppcre:regex-replace *scanner-md-header* markdown-str ""))
                           (markdown-str (format-code-blocks markdown-str))
                           (html (markdown.cl:parse markdown-str)))
                      (setf (gethash view-name *views*)
                            (list :meta parsed-headers
                                  :html html)))))))))
  *views*)

(defun load-view (name &key data)
  "Load a view from the view cache."
  (let ((view (gethash name *views*)))
    (if view
        (let ((html (getf view :html))
              (meta (getf view :meta)))
          (let ((data (append data
                              (list :title (getf meta :title)
                                    :content html)))
                (layout (getf meta :layout)))
            (if layout
                (layout layout data)
                html)))
        (error 'view-not-found :view name))))

(defun layout (name data)
  "Sends data to a layout and returns the content for that layout."
  (let ((layout-fn (intern (string-upcase (format nil "layout-~a" name)) :tagit-www)))
    (funcall layout-fn data)))


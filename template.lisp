(in-package :turtl-www)

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
  (let ((view-name (intern (string-upcase (format nil "layout-~a" name)) :turtl-www)))
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
                (:layout (setf value (intern (string-upcase value) :turtl-www))))
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

(defun generate-table-of-contents (str)
  "Generate a table of contents for documentation. Injects itself into {{toc}}
   tags."
  (unless (search "{{toc}}" str)
    (return-from generate-table-of-contents str))

  (let* ((headers nil)
         (str (cl-ppcre:regex-replace-all
                (cl-ppcre:create-scanner "^((#{1,3})\\s*(.*?)(\\s*#+)?)$" :multi-line-mode t)
                str
                (lambda (match &rest regs)
                  (declare (ignore match))
                  (let* ((regs (cddddr regs))
                         (rs (car regs))
                         (re (cadr regs))
                         (tag (subseq str (aref rs 0) (aref re 0)))
                         (level (length (subseq str (aref rs 1) (aref re 1))))
                         (title (subseq str (aref rs 2) (aref re 2)))
                         (type-pos (position (code-char 40) title))
                         (type (if type-pos (subseq title (1+ type-pos) (position (code-char 41) title :start type-pos)) ""))
                         (title (if type-pos (subseq title 0 type-pos) title))
                         (id (convert-to-html-id title)))
                    (push (list :title title
                                :type type
                                :id id
                                :level (- level 1)) headers)
                    (concatenate 'string "<a id=\"" id "\"></a>" markdown.cl::*nl* tag)))))
         (headers (reverse headers)))
    (cl-ppcre:regex-replace "{{toc}}" str
      (lambda (&rest _)
        (declare (ignore _))
        (with-output-to-string (s)
          (dolist (header headers)
            (dotimes (i (getf header :level))
              (format s " "))
            (let* ((title (getf header :title))
                   (id (getf header :id))
                   (type (getf header :type)))
              (format s "- [~a](#~a)" title id)
              (unless (string= type "")
                (format s " _~a_" type))
              (format s "~a" markdown.cl::*nl*))))))))

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
                           (markdown-str (generate-table-of-contents markdown-str))
                           (html (markdown.cl:parse markdown-str)))
                      (setf (gethash view-name *views*)
                            (list :meta parsed-headers
                                  :html html)))))))))
  ;; process modules (only after ALL views are loaded)
  (loop for k being the hash-keys of *views*
        for v being the hash-values of *views* do
    (let* ((html (getf v :html))
           (html (inject-modules html)))
      (setf (getf v :html) html
            (gethash k *views*) v)))
  *views*)

(defun find-module (name)
  "Find a module by name (without the leading 'module:')"
  (loop for k being the hash-keys of *views* do
    (let ((module-str (string k)))
      (when (zerop (or (search "MODULES/" module-str) -1))
        (let ((modname (string-downcase (subseq module-str 8))))
          (when (string= (string-downcase name) modname)
            (return-from find-module (getf (gethash k *views*) :html)))))))
  "")

(defun inject-modules (html)
  "Add in any modules to this HTML string."
  (unless (search "{{module:" html)
    (return-from inject-modules html))
  (cl-ppcre:regex-replace-all
    (cl-ppcre:create-scanner "{{module:([a-z0-9_-]+)}}" :multi-line-mode t)
    html
    (lambda (match &rest regs)
      (declare (ignore match))
      (let* ((regs (cddddr regs))
             (rs (car regs))
             (re (cadr regs))
             (name (subseq html (aref rs 0) (aref re 0)))
             (module (find-module name)))
        module))))

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
  (let ((layout-fn (intern (string-upcase (format nil "layout-~a" name)) :turtl-www)))
    (funcall layout-fn data)))


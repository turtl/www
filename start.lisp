(ql:quickload :turtl-www)
(vom:config t :info)
(vom:config :turtl-www :info)
(turtl-www:start :port 8184)
(cl-user::quit)


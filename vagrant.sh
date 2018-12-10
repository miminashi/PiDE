#!/bin/sh
#
# Vagrant VM を再起動してアプリケーションを起動するスクリプト
#
vagrant reload --provision
vagrant ssh -c "cd /vagrant; node /vagrant/main.js"


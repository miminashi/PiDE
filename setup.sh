#!/bin/sh

if ! npm --version; then
  {
    echo "エラー: nodejs をインストールしてください"
    echo "          macOS の場合: brew install node"
    echo "    RaspberryPi の場合: curl -sL https://deb.nodesource.com/setup_11.x | sudo bash - && sudo apt-get install -y nodejs"
  } 1>&2
  exit 1
fi

npm install &&
mkdir -p ./public/js/lib &&
mkdir -p ./public/css/lib &&

# socket.io
mkdir -p ./public/lib/socket.io &&
cp ./node_modules/socket.io-client/dist/socket.io.js ./public/lib/socket.io/ &&

# xterm
mkdir -p ./public/lib/xterm &&
cp ./node_modules/xterm/dist/xterm.js ./public/lib/xterm &&
cp ./node_modules/xterm/dist/xterm.css ./public/lib/xterm &&
cp ./node_modules/xterm/dist/addons/fit/fit.js ./public/lib/xterm &&

# ace
mkdir -p ./public/lib/ace &&
cp node_modules/ace-builds/src/ace.js ./public/lib/ace/ &&
cp node_modules/ace-builds/src/mode-sh.js ./public/lib/ace/ &&

echo "インストールが完了しました"

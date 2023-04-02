# SweetHome

brew install mkcert  
brew install nss # if you use Firefox  
mkcert -install

mkcert 0.0.0.0 localhost 127.0.0.1 ::1  
mv 0.0.0.0+3-key.pem key.pem  
mv 0.0.0.0+3.pem cert.pem  

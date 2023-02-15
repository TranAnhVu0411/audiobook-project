# Audiobook-Website
(Will dockerize this project later)

git clone this respitory

git clone https://github.com/TranAnhVu0411/ocr-pdf-audio-service and complete the setup

install mongodb

open Cloudinary, log in and get CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

go to api
+ add file .env with content: 
PORT=8800 
CLOUDINARY_CLOUD_NAME=********
CLOUDINARY_API_KEY=********
CLOUDINARY_API_SECRET=*********

+ npm install
+ npm start

go to client
+ npm install
+ npm start

run web: http://localhost:3000

register a new account, then go to mongodb compass => audiobook_db => users => change account role to admin 

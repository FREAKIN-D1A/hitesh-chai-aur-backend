echo "# hitesh-chai-aur-backend" >> README.md
git init &&
git add . &&
git commit -m "first commit" &&
git branch -M main &&
git remote add origin git@github.com:FREAKIN-D1A/hitesh-chai-aur-backend.git &&
git push -u origin main 
git remote add origin git@github.com:FREAKIN-D1A/hitesh-chai-aur-backend.git
git push -u origin main

--------------------------
git branch -M main &&
git add . &&
git commit -m "-- commit" &&
git push -u origin main  

---------------------
import { COLORS } from "../constant";
  console.log(COLORS.FgMagenta, "\n\n");
  console.log("req.files   >>>>>>\n");
  console.log(req.files);
  console.log(COLORS.Reset, "\n\n");
  -----------------------

Project workflow:
# Project setup:

create a new project with npm init 
create a public/temp folder which will temporarily store the pics.
    create a new public/temp/.gitkeep - this will be used to push the empty folder.
add .gitignore. use online .gitignore creator
create a src folder which will store all of the files.
inside the src...
create index.js constant.js app.js along with some folders like db,controllers,middlewares,models,routes,utils

use type: module in package.json
install dev dependency prettier and write .prettierrc and .prettierignore with chatgpt.

# Connect Database:

inside the db folder create db/index.js create an async function . inside, use try catch.
  inside the catch use process.exit(1) .
  inside the try block - use connectionInstance =  await mongoose.connect() and print connection
go to src/index.js import dotenv and config properly.  use experimental feature --experimental-json-modules
  in the nodemon dev script. after all of the imports have been completed, your job is to use the           
  dbconnection function in a promise .then .catch method

go to src/app.js import express and configure stuff and  then start writing routes. import the app in the     
  index.js in order to  use it inside the .then as app.listen


# Utils
create src/utils/asyncHandler.js to take advantage of the try catch / promise 
create src/utils/ApiError.js to set the error class overwritten with extends.
create src/utils/ApiResponse.js  to set the response class 

# write models 
src/models/user.model.js  
src/models/video.model.js 
inside src/models/user.model.js, 
 use the pre hook to encrypt the password. dont use annonymous function   
 rather use  an async function keyword. make sure you run the function only when the password is modified.
 then execute next()

 create a new method to check password also, generate refreshToken, generate accessToken,

# Upload files.
install multer , cloudinary
we will first store in out local server then upload to cloudinary server
go to utils/cloudinary.js
  config properly. 
  write a function uploadOnCloudinary async function that takes a local file path. 
  if local path exists, you will use cloudinary upload fcn with proper arguments. 
  use a try catch block since this will take some time. 
  use const response = await cloudinary.upload()
  return the response and response.url 

go to middlewares/multer.middleware.js
  here we will use disk storage. not to use memory storage. 
  multer.diskStorage takes an object with dst fcn. 
  cb will will have public/temp as the path for temporary files
  here we will temporarily store the pics before deleting them after the mongodb  
  upload is complete 


# set up routes and controllers
all the routes are to be linked to the app.js and the route fcns are written in the controllers. 

# Register user. 
go to user.controller.js 


 
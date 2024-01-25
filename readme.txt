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
  console.log(COLORS.FgBlue, "\n\n");
  console.log("req.files   >>>>>>\n");
  console.log(req.files);
  console.log(COLORS.Reset, "\n\n");